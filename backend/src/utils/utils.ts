import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {SimpleEntity} from '../types/custom'


export function joinSimpleEntityFirst(relations: SimpleEntity[], max:number=4):string {
    let errMessage='';
    for (let i in relations) {
        if (Number(i)>=max)
          errMessage=errMessage+" ..."
        else
          errMessage=errMessage+" ["+relations[i].name+' (id='+relations[i].id+')]'
    }
    return errMessage;
}

export async function checkAccess(rep: Repository<any>, id_record: number, id_user:number) {
  const [recordOld]=await rep.find({where: {id:id_record}, relations:['user']});
  if (!recordOld)
    throw new HttpException({
      message: "Не найдена запись для операции"
      }, HttpStatus.BAD_REQUEST);
  if (recordOld.user.id!==id_user)
    throw new UnauthorizedException({
      message: "У Вас нет прав на редактирование записей, добавленных не Вами"
      });
}
