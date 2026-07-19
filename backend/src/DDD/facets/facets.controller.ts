import {
  Controller,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiFindAllEntityErrors,
} from '../../shared/decorators/api-errors.decorator';
import { FacetsService } from './facets.service';

@ApiTags('Фасеты')
@Controller('facets')
export class FacetsController {
  constructor(private readonly facetsService: FacetsService) {}

  @Get('ontology-realities')
  @ApiFindAllEntityErrors()
  findAllOntologyRealities() {
    return this.facetsService.findAllOntologyRealities();
  }

  @Get('ontology-types')
  @ApiFindAllEntityErrors()
  findAllOntologyTypes() {
    return this.facetsService.findAllOntologyTypes();
  }
}
