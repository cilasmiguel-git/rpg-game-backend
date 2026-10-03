export type PhaseStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export class PhaseEntity {
  constructor(
    public readonly id: string,
    public readonly partyId: string,
    public readonly phaseNumber: number,
    public readonly title: string,
    public readonly masterNotes: string,
    public readonly formattedNarration: string,
    public readonly aiAtmosphere?: string,
    public readonly imagePrompt?: string,
    public readonly imageUrl?: string,
    public readonly suggestedHooks: string[] = [],
    public readonly status: PhaseStatus = 'DRAFT',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  isPublished(): boolean {
    return this.status === 'PUBLISHED';
  }
}
