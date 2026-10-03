import {
  CreatePhaseCommand,
  PhaseUseCasePort,
  RegenerateAiNarrationCommand,
} from '../../ports/in/phase.use-case.port';
import { PhaseRepositoryPort } from '../../ports/out/phase.repository.port';
import { PartyRepositoryPort } from '../../ports/out/party.repository.port';
import { CharacterRepositoryPort } from '../../ports/out/character.repository.port';
import { AiLoreEnhancerPort } from '../../ports/out/ai-lore-enhancer.port';
import { ImageGeneratorPort } from '../../ports/out/image-generator.port';
import { PhaseEntity } from '../../domain/entities/phase.entity';
import {
  EntityNotFoundException,
  UnauthorizedPartyAccessException,
} from '../../domain/exceptions/domain.exception';

export class PhaseService implements PhaseUseCasePort {
  constructor(
    private readonly phaseRepo: PhaseRepositoryPort,
    private readonly partyRepo: PartyRepositoryPort,
    private readonly characterRepo: CharacterRepositoryPort,
    private readonly aiLoreEnhancer: AiLoreEnhancerPort,
    private readonly imageGenerator: ImageGeneratorPort,
  ) {}

  async createPhase(command: CreatePhaseCommand): Promise<PhaseEntity> {
    const party = await this.partyRepo.findById(command.partyId);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', command.partyId);
    }

    if (!party.isMaster(command.masterId)) {
      throw new UnauthorizedPartyAccessException('Apenas o Mestre pode criar fases para o jogo.');
    }

    const existingPhases = await this.phaseRepo.listByPartyId(party.id);
    const nextPhaseNumber = existingPhases.length + 1;

    // Obtém personagens da party para contextualizar a narrativa da IA
    const characters = await this.characterRepo.listByPartyId(party.id);
    const characterContext = characters.map((c) => ({
      name: c.name,
      race: c.appearance.race,
      class: c.characterClass,
    }));

    const previousPhase = existingPhases.find((p) => p.phaseNumber === nextPhaseNumber - 1);

    // 1. Chama a IA para dar o toque de RPG nas anotações do mestre
    const aiResult = await this.aiLoreEnhancer.enhanceMasterNotes({
      themeTitle: party.themeTitle,
      phaseNumber: nextPhaseNumber,
      masterNotes: command.masterNotes,
      charactersPresent: characterContext,
      previousPhaseSummary: previousPhase?.formattedNarration,
    });

    let imageUrl: string | undefined;
    if (command.autoGenerateImage !== false) {
      const imgResult = await this.imageGenerator.generateSceneImage({
        prompt: aiResult.imagePrompt,
        themeTitle: party.themeTitle,
        phaseNumber: nextPhaseNumber,
      });
      imageUrl = imgResult.imageUrl;
    }

    const phase = await this.phaseRepo.create({
      partyId: party.id,
      phaseNumber: nextPhaseNumber,
      title: command.title.trim(),
      masterNotes: command.masterNotes.trim(),
      formattedNarration: aiResult.formattedNarration,
      aiAtmosphere: aiResult.aiAtmosphere,
      imagePrompt: aiResult.imagePrompt,
      imageUrl,
      suggestedHooks: aiResult.suggestedHooks,
      status: 'PUBLISHED', // Por padrão já publica para os amigos verem
    });

    // Atualiza a fase atual da party
    await this.partyRepo.update(party.id, {
      currentPhaseNumber: nextPhaseNumber,
      status: 'IN_PROGRESS',
    });

    return phase;
  }

  async regenerateAiNarration(command: RegenerateAiNarrationCommand): Promise<PhaseEntity> {
    const phase = await this.phaseRepo.findById(command.phaseId);
    if (!phase) {
      throw new EntityNotFoundException('Fase', command.phaseId);
    }

    const party = await this.partyRepo.findById(phase.partyId);
    if (!party || !party.isMaster(command.masterId)) {
      throw new UnauthorizedPartyAccessException('Apenas o Mestre pode regenerar a narração da fase.');
    }

    const notesToUse = command.updatedMasterNotes || phase.masterNotes;

    const characters = await this.characterRepo.listByPartyId(party.id);
    const characterContext = characters.map((c) => ({
      name: c.name,
      race: c.appearance.race,
      class: c.characterClass,
    }));

    const aiResult = await this.aiLoreEnhancer.enhanceMasterNotes({
      themeTitle: party.themeTitle,
      phaseNumber: phase.phaseNumber,
      masterNotes: notesToUse,
      charactersPresent: characterContext,
    });

    return this.phaseRepo.update(phase.id, {
      masterNotes: notesToUse,
      formattedNarration: aiResult.formattedNarration,
      aiAtmosphere: aiResult.aiAtmosphere,
      imagePrompt: aiResult.imagePrompt,
      suggestedHooks: aiResult.suggestedHooks,
    });
  }

  async generateSceneImage(phaseId: string, masterId: string): Promise<PhaseEntity> {
    const phase = await this.phaseRepo.findById(phaseId);
    if (!phase) {
      throw new EntityNotFoundException('Fase', phaseId);
    }

    const party = await this.partyRepo.findById(phase.partyId);
    if (!party || !party.isMaster(masterId)) {
      throw new UnauthorizedPartyAccessException('Apenas o Mestre pode gerar a imagem da fase.');
    }

    const prompt = phase.imagePrompt || `${party.themeTitle}: ${phase.masterNotes}`;

    const imgResult = await this.imageGenerator.generateSceneImage({
      prompt,
      themeTitle: party.themeTitle,
      phaseNumber: phase.phaseNumber,
    });

    return this.phaseRepo.update(phase.id, {
      imageUrl: imgResult.imageUrl,
    });
  }

  async publishPhase(phaseId: string, masterId: string): Promise<PhaseEntity> {
    const phase = await this.phaseRepo.findById(phaseId);
    if (!phase) {
      throw new EntityNotFoundException('Fase', phaseId);
    }

    const party = await this.partyRepo.findById(phase.partyId);
    if (!party || !party.isMaster(masterId)) {
      throw new UnauthorizedPartyAccessException('Apenas o Mestre pode publicar fases.');
    }

    return this.phaseRepo.update(phase.id, {
      status: 'PUBLISHED',
    });
  }

  async getPhaseById(id: string): Promise<PhaseEntity> {
    const phase = await this.phaseRepo.findById(id);
    if (!phase) {
      throw new EntityNotFoundException('Fase', id);
    }
    return phase;
  }

  async listPhasesByParty(partyId: string): Promise<PhaseEntity[]> {
    return this.phaseRepo.listByPartyId(partyId);
  }

  async getCurrentPhase(partyId: string): Promise<PhaseEntity | null> {
    const party = await this.partyRepo.findById(partyId);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', partyId);
    }
    return this.phaseRepo.findByPartyAndNumber(partyId, party.currentPhaseNumber);
  }
}
