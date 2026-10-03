import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePhaseDto {
  @ApiProperty({ example: 'A Emboscada na Ponte dos Suspiros', description: 'Título da fase' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'O grupo chega numa ponte de madeira velha, tem neblina alta. De repente 3 goblins aparecem com tochas nas árvores e cortam uma das cordas da ponte. O rio embaixo é fundo com correnteza forte.',
    description: 'Anotações livres do mestre sobre os acontecimentos desta fase. A IA irá organizar em texto de narração RPG sem alterar seu enredo.',
  })
  @IsString()
  @IsNotEmpty()
  masterNotes: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Se verdadeiro, dispara automaticamente a geração de imagem RPG para a cena desta fase',
  })
  @IsOptional()
  @IsBoolean()
  autoGenerateImage?: boolean;
}

export class RegeneratePhaseAiDto {
  @ApiPropertyOptional({
    example: 'O grupo chega na ponte de pedra antiga, barulho de correntes e uma criatura alada pousa no arco superior.',
    description: 'Anotações novas ou revisadas do mestre caso deseje alterar antes de regenerar a narração',
  })
  @IsOptional()
  @IsString()
  updatedMasterNotes?: string;
}
