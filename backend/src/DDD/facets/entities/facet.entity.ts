import { Entity } from 'typeorm';
import { Facet as SharedFacet } from 'src/shared/entities/abstract.entity';

@Entity('facet_ontology_entity')
export class FacetEntity extends SharedFacet {}

@Entity('facet_ontology_mechanism')
export class FacetMechanism extends SharedFacet {}
