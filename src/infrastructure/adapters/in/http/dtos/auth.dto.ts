import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterMasterDto {
  @ApiProperty({ example: 'mestre_arthur', description: 'Nome de usuário do mestre' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'mestre@rpg.com', description: 'Email para login' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaForte123!', description: 'Senha de acesso' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginMasterDto {
  @ApiProperty({ example: 'mestre@rpg.com', description: 'Email ou username' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'senhaForte123!', description: 'Senha' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterPlayerDto {
  @ApiProperty({ example: 'raven', description: 'Nome de usuário do jogador na sala' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'senhaDoJogador123', description: 'Senha de acesso do jogador' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'ABC123', description: 'Código da sala recebido no link de convite' })
  @IsString()
  @IsNotEmpty()
  partyCode: string;

  @ApiPropertyOptional({ example: '1234', description: 'Senha da sala (caso o mestre tenha configurado)' })
  @IsOptional()
  @IsString()
  partyPassword?: string;
}

export class LoginPlayerDto {
  @ApiProperty({ example: 'raven', description: 'Nome de usuário do jogador' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'senhaDoJogador123', description: 'Senha de acesso do jogador' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'ABC123', description: 'Código da sala recebido no link de convite' })
  @IsString()
  @IsNotEmpty()
  partyCode: string;

  @ApiPropertyOptional({ example: '1234', description: 'Senha da sala (caso o mestre tenha configurado)' })
  @IsOptional()
  @IsString()
  partyPassword?: string;
}

export class GuestJoinPartyDto {
  @ApiProperty({ example: 'Carlos Guerreiro', description: 'Seu nome ou apelido como jogador' })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({ example: 'ABC123', description: 'Código da sala recebido no link de convite' })
  @IsString()
  @IsNotEmpty()
  partyCode: string;

  @ApiPropertyOptional({ example: '1234', description: 'Senha da sala (caso o mestre tenha configurado)' })
  @IsOptional()
  @IsString()
  partyPassword?: string;
}
