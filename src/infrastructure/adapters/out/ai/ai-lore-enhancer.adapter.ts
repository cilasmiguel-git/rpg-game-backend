import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AiLoreEnhancerPort,
  EnhanceLoreInput,
  EnhanceLoreResult,
} from '../../../../core/ports/out/ai-lore-enhancer.port';

@Injectable()
export class AiLoreEnhancerAdapter implements AiLoreEnhancerPort {
  private readonly openAiKey?: string;
  private readonly geminiKey?: string;
  private readonly aiModel: string;

  constructor(private readonly config: ConfigService) {
    this.openAiKey = this.config.get<string>('OPENAI_API_KEY');
    this.geminiKey = this.config.get<string>('GEMINI_API_KEY');
    this.aiModel = this.config.get<string>('AI_MODEL') || 'gpt-4o-mini';
  }

  async enhanceMasterNotes(input: EnhanceLoreInput): Promise<EnhanceLoreResult> {
    if (this.openAiKey && this.openAiKey.trim() !== '') {
      try {
        return await this.callOpenAi(input);
      } catch (error: any) {
        console.warn('Erro ao chamar OpenAI. Usando motor nativo de narrativa RPG.', error?.message);
      }
    }

    if (this.geminiKey && this.geminiKey.trim() !== '') {
      try {
        return await this.callGemini(input);
      } catch (error: any) {
        console.warn('Erro ao chamar Gemini. Usando motor nativo de narrativa RPG.', error?.message);
      }
    }

    return this.fallbackNarrativeEngine(input);
  }

  private async callOpenAi(input: EnhanceLoreInput): Promise<EnhanceLoreResult> {
    const systemPrompt = `Você é um assistente de Mestre de RPG experiente. 
REGRAS CRÍTICAS:
1. O Mestre é quem manda na história. NÃO escreva a história por ele. NÃO mude os acontecimentos que ele escreveu.
2. Seu trabalho é dar o "toque de RPG": organizar as anotações dele em uma prosa de narração rica, imersiva e sensorial (sons, cheiros, iluminação, tensão).
3. Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "formattedNarration": "Texto polido e épico para o mestre ler para os jogadores, fiel às anotações dele",
  "aiAtmosphere": "Resumo de 1 frase do clima/ambiente (ex: Névoa densa, cheiro de ozônio e perigo iminente)",
  "imagePrompt": "Prompt detalhado em inglês para gerar uma ilustração conceitual marcante dessa fase (digital art, atmospheric lighting, rpg concept art)",
  "suggestedHooks": ["Gancho 1 para ação dos jogadores", "Gancho 2", "Gancho 3"]
}`;

    const userPrompt = `Temática da Campanha: ${input.themeTitle}
Fase Número: ${input.phaseNumber}
Personagens presentes no grupo: ${input.charactersPresent?.map((c) => `${c.name} (${c.race} ${c.class || ''})`).join(', ') || 'Aventureiros'}
Contexto anterior: ${input.previousPhaseSummary || 'Início da jornada'}

Anotações do Mestre para esta fase:
"${input.masterNotes}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openAiKey}`,
      },
      body: JSON.stringify({
        model: this.aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      formattedNarration: content.formattedNarration,
      aiAtmosphere: content.aiAtmosphere,
      imagePrompt: content.imagePrompt,
      suggestedHooks: content.suggestedHooks || [],
    };
  }

  private async callGemini(input: EnhanceLoreInput): Promise<EnhanceLoreResult> {
    const prompt = `Você é um co-mestre de RPG. Não mude o enredo do mestre, apenas organize as anotações dele em narração imersiva de RPG.
Tema: ${input.themeTitle}. Fase ${input.phaseNumber}.
Anotações do mestre: "${input.masterNotes}".
Retorne APENAS um JSON válido no formato:
{
  "formattedNarration": "texto narrativo imersivo",
  "aiAtmosphere": "clima da cena",
  "imagePrompt": "prompt em inglês para ilustrar a cena",
  "suggestedHooks": ["gancho 1", "gancho 2"]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const content = JSON.parse(rawText);

    return {
      formattedNarration: content.formattedNarration,
      aiAtmosphere: content.aiAtmosphere,
      imagePrompt: content.imagePrompt,
      suggestedHooks: content.suggestedHooks || [],
    };
  }

  /**
   * Motor nativo de narrativa RPG caso nenhuma chave de IA externa esteja presente no momento.
   * Dá o acabamento RPG preservando 100% da essência do que o mestre escreveu.
   */
  private fallbackNarrativeEngine(input: EnhanceLoreInput): EnhanceLoreResult {
    const raw = input.masterNotes.trim();
    const theme = input.themeTitle;
    const phaseNum = input.phaseNumber;

    const formattedNarration = `[Fase ${phaseNum} • ${theme}]
O silêncio do ambiente é quebrado quando o grupo se depara com o cenário à frente. 

${raw}

O ar ao redor carrega o peso das escolhas do grupo. Cada detalhe ao redor parece testar a coragem e a prontidão dos aventureiros. Os olhares se cruzam: é hora de decidir o próximo passo.`;

    const aiAtmosphere = `Cenário de ${theme}, clima tenso e envolvente com foco em: ${raw.slice(0, 80)}...`;

    const imagePrompt = `Epic RPG scene illustration, ${theme}, cinematic atmosphere, dramatic lighting, detailed concept art: ${raw.replace(/["\n]/g, ' ')}`;

    const suggestedHooks = [
      'Investigar detalhadamente os arredores ou vestígios deixados para trás.',
      'Avançar com cautela em formação tática mantendo guarda alta.',
      'Interagir diretamente com o ponto central ou indivíduo mencionado pelo mestre.',
    ];

    return {
      formattedNarration,
      aiAtmosphere,
      imagePrompt,
      suggestedHooks,
    };
  }
}
