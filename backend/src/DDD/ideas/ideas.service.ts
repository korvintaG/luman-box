import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { JSDOM } from 'jsdom';
import { Idea } from './entities/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { IIdeaBySourceAndKeyword, IdeaForList, IModerate } from '../../types/custom';
import { isEmpty, omit } from 'lodash';
import { KeywordsService } from '../keywords/keywords.service';
import { KeywordsModerationService } from '../keywords/keywords-moderation.service';
import { IUser, Role } from '../../types/custom';
import { getUserSQLFilter } from '../../utils/utils';
import { AttitudesService } from '../attitudes/attitudes.service';
import { InterconnectionsService } from '../interconnections/interconnections.service';
import DOMPurify from 'dompurify';
//import sanitizeSVG from '@mattkrick/sanitize-svg'
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator/moderator.service';
import { SourcesService } from '../sources/sources.service';
import { Interconnection } from '../interconnections/entities/interconnection.entity';
import { KeywordName } from '../keywords/entities/keyword.entity';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
    private keywordsService: KeywordsService,
    private keywordsModerationService: KeywordsModerationService,
    private attitudesService: AttitudesService,
    private interconnectionsService: InterconnectionsService,
    private moderatorService: ModeratorService,
    @Inject(forwardRef(() => SourcesService))
    private sourcesService: SourcesService
  ) { }

  findSvgElement = (node: Node): Element | null => {
    // Если это элемент SVG - возвращаем его
    if (node.nodeType === node.ELEMENT_NODE && 
        (node as Element).tagName.toLowerCase() === 'svg') {
      return node as Element;
    }
    
    // Проверяем дочерние узлы
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const found = this.findSvgElement(node.childNodes[i]);
        if (found) return found;
      }
    }
    
    return null;
  };

  sanitizeSVG(SVG: string) {
    const window = new JSDOM('').window;
    //const buffer=Buffer.from(SVG, "utf-8");
    //return await sanitizeSVG(buffer, window as unknown as Window)
    const purify = DOMPurify(window);
    const cleanSvg = purify.sanitize(SVG, { USE_PROFILES: { svg: true, svgFilters: true }, RETURN_DOM: true });
    const svgElement = this.findSvgElement(cleanSvg);
    if (!svgElement) {
      console.log('sanitizeSVG !svgElement');
      return '';
    }

    const viewBox = svgElement.getAttribute('viewBox');
    if (!viewBox) {
      return '';
    }    
    return svgElement.outerHTML;
  }

  async create(user: IUser, createIdeaDto: CreateIdeaDto) {
    await this.moderatorService.checkDraftCount(
      this.ideaRepository,
      user,
      'Идея'
    );

    if (!createIdeaDto.keyword_names)
      throw new BadRequestException( {
        error: 'Bad Request',
        message: 'Для идеи должны быть назначены ключевые слова!'
      });

    if (createIdeaDto.keyword_names.length > Number(process.env.MAX_KEYWORDS_FOR_IDEA))
      throw new BadRequestException({
        error: 'Bad Request',
        message: `Для идеи может быть назначено не более ${process.env.MAX_KEYWORDS_FOR_IDEA} ключевых слов!`
      });

      
    let onlyIdea = omit(createIdeaDto, ['keywords', 'date_time_create']);
    if (onlyIdea.source && onlyIdea.source.id === 0) {
      onlyIdea = omit(onlyIdea, ['source']);
    }
    let SVG: (string | null) = null;
    if (createIdeaDto.SVG && createIdeaDto.SVG.length > 0) {
      SVG = this.sanitizeSVG(createIdeaDto.SVG);
      if (!SVG || SVG.length === 0) {
        console.log('idea create bad SVG', SVG);
        throw new BadRequestException({
          error: 'Bad Request',
          message: `SVG должно быть или пустым или корректным SVG рисунком!`
        });
      }
    }

    let idea = this.ideaRepository.create({ ...onlyIdea, SVG });
    if (createIdeaDto.keyword_names && createIdeaDto.keyword_names.length > 0) {
      const keywordNameRepository = this.ideaRepository.manager.getRepository(KeywordName);
      const keywordNames = await keywordNameRepository.find({
        where: { id: In(createIdeaDto.keyword_names.map((el) => el.id)) },
      });
      idea.keyword_names = keywordNames;
    }
    return this.ideaRepository.save({ ...idea, user: { id: user.id } });
  }

  findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.ideaRepository.find({
        select: {
          id: true,
          name: true,
          date_time_create: true,
          SVG: true,
          verification_status: true,
          source: {
            id: true,
            name: true,
            author: {
              id: true,
              name: true
            }
          },
          user: {
            id: true,
            name: true
          }
        },
        where: { verification_status: VerificationStatus.Moderated },
        relations: ['source.author', 'user'],
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.ideaRepository
          .createQueryBuilder('idea')
          .select([
            'idea.id',
            'idea.name', 
            'idea.date_time_create',
            'idea.SVG',
            'idea.verification_status',
            'source.id',
            'source.name',
            'author.id',
            'author.name',
            'user.id',
            'user.name'
          ])
          .leftJoin('idea.source', 'source')
          .leftJoin('idea.user', 'user')
          .leftJoin('source.author', 'author')
          .where('idea.verification_status = :moderated', { moderated: VerificationStatus.Moderated })
          .orWhere('idea.user_id = :user', { user: user.id })
          .orderBy('idea.name')
          .getMany(); 
      else
        // админ, выводим все
        return this.ideaRepository.find({
          select: {
            id: true,
            name: true,
            date_time_create: true,
            SVG: true,
            verification_status: true,
            source: {
              id: true,
              name: true,
              author: {
                id: true,
                name: true
              }
            },
            user: {
              id: true,
              name: true
            }
          },
          relations: ['source.author', 'user'],
          order: { name: 'ASC' },
        });
    }
  }

  async findBySrcKw(user: IUser, cond: IIdeaBySourceAndKeyword) {
    let founds: { id: number }[] = [];
    if (!user)
      // неавторизован, выводим все отмодерированное
      founds = await this.ideaRepository.manager.query<{ id: number }[]>(
        `select ideas.id
        from ideas, idea_keywords as ik
        where ideas.source_id=$1 and ideas.verification_status = $2 and ik.idea_id=ideas.id and ik.keyword_id=$3`,
        [cond.source_id,  VerificationStatus.Moderated, cond.keyword_id],
      );
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        founds = await this.ideaRepository.manager.query<{ id: number }[]>(
          `select ideas.id
          from ideas, idea_keywords as ik
          where ideas.source_id=$1 and (ideas.verification_status = $2 or ideas.user_id=$3) and ik.idea_id=ideas.id and ik.keyword_id=$4`,
          [cond.source_id, VerificationStatus.Moderated, user.id, cond.keyword_id],
        );
      else {
        // админ, выводим все
        founds = await this.ideaRepository.manager.query<{ id: number }[]>(
          `select ideas.id
          from ideas, idea_keywords as ik
          where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,
          [cond.source_id, cond.keyword_id],
        );
      }
    }
    return this.ideaRepository.find({
      relations: ['source.author', 'user'],
      where: { id: In(founds.map((el) => el.id)) },
      order: { name: 'ASC' },
    });
  }

  async findBySourceKw(src: string, kw: string, user: IUser) {
    const founds = await this.ideaRepository.manager.query<{ id: number }[]>(
      `select ideas.id
        from ideas, idea_keyword_names as ik
        where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_name_d=$2`,
      [src, kw],
    );
    return this.findOne(founds[0].id, user);
  }

  findByCond(cond: FindOptionsWhere<Idea> ) {
    return this.ideaRepository.find({ where: cond });
  }

  async findForList(id: number, user: IUser) {
    const addCond = getUserSQLFilter(user, 'ideas');
    const idea = await this.ideaRepository.manager.query<IdeaForList[]>(
      `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
      from ideas, sources, authors
      where ideas.id=${id} ${addCond} and sources.id=ideas.source_id and authors.id=sources.author_id`);
    if (isEmpty(idea[0]))
      throw new NotFoundException({
        error: 'NotFound',
        message: `Идеи с ID=${id} не найдено!`
      });
    else
      return { ...idea[0] }
  }


  async findOne(id: number, user: IUser) {
    let found = await this.ideaRepository
      .createQueryBuilder('idea')
      .select([
        'idea',
        'source.id',
        'source.name',
        'author.id',
        'author.name',
        'keyword_names.id',
        'keyword_names.name',
        'keyword_names.class_name_before',
        'user.id',
        'user.name',
        'moderator.id',
        'moderator.name',
      ]) // Выбираем только нужные поля
      .leftJoin('idea.keyword_names', 'keyword_names')
      .leftJoin('idea.source', 'source')
      .leftJoin('source.author', 'author')
      .leftJoin('idea.user', 'user')
      .leftJoin('idea.moderator', 'moderator')
      .where('idea.id = :id', { id })
      .getOne();
    if (!found) {
      throw new NotFoundException({
        error: 'NotFound',
        message: `Идея с ID=${id} не найдена!`
      });
    }
    await this.moderatorService.checkGetRecordAccess(found, user);
    if (found.moderator) {
      const attitudes = await this.attitudesService.findOne(id, user);
      const interconnections = await this.interconnectionsService.countAllByIdea(id, user);
      return { ...found, attitudes, interconnections }
    }
    return found
  }

  async update(id: number, user: IUser, updateIdeaDto: UpdateIdeaDto) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.ideaRepository, id, user);
    const onlyIdea = omit(updateIdeaDto, ['keyword_names']);
    if (!isEmpty(onlyIdea)) {
      await this.ideaRepository.update({ id }, onlyIdea);
    }
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['keyword_names'],
    });
    let SVG: (string | null) = null;
    if (updateIdeaDto.SVG && updateIdeaDto.SVG.length > 0) {
      SVG = this.sanitizeSVG(updateIdeaDto.SVG);
      if (!SVG || SVG.length === 0) {
        console.log('idea update bad SVG', SVG);
        throw new BadRequestException({
          error: 'Bad Request',
          message: `SVG должно быть или пустым или корректным SVG рисунком!`
        });
      }
    }

    if (updateIdeaDto.keyword_names && updateIdeaDto.keyword_names.length > 0) {
      const keywordNameRepository = this.ideaRepository.manager.getRepository(KeywordName);
      const keywordNames = await keywordNameRepository.find({
        where: { id: In(updateIdeaDto.keyword_names.map((el) => el.id)) },
      });
      idea.keyword_names = keywordNames;
    }

    return this.ideaRepository.save({ ...idea, SVG });
  }

  async toModerate(id: number, user: IUser) {
    const source = await this.ideaRepository.manager.query<
      { id: number, verification_status: VerificationStatus }[]>
      (`select 
          sources.id, 
          sources.verification_status 
        from ideas, sources 
        where ideas.id=$1 and sources.id=ideas.source_id`, [id]);
    if (!source || source.length === 0) {
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Не найден источник идеи'
      });
    }
    if (source[0].verification_status === VerificationStatus.Creating) {
      await this.sourcesService.toModerate(source[0].id, user, true);
    }

    const keywords = await this.ideaRepository.manager.query<
      { id: number }[]>
      (`select 
          keyword_names.keyword_id as id  
        from keyword_names, idea_keyword_names 
        where idea_keyword_names.idea_id=$1 
          and keyword_names.verification_status =$2
          and keyword_names.id=idea_keyword_names.keyword_name_id`, 
        [id, VerificationStatus.Creating]);
    for (const keyword of keywords) {
        await this.keywordsModerationService.toModerate(keyword.id, user, true);
    }
    return this.moderatorService.toModerateEntity(
      this.ideaRepository,
      id,
      user,
      process.env.ROUTE_IDEA_DETAIL,
      'Идея'
    );
  }

  async moderate(id: number, user: IUser, moderationResult: IModerate) {
    if (moderationResult.action === 'approve') {
      const source = await this.ideaRepository.manager.query<
        { id: number, verification_status: VerificationStatus }[]>
        (`select 
            sources.id, 
            sources.verification_status 
          from ideas, sources 
          where ideas.id=$1 and sources.id=ideas.source_id`, [id]);
      if (!source || source.length === 0) 
        throw new BadRequestException({
          error: 'Bad Request',
          message: 'Не найден источник идеи'
        });
      if (source[0].verification_status !== VerificationStatus.Moderated) 
        throw new BadRequestException({
          error: 'Bad Request',
          message: `Не одобрен источник идеи. Чтобы одобрить, перейдите по ссылке: ${process.env.FRONTEND_URL}${process.env.ROUTE_SOURCE_DETAIL}/${source[0].id}`
        });
      const keywords = await this.ideaRepository.manager.query<
        { id: number }[]>
        (`select distinct
            keyword_names.keyword_id as id
          from keyword_names, idea_keyword_names 
          where idea_keyword_names.idea_id=$1 
            and verification_status=$2
            and keyword_names.id=idea_keyword_names.keyword_name_id`, 
          [id, VerificationStatus.ToModerate]);
      for (const keyword of keywords) {
          throw new BadRequestException({
            error: 'Bad Request',
            message: `Не одобрено ключевое слово идеи. Чтобы одобрить, перейдите по ссылке: ${process.env.FRONTEND_URL}${process.env.ROUTE_KEYWORD_DETAIL}/${keyword.id}`
          });
      }
    }
    return this.moderatorService.moderateEntity(
      this.ideaRepository,
      id,
      user,
      moderationResult,
      'Идею'
    );
  }

  async remove(id: number, user: IUser) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.ideaRepository, id, user);
    const interconnections = await this.interconnectionsService.findByCond([
      {idea1_id: id},
      {idea2_id: id}] as FindOptionsWhere<Interconnection>);
    if (interconnections.length > 0)
      throw new BadRequestException({
        error: 'Bad Request',
        message: 'Идея связана с другими идеями'
      });
    const res = await this.ideaRepository.delete({ id });
    if (res.affected === 0)
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Идея не найдена'
      });
    else {
      return {
        success: true,
        message: 'Идея удалена успешно',
        id: id
      };
    }
  }
}
