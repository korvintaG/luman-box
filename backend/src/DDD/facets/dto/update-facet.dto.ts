import { PartialType } from '@nestjs/mapped-types';
import { CreateFacetDto } from './create-facet.dto';

export class UpdateFacetDto extends PartialType(CreateFacetDto) {}
