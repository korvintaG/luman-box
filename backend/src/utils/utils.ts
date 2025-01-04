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