# 🛡️ Guia de Implementação Frontend — RPG Party & Battlemap (Angular + TypeScript)

Este guia define a arquitetura, estrutura de pastas, contratos com Zod, integração com TanStack Query e componentes visuais (Grid tático e Sidebar de jogadores) para a construção do cliente web em **Angular**.

---

## 1. 🌐 Contexto & Integração com o Backend

### 1.1 Informações do Servidor
* **URL Base de Produção (Vercel)**: `https://rpg-game-backend.vercel.app/api`
* **Documentação Swagger Interativa**: `https://rpg-game-backend.vercel.app/docs`
* **Autenticação**: Bearer Token (JWT).
  * **Mestre**: Gerado via `/api/auth/login-master` ou `/api/auth/register-master`.
  * **Jogador Convidado**: Gerado via `/api/auth/join-guest` (vinculado ao código da sala).

### 1.2 Resumo dos Endpoints Principais
| Módulo | Método | Rota | Descrição |
| :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/health/db` | Ping e latência do MongoDB Atlas |
| **Auth** | `POST` | `/auth/register-master` | Criação de conta do Mestre |
| **Auth** | `POST` | `/auth/login-master` | Autenticação do Mestre |
| **Auth** | `POST` | `/auth/join-guest` | Entrada de jogador via código da sala |
| **Auth** | `GET` | `/auth/me` | Dados do usuário logado (Mestre/Jogador) |
| **Themes** | `GET` | `/themes` | Catálogo de skins, raças e vestimentas |
| **Themes** | `GET` | `/themes/:key` | Detalhes visuais de uma temática |
| **Parties** | `POST` | `/parties` | Criação de nova sala pelo Mestre |
| **Parties** | `GET` | `/parties/code/:code` | Lobby e lista de personagens da sala |
| **Parties** | `PATCH` | `/parties/:id/status` | Altera status (`LOBBY`, `IN_PROGRESS`, `FINISHED`) |
| **Characters** | `POST` | `/parties/:partyId/characters` | Criação visual detalhada de personagem |
| **Characters** | `GET` | `/parties/:partyId/characters` | Lista personagens da party |
| **Characters** | `PATCH` | `/characters/:id/ready` | Alterna status "Pronto" |
| **Phases (IA)** | `POST` | `/parties/:partyId/phases` | Mestre cria fase (IA narra e gera imagem) |
| **Phases (IA)** | `GET` | `/parties/:partyId/phases/current` | Dados da fase ativa da sessão |

---

## 2. 🚀 Stack Tecnológica Recomendada

1. **Angular 19+** (Standalone Components, Signals, Directives, novo Control Flow `@if` / `@for`).
2. **TypeScript 5.x** (Strict mode habilitado).
3. **Zod** (`zod`): Validação em tempo de execução dos retornos da API e tipagem inferida segura (`z.infer<T>`).
4. **TanStack Query para Angular** (`@tanstack/angular-query-experimental`): Gerenciamento de cache, revalidação automática, mutations e estados de loading/error.
5. **Lucide Angular** (`lucide-angular`): Ícones modernos de RPG (espadas, escudos, dados, coração, mana).
6. **TailwindCSS**: Estilização temática Dark Fantasy / Cyberpunk com suporte a Grid flexível.

---

## 3. 📂 Estrutura de Pastas Sugerida no Angular

```text
src/app/
├── core/
│   ├── config/
│   │   └── api.config.ts            # URL base e constantes
│   ├── guards/
│   │   ├── auth.guard.ts            # Proteção de rotas autenticadas
│   │   └── master.guard.ts          # Proteção exclusiva para Mestre
│   ├── interceptors/
│   │   └── auth.interceptor.ts      # Injeção automática do Bearer Token
│   └── services/
│       └── storage.service.ts       # Armazenamento de token / sessão
├── data/
│   ├── schemas/                     # Contratos e Schemas Zod + Tipos TS
│   │   ├── auth.schema.ts
│   │   ├── party.schema.ts
│   │   ├── character.schema.ts
│   │   └── phase.schema.ts
│   └── queries/                     # Hooks do TanStack Query Angular
│       ├── auth.queries.ts
│       ├── party.queries.ts
│       ├── character.queries.ts
│       └── phase.queries.ts
├── features/
│   ├── auth/                        # Telas de Login Mestre e Entrada de Convidado
│   ├── lobby/                       # Sala de espera com link de convite e lista de heróis
│   ├── character-creator/           # Seletor visual de skins, cores, vestimentas e armas
│   └── game-session/                # TELA PRINCIPAL DO JOGO
│       ├── components/
│       │   ├── battlemap-grid/      # GRID TÁTICO DE MOVIMENTAÇÃO DOS PERSONAGENS
│       │   ├── party-sidebar/       # LATERAL COM DADOS DOS USUÁRIOS E HERÓIS
│       │   └── phase-narrative/     # CENA COM IMAGEM E NARRAÇÃO GERADA POR IA
│       ├── game-session.component.ts
│       └── game-session.component.html
└── shared/
    ├── components/
    │   ├── button/
    │   ├── modal/
    │   └── badge/
    └── utils/
        └── zod-validator.ts
```

---

## 4. 📐 Schemas Zod & Tipos TypeScript

### `src/app/data/schemas/character.schema.ts`
```typescript
import { z } from 'zod';

export const CharacterAppearanceSchema = z.object({
  sex: z.enum(['MASCULINO', 'FEMININO', 'ANDROGINO', 'OUTRO']),
  race: z.string(),
  skinColor: z.string(),
  hairStyle: z.string(),
  hairColor: z.string(),
  eyeColor: z.string(),
  bodyType: z.string(),
  facialFeatures: z.string().nullable().optional(),
  outfitType: z.string(),
  outfitPrimaryColor: z.string(),
  outfitSecondaryColor: z.string().nullable().optional(),
  mainWeapon: z.string().nullable().optional(),
  headgear: z.string().nullable().optional(),
  accessory: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const CharacterSchema = z.object({
  id: z.string(),
  partyId: z.string(),
  userId: z.string().nullable().optional(),
  playerName: z.string(),
  name: z.string(),
  characterClass: z.string().nullable().optional(),
  appearance: CharacterAppearanceSchema,
  health: z.number().default(100),
  maxHealth: z.number().default(100),
  energy: z.number().default(50),
  bio: z.string().nullable().optional(),
  isReady: z.boolean().default(false),
  // Posição no Grid tático (gerenciado localmente ou persistido)
  gridPosition: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
});

export type Character = z.infer<typeof CharacterSchema>;
export type CharacterAppearance = z.infer<typeof CharacterAppearanceSchema>;
```

### `src/app/data/schemas/party.schema.ts`
```typescript
import { z } from 'zod';
import { CharacterSchema } from './character.schema';

export const PartyStatusSchema = z.enum(['LOBBY', 'IN_PROGRESS', 'FINISHED']);

export const PartySchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  themeKey: z.string(),
  themeTitle: z.string(),
  status: PartyStatusSchema,
  currentPhaseNumber: z.number(),
  masterId: z.string(),
  characters: z.array(CharacterSchema).optional(),
});

export type Party = z.infer<typeof PartySchema>;
export type PartyStatus = z.infer<typeof PartyStatusSchema>;
```

### `src/app/data/schemas/phase.schema.ts`
```typescript
import { z } from 'zod';

export const PhaseSchema = z.object({
  id: z.string(),
  partyId: z.string(),
  phaseNumber: z.number(),
  title: z.string(),
  masterNotes: z.string(),
  formattedNarration: z.string(),
  aiAtmosphere: z.string().nullable().optional(),
  imagePrompt: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  suggestedHooks: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED']),
});

export type Phase = z.infer<typeof PhaseSchema>;
```

---

## 5. ⚡ TanStack Query no Angular (`app.config.ts` e Queries)

### `src/app/app.config.ts`
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { QueryClient, provideAngularQuery } from '@tanstack/angular-query-experimental';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAngularQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 10, // 10 segundos
            refetchOnWindowFocus: false,
          },
        },
      }),
    ),
  ],
};
```

### `src/app/data/queries/party.queries.ts`
```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { PartySchema, Party } from '../schemas/party.schema';
import { CharacterSchema, Character } from '../schemas/character.schema';
import { PhaseSchema, Phase } from '../schemas/phase.schema';

const API_URL = 'https://rpg-game-backend.vercel.app/api';

@Injectable({ providedIn: 'root' })
export class PartyQueriesService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  // Hook para buscar a party e personagens em tempo real (com polling no lobby/jogo)
  useParty(partyCode: () => string) {
    return injectQuery(() => ({
      queryKey: ['party', partyCode()],
      queryFn: async (): Promise<Party> => {
        const data = await firstValueFrom(
          this.http.get(`${API_URL}/parties/code/${partyCode()}`)
        );
        return PartySchema.parse(data);
      },
      refetchInterval: 3000, // Atualiza a cada 3s para sincronizar jogadores e fases
    }));
  }

  // Hook para buscar a fase atual narrada por IA
  useCurrentPhase(partyId: () => string) {
    return injectQuery(() => ({
      queryKey: ['phase', 'current', partyId()],
      queryFn: async (): Promise<Phase> => {
        const data = await firstValueFrom(
          this.http.get(`${API_URL}/parties/${partyId()}/phases/current`)
        );
        return PhaseSchema.parse(data);
      },
      enabled: !!partyId(),
    }));
  }

  // Alternar status 'Pronto' do jogador
  useToggleReadyMutation() {
    return injectMutation(() => ({
      mutationFn: async (characterId: string) => {
        return firstValueFrom(
          this.http.patch(`${API_URL}/characters/${characterId}/ready`, {})
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['party'] });
      },
    }));
  }
}
```

---

## 6. 🎮 Componente da Tela de Jogo: Grid Tático + Sidebar de Usuários

A tela de sessão de jogo organiza-se em duas colunas principais:
1. **Lado Esquerdo/Central**: O **Battlemap Grid** interativo para movimentação com tokens, obstáculos e alcance.
2. **Lado Direito**: A **Sidebar de Usuários & Narrativa da IA**, exibindo a vida, energia, status dos amigos e o cenário da fase.

### 6.1 Componente do Grid Tático (`battlemap-grid.component.ts`)
```typescript
import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../data/schemas/character.schema';

interface GridCell {
  x: number;
  y: number;
  isObstacle: boolean;
  occupant?: Character;
}

@Component({
  selector: 'app-battlemap-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="battlemap-container">
      <div class="grid-controls">
        <span class="badge">Tamanho do Mapa: {{ gridSize() }}x{{ gridSize() }}</span>
        <span *ngIf="selectedCharacter()" class="badge active-turn">
          Vez de: <strong>{{ selectedCharacter()?.name }}</strong> (Clique em uma célula vizinha para mover)
        </span>
      </div>

      <!-- Tabuleiro Grid -->
      <div 
        class="grid-board"
        [style.gridTemplateColumns]="'repeat(' + gridSize() + ', minmax(0, 1fr))'"
      >
        @for (row of grid(); track $index) {
          @for (cell of row; track cell.x + '-' + cell.y) {
            <div 
              class="grid-cell"
              [class.obstacle]="cell.isObstacle"
              [class.highlight]="isCellReachable(cell)"
              (click)="onCellClick(cell)"
            >
              <!-- Token do Personagem se estiver na célula -->
              @if (cell.occupant) {
                <div 
                  class="token"
                  [class.selected]="selectedCharacter()?.id === cell.occupant?.id"
                  [style.borderColor]="cell.occupant?.appearance?.outfitPrimaryColor || '#eab308'"
                  [title]="cell.occupant?.name + ' (' + cell.occupant?.playerName + ')'"
                >
                  <span class="token-initials">{{ cell.occupant?.name?.charAt(0) }}</span>
                  <div class="token-hp-bar">
                    <div 
                      class="hp-fill" 
                      [style.width.%]="(cell.occupant.health / cell.occupant.maxHealth) * 100"
                    ></div>
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .battlemap-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #12141a;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid #2a2e3d;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .grid-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .badge {
      background: #1e2230;
      color: #94a3b8;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
    }
    .active-turn {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
      border: 1px solid rgba(234, 179, 8, 0.3);
    }
    .grid-board {
      display: grid;
      gap: 3px;
      background: #181b24;
      padding: 10px;
      border-radius: 0.75rem;
      border: 2px solid #2a2e3d;
      aspect-ratio: 1 / 1;
      max-width: 650px;
      margin: 0 auto;
    }
    .grid-cell {
      background: #1f2430;
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
    }
    .grid-cell:hover {
      background: #2b3244;
      border-color: #6366f1;
    }
    .grid-cell.highlight {
      background: rgba(99, 102, 241, 0.2);
      border-color: #818cf8;
    }
    .token {
      width: 82%;
      height: 82%;
      border-radius: 50%;
      border: 2px solid #eab308;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
      position: relative;
    }
    .token.selected {
      box-shadow: 0 0 15px #eab308;
      transform: scale(1.08);
    }
    .token-hp-bar {
      position: absolute;
      bottom: -4px;
      width: 85%;
      height: 4px;
      background: #334155;
      border-radius: 2px;
      overflow: hidden;
    }
    .hp-fill {
      height: 100%;
      background: #22c55e;
    }
  `]
})
export class BattlemapGridComponent {
  gridSize = signal<number>(10); // 10x10
  selectedCharacter = signal<Character | null>(null);
  
  // Mapa de posições { [charId]: { x, y } }
  positions = signal<Record<string, { x: number; y: number }>>({});

  @Input() set characters(chars: Character[]) {
    // Inicializa posições padrão para os personagens se ainda não tiverem
    const current = { ...this.positions() };
    chars.forEach((c, idx) => {
      if (!current[c.id]) {
        current[c.id] = { x: idx % this.gridSize(), y: Math.floor(idx / this.gridSize()) };
      }
    });
    this.positions.set(current);
    if (!this.selectedCharacter() && chars.length > 0) {
      this.selectedCharacter.set(chars[0]);
    }
  }

  // Gera matriz computada do Grid
  grid = computed(() => {
    const size = this.gridSize();
    const pos = this.positions();
    const matrix: GridCell[][] = [];

    for (let y = 0; y < size; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < size; x++) {
        // Encontra o ocupante nesta célula
        const occupantId = Object.keys(pos).find(id => pos[id].x === x && pos[id].y === y);
        row.push({
          x,
          y,
          isObstacle: false,
          occupant: occupantId ? ({ id: occupantId, name: occupantId } as any) : undefined,
        });
      }
      matrix.push(row);
    }
    return matrix;
  });

  isCellReachable(cell: GridCell): boolean {
    const selected = this.selectedCharacter();
    if (!selected) return false;
    const pos = this.positions()[selected.id];
    if (!pos) return false;
    // Movimento adjacente (distância manhattan = 1)
    const dist = Math.abs(cell.x - pos.x) + Math.abs(cell.y - pos.y);
    return dist === 1 && !cell.occupant;
  }

  onCellClick(cell: GridCell) {
    if (cell.occupant) {
      this.selectedCharacter.set(cell.occupant);
      return;
    }
    const selected = this.selectedCharacter();
    if (selected && this.isCellReachable(cell)) {
      // Move o personagem para a nova célula
      this.positions.update(prev => ({
        ...prev,
        [selected.id]: { x: cell.x, y: cell.y }
      }));
    }
  }
}
```

---

### 6.2 Componente da Sidebar de Usuários & Narrativa (`party-sidebar.component.ts`)
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../data/schemas/character.schema';
import { Party } from '../../../data/schemas/party.schema';
import { Phase } from '../../../data/schemas/phase.schema';

@Component({
  selector: 'app-party-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar-container">
      <!-- 1. Cabeçalho da Campanha -->
      <div class="party-header">
        <h2 class="title">{{ party?.title }}</h2>
        <div class="code-pill">
          <span>Código: <strong>{{ party?.code }}</strong></span>
          <button (click)="copyCode()" class="btn-icon">📋</button>
        </div>
      </div>

      <!-- 2. Fase Atual & Narrativa da IA -->
      @if (currentPhase) {
        <div class="phase-card">
          <div class="phase-badge">Fase {{ currentPhase.phaseNumber }}: {{ currentPhase.title }}</div>
          
          @if (currentPhase.imageUrl) {
            <img [src]="currentPhase.imageUrl" alt="Cena da Fase" class="scene-image" />
          }

          <p class="narration-text">"{{ currentPhase.formattedNarration }}"</p>
          
          @if (currentPhase.aiAtmosphere) {
            <div class="atmosphere">
              <em>🕯️ Atmosfera: {{ currentPhase.aiAtmosphere }}</em>
            </div>
          }
        </div>
      }

      <!-- 3. Lista de Usuários e Personagens Conectados -->
      <div class="characters-section">
        <h3 class="section-title">Heróis na Mesa ({{ characters?.length || 0 }})</h3>
        
        <div class="characters-list">
          @for (char of characters; track char.id) {
            <div class="character-card" [class.ready]="char.isReady">
              <!-- Avatar e Cores de Skin -->
              <div 
                class="avatar-circle"
                [style.backgroundColor]="char.appearance.skinColor"
                [style.borderColor]="char.appearance.outfitPrimaryColor"
              >
                <span>{{ char.name.charAt(0) }}</span>
              </div>

              <!-- Detalhes do Herói -->
              <div class="char-details">
                <div class="char-name-row">
                  <span class="name">{{ char.name }}</span>
                  <span class="player-tag">({{ char.playerName }})</span>
                </div>
                
                <span class="class-info">{{ char.characterClass || 'Aventureiro' }} • {{ char.appearance.race }}</span>

                <!-- Barras de HP e Mana/Energia -->
                <div class="stats-row">
                  <div class="stat-bar hp">
                    <div class="stat-fill" [style.width.%]="(char.health / char.maxHealth) * 100"></div>
                    <span class="stat-label">HP {{ char.health }}/{{ char.maxHealth }}</span>
                  </div>
                  <div class="stat-bar energy">
                    <div class="stat-fill" [style.width.%]="(char.energy / 100) * 100"></div>
                    <span class="stat-label">MP {{ char.energy }}</span>
                  </div>
                </div>
              </div>

              <!-- Status Pronto -->
              <div class="ready-badge" [class.active]="char.isReady">
                {{ char.isReady ? '✔ Pronto' : '⏳ Preparando' }}
              </div>
            </div>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: 380px;
      background: #141721;
      border: 1px solid #232838;
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      color: #f1f5f9;
      height: 100%;
      overflow-y: auto;
    }
    .party-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #232838;
      padding-bottom: 0.75rem;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0;
    }
    .code-pill {
      background: #1e2433;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      border: 1px solid #333c52;
    }
    .phase-card {
      background: #1b202e;
      border: 1px solid #2d354b;
      padding: 1rem;
      border-radius: 0.75rem;
    }
    .phase-badge {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: #818cf8;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .scene-image {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .narration-text {
      font-size: 0.9rem;
      line-height: 1.4;
      color: #cbd5e1;
      font-style: italic;
    }
    .atmosphere {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .character-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #181d2a;
      padding: 0.75rem;
      border-radius: 0.6rem;
      border: 1px solid #262e42;
      margin-bottom: 0.6rem;
    }
    .character-card.ready {
      border-color: rgba(34, 197, 94, 0.4);
    }
    .avatar-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #0f172a;
      flex-shrink: 0;
    }
    .char-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .char-name-row {
      display: flex;
      gap: 0.4rem;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .player-tag {
      color: #64748b;
      font-size: 0.8rem;
    }
    .class-info {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .stats-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.2rem;
    }
    .stat-bar {
      flex: 1;
      height: 12px;
      background: #0f172a;
      border-radius: 3px;
      position: relative;
      overflow: hidden;
    }
    .stat-bar.hp .stat-fill { background: #ef4444; }
    .stat-bar.energy .stat-fill { background: #3b82f6; }
    .stat-label {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .ready-badge {
      font-size: 0.7rem;
      color: #94a3b8;
    }
    .ready-badge.active {
      color: #22c55e;
      font-weight: bold;
    }
  `]
})
export class PartySidebarComponent {
  @Input() party?: Party;
  @Input() characters: Character[] = [];
  @Input() currentPhase?: Phase;

  copyCode() {
    if (this.party?.code) {
      navigator.clipboard.writeText(this.party.code);
      alert('Código da sala copiado!');
    }
  }
}
```

---

## 7. 🚀 Passos Rápidos para Inicializar o Projeto Angular

1. **Criar a aplicação Angular**:
   ```bash
   npx -y @angular/cli@latest new rpg-frontend --routing --style=scss --ssr=false
   cd rpg-frontend
   ```

2. **Instalar Zod e TanStack Query**:
   ```bash
   npm install zod @tanstack/angular-query-experimental lucide-angular
   ```

3. **Configurar a URL da API na Vercel**:
   No arquivo `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://rpg-game-backend.vercel.app/api',
   };
   ```

4. **Executar a aplicação localmente**:
   ```bash
   npm start
   ```
