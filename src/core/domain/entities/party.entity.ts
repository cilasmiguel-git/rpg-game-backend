export type PartyStatus = 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';

export class PartyEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly title: string,
    public readonly themeKey: string,
    public readonly themeTitle: string,
    public readonly masterId: string,
    public readonly description?: string,
    public readonly password?: string,
    public readonly status: PartyStatus = 'LOBBY',
    public readonly currentPhaseNumber: number = 1,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  canJoin(): boolean {
    return this.status !== 'FINISHED';
  }

  isMaster(userId: string): boolean {
    return this.masterId === userId;
  }
}
