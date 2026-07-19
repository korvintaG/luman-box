import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateFacetDto } from './dto/create-facet.dto';
import { UpdateFacetDto } from './dto/update-facet.dto';
import { FacetEntity, FacetMechanism } from './entities/facet.entity';

@Injectable()
export class FacetsService {
  constructor(
    @InjectRepository(FacetEntity)
    private readonly facetsEntityRepository: Repository<FacetEntity>,
    @InjectRepository(FacetMechanism)
    private readonly facetsMechanismRepository: Repository<FacetMechanism>,
  ) {}

  async findAllOntologyRealities() {
    return this.facetsEntityRepository.find({
      order: { class_id: 'ASC', order_: 'ASC', id: 'ASC' },
    });
  }

  async findAllOntologyTypes() {
    return this.facetsMechanismRepository.find({
      order: { class_id: 'ASC', order_: 'ASC', id: 'ASC' },
    });
  }


}
