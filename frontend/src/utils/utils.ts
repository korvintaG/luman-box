import { User } from "./type";
  
import clsx from 'clsx';

export type classVar=string | undefined | null;

export function combineClasses(inherited:classVar, replace: classVar, add: classVar): string {
    let classRes='';
    if (inherited)
        classRes=inherited;
    if (replace)
        classRes=replace;
    if (add)
        classRes=clsx(classRes,add);
    return classRes;
}

export function isUnauthorizedError(message: string): boolean {
    if (!message) 
        return false;
    const [errCode]=message.split('.');
    return errCode==='401';
}

export function allowEdit(id:string | undefined, currentUser:User|null, currentRecord:any):boolean{
    if (!currentUser) // не авторизован
        return false;
    if (!id) // новый всегда можно 
        return true;
    if (!currentRecord)
        return false;
    // точно есть автор и пользователь
    else // старый
      if (!currentRecord.user)
        return false;
      else
        if (!currentRecord.user.id)
            return false;
        else
            return currentUser.id===currentRecord.user.id;
}

export function genHeaderText(readOnly:boolean, id: number | null, name: string| null, 
    text: string, gender: 'муж' | 'жен' = 'муж'): string {
        const newWord=(gender==='муж')?'нового':'новой';
        if (!id)
            return `Добавление ${newWord} `+text
        else
            if (readOnly)
                return `Просмотр ${text} [${name}]`
            else
                return `Редактирование ${text} [${name}]`
}

export function getUserCreator(currentRecord:any,currentUser:User | null): string {
    if (!currentRecord) // нет текущей записи
        if (currentUser)
            return currentUser.name
        else
            return '-'
    else
        if (currentRecord.user)
            return currentRecord.user.name
        else    
            return '-'
}