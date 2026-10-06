import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class SpriteAnimationConfigDto {
  @ApiProperty({ example: true, description: 'Se o sprite é animado' })
  @IsBoolean()
  isAnimated: boolean;

  @ApiProperty({ example: 2, description: 'Quantidade de frames da animação' })
  @IsNumber()
  frames: number;

  @ApiProperty({ enum: ['horizontal', 'vertical'], example: 'vertical' })
  @IsIn(['horizontal', 'vertical'])
  orientation: 'horizontal' | 'vertical';

  @ApiPropertyOptional({ example: '0.8s', description: 'Duração da animação' })
  @IsOptional()
  @IsString()
  duration?: string;
}

export class PlacedAssetDto {
  @ApiProperty({ example: 'placed_1728169000_a1b2', description: 'ID único do asset no mapa' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'ts_bld_castle_knights', description: 'Identificador do tipo de asset' })
  @IsString()
  assetId: string;

  @ApiProperty({ example: 'Castelo dos Cavaleiros (4x4)', description: 'Nome descritivo da construção/asset' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '/assets/battlemap/tiny_swords/tiny_castle_blue.png',
    description: 'Caminho estático (/assets/...), link web (https://...) ou string Base64 (data:image/...)',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 4, description: 'Posição X na grade' })
  @IsNumber()
  gridX: number;

  @ApiProperty({ example: 2, description: 'Posição Y na grade' })
  @IsNumber()
  gridY: number;

  @ApiProperty({ example: 4, description: 'Largura em blocos/tiles' })
  @IsNumber()
  widthTiles: number;

  @ApiProperty({ example: 4, description: 'Altura em blocos/tiles' })
  @IsNumber()
  heightTiles: number;

  @ApiProperty({ example: 0, default: 0, description: 'Rotação (0, 90, 180, 270)' })
  @IsNumber()
  @IsOptional()
  rotation: number = 0;

  @ApiProperty({ example: 1.0, default: 1.0, description: 'Opacidade (0.2 a 1.0)' })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  opacity: number = 1.0;

  @ApiProperty({ example: true, description: 'Se bloqueia passagem de tokens' })
  @IsBoolean()
  isObstacle: boolean;

  @ApiProperty({ enum: ['under', 'over'], example: 'under', description: 'Camada de renderização (under = abaixo dos tokens, over = acima dos tokens)' })
  @IsIn(['under', 'over'])
  layer: 'under' | 'over';

  @ApiPropertyOptional({ type: SpriteAnimationConfigDto, description: 'Configuração de spritesheet animado' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SpriteAnimationConfigDto)
  animation?: SpriteAnimationConfigDto;
}

export class GridTokenDto {
  @ApiProperty({ example: 't_warrior', description: 'ID único do token' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Guerreiro Eldrin', description: 'Nome do personagem ou monstro' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['player', 'monster', 'npc'], example: 'player', description: 'Tipo do token' })
  @IsIn(['player', 'monster', 'npc'])
  type: 'player' | 'monster' | 'npc';

  @ApiProperty({ example: 'https://api.dicebear.com/7.x/bottts/svg?seed=Eldrin', description: 'URL do avatar/imagem do token' })
  @IsString()
  avatar: string;

  @ApiProperty({ example: 3, description: 'Posição X na grade' })
  @IsNumber()
  x: number;

  @ApiProperty({ example: 5, description: 'Posição Y na grade' })
  @IsNumber()
  y: number;

  @ApiProperty({ example: 30, description: 'HP atual' })
  @IsNumber()
  hp: number;

  @ApiProperty({ example: 30, description: 'HP máximo' })
  @IsNumber()
  maxHp: number;

  @ApiProperty({ example: 1, description: 'Tamanho em blocos da grade' })
  @IsNumber()
  size: number;

  @ApiProperty({ example: '#3498db', description: 'Cor temática do token' })
  @IsString()
  color: string;
}

export class BattlemapStateDto {
  @ApiProperty({ example: 18, default: 18, description: 'Tamanho da grade (NxN)' })
  @IsNumber()
  gridSize: number;

  @ApiProperty({
    example: { '0-0': 'grass', '1-0': 'stone', '5-5': 'water' },
    description: 'Mapeamento de coordenadas (X-Y) para o tipo de terreno',
  })
  @IsObject()
  terrain: Record<string, string>;

  @ApiProperty({ type: [PlacedAssetDto], description: 'Lista de construções e decorações colocadas no mapa' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlacedAssetDto)
  placedAssets: PlacedAssetDto[];

  @ApiProperty({ type: [GridTokenDto], description: 'Lista de tokens posicionados na grade' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GridTokenDto)
  tokens: GridTokenDto[];
}
