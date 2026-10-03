import { ThemeEntity } from '../../domain/entities/theme.entity';

export const PREDEFINED_THEMES: ThemeEntity[] = [
  new ThemeEntity(
    'fantasia_medieval',
    'Fantasia Medieval & Masmorras',
    'Castelos ancestrais, masmorras esquecidas, monstros e magia arcana.',
    'Medieval Fantasy',
    [
      { id: 'humano', name: 'Humano', description: 'Versátil, determinado e adaptável.' },
      { id: 'elfo_silvestre', name: 'Elfo Silvestre', description: 'Ágil, visão aguçada e afinidade com a natureza.' },
      { id: 'anao_colinas', name: 'Anão das Colinas', description: 'Resistente, forte e mestre das forjas.' },
      { id: 'tiefling', name: 'Tiefling', description: 'Herança infernal, chifres e olhar penetrante.' },
      { id: 'draconato', name: 'Draconato', description: 'Escamas imponentes e bafo elemental.' },
      { id: 'meio_orc', name: 'Meio-Orc', description: 'Vigor indomável e fúria em combate.' }
    ],
    [
      { id: 'careca', name: 'Raspado / Careca' },
      { id: 'curto_desalinhado', name: 'Curto Desalinhado' },
      { id: 'trancas_guerreiro', name: 'Tranças de Batalha Nórdicas' },
      { id: 'longo_liso', name: 'Longo e Sedoso' },
      { id: 'coque_samurai', name: 'Coque de Guerreiro' },
      { id: 'ondulado_selvagem', name: 'Ondulado Selvagem' }
    ],
    [
      { id: 'esguio', name: 'Esguio & Ágil' },
      { id: 'atletico', name: 'Atlético & Definido' },
      { id: 'robusto', name: 'Robusto & Imponente' },
      { id: 'pequeno', name: 'Baixo & Ágil' }
    ],
    [
      { id: 'armadura_placas', name: 'Armadura Completa de Placas de Aço' },
      { id: 'cota_malha', name: 'Cota de Malha com Gibão de Couro' },
      { id: 'traje_couro_batido', name: 'Traje de Couro Batido de Caçador' },
      { id: 'tunica_mago_runica', name: 'Túnica Arcana Bordada em Runas' },
      { id: 'farrapos_andarilho', name: 'Vestes de Viajante com Manto Escuro' },
      { id: 'vestes_clerigo', name: 'Vestimenta Sagrada Cerimonial' }
    ],
    [
      { id: 'espada_longa', name: 'Espada Longa de Duas Mãos' },
      { id: 'arco_composto', name: 'Arco Composto Élfico' },
      { id: 'cajado_cristal', name: 'Cajado com Cristal Elemental' },
      { id: 'adagas_duplas', name: 'Adagas Duplas Envenenadas' },
      { id: 'martelo_guerra', name: 'Martelo de Guerra Anão' },
      { id: 'rapieira_graciosa', name: 'Rapieira de Duelo Refinada' }
    ],
    [
      { id: 'nenhum', name: 'Sem elmo / Rosto descoberto' },
      { id: 'capuz_sombrio', name: 'Capuz de Veludo Sombrio' },
      { id: 'elmo_cavaleiro', name: 'Elmo Fechado de Cavaleiro' },
      { id: 'tiara_elfica', name: 'Diadema de Prata Élfica' },
      { id: 'coroa_ossos', name: 'Coroa de Ossos e Runas' }
    ],
    [
      { id: 'capa_viagem', name: 'Capa Longa Resistente a Chuva' },
      { id: 'amuleto_sagrado', name: 'Amuleto com Símbolo de Fé' },
      { id: 'bolsa_pocao', name: 'Cinto com Frascos de Alquimia' },
      { id: 'corda_escalada', name: 'Corda de Seda Élfica e Gancho' }
    ],
    ['#fbe3d5', '#e4b590', '#b97d55', '#6b4423', '#2d1c10', '#8fa382', '#93b5c6'],
    ['#0a0a0a', '#3b2512', '#7b4c27', '#c9933e', '#e5e5e5', '#a83232', '#3b82f6'],
    ['#1e293b', '#7c2d12', '#14532d', '#1e1b4b', '#78350f', '#312e81', '#374151'],
    'Narrativa clássica de fantasia medieval sombria, com atmosfera imersiva, tavernas úmidas, ruínas antigas e sensação de perigo tático.'
  ),
  new ThemeEntity(
    'cyberpunk_neon',
    'Cyberpunk Distópico 2088',
    'Megacorporações implacáveis, becos iluminados a neon, chuva ácida e cibernética.',
    'Cyberpunk / Sci-Fi',
    [
      { id: 'humano_modificado', name: 'Humano Aumentado', description: 'Próteses cibernéticas leves e implantes neurais.' },
      { id: 'cyborg_completo', name: 'Cyborg de Chassi Completo', description: 'Corpo quase 100% mecânico de titânio fosco.' },
      { id: 'androide_sintetico', name: 'Sintético / Réplica', description: 'Pele sintética perfeita com olhos bioluminescentes.' },
      { id: 'bio_mutante', name: 'Bio-Mutante do Subsolo', description: 'Alterações genéticas clandestinas para sobrevivência extrema.' }
    ],
    [
      { id: 'moicano_neon', name: 'Moicano Iluminado a Fibra Óptica' },
      { id: 'undercut_cibernetico', name: 'Undercut com Conector Neural' },
      { id: 'cabelo_curto_prata', name: 'Curto Prata Holográfico' },
      { id: 'trancas_neon', name: 'Dreadlocks com Tubos LED' },
      { id: 'raspado_tatuado', name: 'Raspado com Circuitos Tatuados' }
    ],
    [
      { id: 'atletico_cibernetico', name: 'Atlético Reforçado' },
      { id: 'esguio_hacker', name: 'Esguio & Discreto' },
      { id: 'tanque_pesado', name: 'Armação Pesada Corporativa' }
    ],
    [
      { id: 'sobretudo_neon', name: 'Sobretudo de Couro Sintético com LED' },
      { id: 'traje_tatica_urbana', name: 'Colete Kevlar & Calça Utilitária Tática' },
      { id: 'jaqueta_motoqueiro', name: 'Jaqueta Bomber Holográfica' },
      { id: 'terno_executivo_blindado', name: 'Terno Corporativo à Prova de Balas' },
      { id: 'roupa_underground', name: 'Capuz Streetwear com Máscara de Gás' }
    ],
    [
      { id: 'pistola_smart', name: 'Pistola Smart com Mira Teleguiada' },
      { id: 'katana_mono_molecular', name: 'Katana Monomolecular Térmica' },
      { id: 'rifle_plasma', name: 'Rifle de Plasma Bullpup' },
      { id: 'deck_cyber', name: 'Cyberdeck Militar para Invasão' },
      { id: 'escopeta_cinetica', name: 'Escopeta Cinética Pesada' }
    ],
    [
      { id: 'oculos_ar', name: 'Óculos de Realidade Aumentada (HUD)' },
      { id: 'mascara_neon', name: 'Máscara Respiradora Neon' },
      { id: 'implante_ocular', name: 'Olho Biônico com Laser Vermelho' },
      { id: 'capacete_piloto', name: 'Capacete com Visor Holográfico' }
    ],
    [
      { id: 'cabo_neural', name: 'Cabos de Interface Expostos' },
      { id: 'drones_vigia', name: 'Mini Drone Flutuante de Reconhecimento' },
      { id: 'coldre_mag', name: 'Coldres Magnéticos nas Pernas' }
    ],
    ['#ffe0bd', '#c68642', '#3d2314', '#e0e0e0', '#22d3ee', '#ec4899'],
    ['#00f0ff', '#ff007f', '#39ff14', '#ffffff', '#111827', '#a855f7'],
    ['#09090b', '#18181b', '#0284c7', '#db2777', '#84cc16', '#e11d48'],
    'Narrativa rápida, gírias urbanas, tensão tecnológica, paranoia corporativa, chuva e reflexos neon na escuridão.'
  ),
  new ThemeEntity(
    'terror_eldritch',
    'Terror Cósmico & Mistério Vitoriano',
    'Névoa espessa, cultistas nos becos, livros proibidos e horrores indescritíveis além das estrelas.',
    'Cosmic Horror',
    [
      { id: 'investigador', name: 'Investigador Cético', description: 'Mente analítica e determinação contra o desconhecido.' },
      { id: 'erudito_ocultista', name: 'Erudito do Oculto', description: 'Conhecimento de línguas mortas e rituais proibidos.' },
      { id: 'alienado_toque', name: 'Tocado pelo Vazio', description: 'Vislumbrou a loucura além do véu e sobreviveu.' },
      { id: 'veterano_guerra', name: 'Veterano de Guerra', description: 'Habilidades com armas e nervos de aço sob pressão.' }
    ],
    [
      { id: 'penteado_vitoriano', name: 'Penteado Vitoriano Alinhado' },
      { id: 'desalinhado_insonia', name: 'Cabelo Desgrenhado de Insônia' },
      { id: 'coque_pesquisadora', name: 'Coque Severo com Grampos' },
      { id: 'cabelo_grisalho_precoce', name: 'Grisalho Precoce pelo Pavor' }
    ],
    [
      { id: 'magro_academico', name: 'Esguio & Rosto Cansado' },
      { id: 'medio_solido', name: 'Estatura Média Discreta' },
      { id: 'alto_esguio', name: 'Alto com Postura Rígida' }
    ],
    [
      { id: 'sobretudo_vitoriano', name: 'Sobretudo Pesado de Lã com Gola Alta' },
      { id: 'vestido_luto', name: 'Vestido Vitoriano de Luto Fechado' },
      { id: 'terno_tres_pecas', name: 'Terno de Três Peças com Relógio de Bolso' },
      { id: 'casaco_marujo', name: 'Casaco Grosso de Marinheiro Mercante' }
    ],
    [
      { id: 'revolver_polvora', name: 'Revólver .38 de Tambor de Seis Tiros' },
      { id: 'lampião_e_adaga', name: 'Lampião a Querosene e Adaga de Prata' },
      { id: 'bengala_estoque', name: 'Bengala Elegante com Lâmina Oculta' },
      { id: 'grimorio_antigo', name: 'Tomo Encadernado em Couro Estranho' }
    ],
    [
      { id: 'chapeu_cartola', name: 'Cartola Vitoriana Elegante' },
      { id: 'chapeu_fedora', name: 'Chapéu Fedora Abafado' },
      { id: 'veu_luto', name: 'Véu Negro Semitransparente' },
      { id: 'boina_escocesa', name: 'Boina de Lã Desgastada' }
    ],
    [
      { id: 'lupa_investigador', name: 'Lupa e Caderno de Anotações Manchado' },
      { id: 'relogio_bolso', name: 'Relógio de Bolso que Às Vezes Anda ao Contrário' },
      { id: 'crucifixo_entalhado', name: 'Talismã Gravado com Símbolos Que Perturbam a Vista' }
    ],
    ['#fdf4e7', '#f4ebd0', '#deb887', '#5c4033', '#1c1b18'],
    ['#171717', '#4a3b32', '#78350f', '#a3a3a3', '#fafafa'],
    ['#09090b', '#1c1917', '#2e1065', '#365314', '#1e293b'],
    'Narrativa psicológica, suspense claustrofóbico, cheiro de maresia e mofo, detalhes arrepiantes e a sensação iminente de algo colossal espreitando.'
  )
];
