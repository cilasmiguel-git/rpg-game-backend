import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CharacterAppearanceDto {
  @ApiProperty({ example: 'MASCULINO', description: 'Sexo / Identidade de gênero visual' })
  @IsString()
  @IsNotEmpty()
  sex: string;

  @ApiProperty({ example: 'Elfo Silvestre', description: 'Raça do personagem' })
  @IsString()
  @IsNotEmpty()
  race: string;

  @ApiProperty({ example: '#e4b590', description: 'Tom de pele (HEX ou descrição)' })
  @IsString()
  @IsNotEmpty()
  skinColor: string;

  @ApiProperty({ example: 'trancas_guerreiro', description: 'Estilo do cabelo' })
  @IsString()
  @IsNotEmpty()
  hairStyle: string;

  @ApiProperty({ example: '#c9933e', description: 'Cor do cabelo' })
  @IsString()
  @IsNotEmpty()
  hairColor: string;

  @ApiProperty({ example: '#3b82f6', description: 'Cor dos olhos' })
  @IsString()
  @IsNotEmpty()
  eyeColor: string;

  @ApiProperty({ example: 'esguio', description: 'Tipo de porte físico / corpo' })
  @IsString()
  @IsNotEmpty()
  bodyType: string;

  @ApiPropertyOptional({ example: 'Cicatriz no supercílio e olhos amendoados', description: 'Traços faciais especiais' })
  @IsOptional()
  @IsString()
  facialFeatures?: string;

  @ApiProperty({ example: 'traje_couro_batido', description: 'Tipo de vestimenta / skin / armadura' })
  @IsString()
  @IsNotEmpty()
  outfitType: string;

  @ApiProperty({ example: '#1e293b', description: 'Cor primária do traje' })
  @IsString()
  @IsNotEmpty()
  outfitPrimaryColor: string;

  @ApiPropertyOptional({ example: '#7c2d12', description: 'Cor secundária ou detalhes do traje' })
  @IsOptional()
  @IsString()
  outfitSecondaryColor?: string;

  @ApiPropertyOptional({ example: 'Arco Composto Élfico', description: 'Arma principal em punho ou nas costas' })
  @IsOptional()
  @IsString()
  mainWeapon?: string;

  @ApiPropertyOptional({ example: 'Capuz de Veludo Sombrio', description: 'Elmo, capuz ou adereço na cabeça' })
  @IsOptional()
  @IsString()
  headgear?: string;

  @ApiPropertyOptional({ example: 'Capa Longa de Viagem', description: 'Acessório (capa, amuleto, mochila, etc.)' })
  @IsOptional()
  @IsString()
  accessory?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL direta ou avatar customizado' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class CharacterStatsDto {
  @ApiPropertyOptional({ example: 100, default: 100 })
  @IsOptional()
  @IsInt()
  health?: number;

  @ApiPropertyOptional({ example: 100, default: 100 })
  @IsOptional()
  @IsInt()
  maxHealth?: number;

  @ApiPropertyOptional({ example: 50, default: 50 })
  @IsOptional()
  @IsInt()
  energy?: number;

  @ApiPropertyOptional({ example: 'Um caçador silencioso que busca vingança pelo seu vilarejo.' })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class CreateCharacterDto {
  @ApiProperty({ example: 'Carlos', description: 'Nome do jogador real' })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({ example: 'Eldrin Sombralonga', description: 'Nome do personagem no RPG' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Arqueiro / Ladino', description: 'Classe ou arquétipo' })
  @IsOptional()
  @IsString()
  characterClass?: string;

  @ApiProperty({ type: CharacterAppearanceDto, description: 'Critérios visuais detalhados de aparência' })
  @IsObject()
  @ValidateNested()
  @Type(() => CharacterAppearanceDto)
  appearance: CharacterAppearanceDto;

  @ApiPropertyOptional({ type: CharacterStatsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CharacterStatsDto)
  stats?: CharacterStatsDto;
}

export class UpdateCharacterDto {
  @ApiPropertyOptional({ example: 'Eldrin, o Certeiro' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Mestre Caçador' })
  @IsOptional()
  @IsString()
  characterClass?: string;

  @ApiPropertyOptional({ type: CharacterAppearanceDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CharacterAppearanceDto)
  appearance?: Partial<CharacterAppearanceDto>;

  @ApiPropertyOptional({ type: CharacterStatsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CharacterStatsDto)
  stats?: Partial<CharacterStatsDto>;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isReady?: boolean;
}
