import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartyStatus } from '../../../../../core/domain/entities/party.entity';

export class CreatePartyDto {
  @ApiProperty({ example: 'A Maldição de Ravenloft', description: 'Título da sessão de RPG' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'fantasia_medieval',
    description: 'Chave da temática pré-definida (ex: fantasia_medieval, cyberpunk_neon, terror_eldritch)',
  })
  @IsString()
  @IsNotEmpty()
  themeKey: string;

  @ApiPropertyOptional({
    example: 'Uma jornada misteriosa pelas montanhas congeladas de Baróvia.',
    description: 'Breve descrição ou contexto inicial',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'sala123',
    description: 'Senha opcional para proteger a entrada de amigos na sala',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdatePartyStatusDto {
  @ApiProperty({
    enum: ['LOBBY', 'IN_PROGRESS', 'FINISHED'],
    example: 'IN_PROGRESS',
    description: 'Novo status da sessão',
  })
  @IsEnum(['LOBBY', 'IN_PROGRESS', 'FINISHED'])
  status: PartyStatus;
}
