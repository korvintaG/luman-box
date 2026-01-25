import { RequestStatus, IDetailsAddHookRes, IDetailsEditHookRes } from "../types/types-for-hooks";
import { SourceShort, SourceDetail } from "../../domains/source/types/source-type";
import { User, Role } from "../../features/auth/user-types";
//import { EditAccessStatus } from "./utils";

import clsx from "clsx";
import { ObjectCreationWithModeration, SimpleNameObject, VerificationStatus } from "../types/entity-types";

export type classVar = string | undefined | null;

export function combineClasses(
  inherited: classVar,
  replace: classVar,
  add: classVar,
  add_general?: classVar
): string {
  let classRes = "";
  if (inherited) classRes = inherited;
  if (replace) classRes = replace;
  if (add) classRes = clsx(classRes, add);
  if (add_general) classRes = clsx(classRes, add_general);
  return classRes;
}

export function isUnauthorizedError(message: string): boolean {
  if (!message) return false;
  const [errCode] = message.split(".");
  return errCode === "401";
}

export const enum EditAccessStatus {
  Readonly = "readonly",
  Editable = "editable",
  EditableAndPublishable = "editableAndPublishable",
  EditableAndModeratable = "editableAndModeratable",
  Moderatable = "moderatable",
  PossibleInsert = "possibleInsert",
  EditableAndModeratableInserted = "editableAndModeratableInserted"
}

export function getEditAccess<T extends ObjectCreationWithModeration | null | undefined>(
  id: string | undefined,
  currentUser: User | null, 
  currentRecord: T,
  possibleToInsert?:boolean
): EditAccessStatus {
  console.log('getEditAccess', id, currentUser, currentRecord);
  if (!currentUser) {
    // не авторизован
    //console.log('getEditAccess не авторизован')
    return EditAccessStatus.Readonly;
  }
  if (!id) 
    // новый всегда можно
    return EditAccessStatus.Editable;
  if (!currentRecord) {
   // console.log('getEditAccess !currentRecord')
    return EditAccessStatus.Readonly;
  }
  // точно есть автор и пользователь
  if (!currentRecord.user) {
    // старый
    //console.log('getEditAccess !currentRecord.user')
    return EditAccessStatus.Readonly;
  }
  if (!currentRecord.user.id)  {
    //console.log('getEditAccess !currentRecord.user.id')
    return EditAccessStatus.Readonly;
  }
  //console.log('getEditAccess currentUser.role_id',currentUser.role_id)
  if ([Role.Admin, Role.SuperAdmin].includes(currentUser.role_id)) { // админ или супермодератор
    //console.log('getEditAccess админ или супер')
    if (currentRecord.verification_status) { 
      if (currentRecord.verification_status === VerificationStatus.ToModerate) {
        console.log('getEditAccess EditAccessStatus.EditableAndModeratable');
        return EditAccessStatus.EditableAndModeratable; // супермодератор может менять все, а админ только к модерации
      }
      else  if (currentUser.role_id === Role.SuperAdmin)
        return EditAccessStatus.EditableAndModeratable; // супермодератор может менять все, а админ только к модерации
      else 
        return EditAccessStatus.Readonly; // обычный модератор ничего не может делать с отмодерированными
    } 
    else 
      if (currentUser.role_id === Role.SuperAdmin)
        return EditAccessStatus.Editable;
      else
        return EditAccessStatus.Readonly;
  } 
  else { // обычный пользователь
    if (possibleToInsert && currentRecord.verification_status === VerificationStatus.Moderated)
      return EditAccessStatus.PossibleInsert;
    if (currentRecord.verification_status 
        && (currentRecord.verification_status > VerificationStatus.Creating)) 
      return EditAccessStatus.Readonly;
    if (currentUser.id === currentRecord.user.id) { // запись принадлежит текущему пользователю
        return EditAccessStatus.EditableAndPublishable; // можно редактировать и публиковать
    }
    else 
      return EditAccessStatus.Readonly; // запись другого пользователя
  }
}

export type HeaderParType= [
    readOnly: boolean, 
    id: number | null, 
    name: string | null | undefined, 
    text: string, 
    gender?: "муж" | "жен" 
  ];
  

export function genHeaderText(
  readOnly: boolean,
  id: number | null,
  name: string | null | undefined,
  text: string,
  gender: "муж" | "жен" = "муж",
): string {
  const newWord = gender === "муж" ? "нового" : "новой";
  if (!id) return `Добавление ${newWord} ` + text;
  else if (readOnly) return `Просмотр ${text}`;
  else return `Редактирование ${text} [${name}]`;
}

export function genTabHeaderText(
  readOnly: boolean,
  id: number | null,
  name: string | null | undefined,
  text: string,
  gender: "муж" | "жен" = "муж",
): string {
  const newWord = gender === "муж" ? "нового" : "новой";
  if (!id) return `Добавление ${newWord} ` + text;
  else if (readOnly) return `Просмотр ${text} [${name}]`;
  else return `Редактирование ${text} [${name}]`;
}


export function getUserCreator(
  currentRecord: any,
  currentUser: User | null,
): string {
  if (!currentRecord)
    if (currentUser)
      // нет текущей записи
      return currentUser.name;
    else return "-";
  else if (currentRecord.user) return currentRecord.user.name;
  else return "-";
}

export function getModerator(currentRecord: any): string | null {
  if (currentRecord)
    if (currentRecord.moderator) return currentRecord.moderator.name;
  return null;
}

interface CharIndexedArray {
  [key: string]: string; // Ключ - строка (символ), значение - строка
}

export function translit(word:string):string{
	var answer = '';
	var converter:CharIndexedArray = {
		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
		'э': 'e',    'ю': 'yu',   'я': 'ya',
 
		'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
		'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
		'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
		'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
		'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
		'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
		'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya',   ' ': '_'
	};
 
	for (var i = 0; i < word.length; ++i ) {
		if (converter[word[i]] === undefined){
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}
 
	return answer;
}


export const simpleQueryString = (params:any) => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

export function sourceFullNameFromObj(
  source: SourceShort | SourceDetail | null | undefined,
): string {
  let name = "";
  if (source) {
    if (source.name) {
      name = source.name;
      if (source.author)
        if (source.author.name) name = name + " // " + source.author.name;
    }
  }
  return name;
}

export function simpleNameFromObject(object?: Partial<SimpleNameObject>): string {
  if (object) if (object.name) return object.name;
  return "";
}

export function isRequestFailed(request: RequestStatus): boolean {
  return request.toString().startsWith("failed");
}

export function isDMLRequestFailed(request: RequestStatus): boolean {
  return (
    request === RequestStatus.FailedAdd ||
    request === RequestStatus.FailedUpdate ||
    request === RequestStatus.FailedUnAuth ||
    request === RequestStatus.FailedDelete
  );
}

export function getErrorTypeBySlice(sliceState: RequestStatus):string {
  switch (sliceState) {
    case RequestStatus.FailedAdd:
      return "Ошибка добавления новой записи";
    case RequestStatus.FailedUpdate:
      return "Ошибка изменения записи";
    case RequestStatus.FailedDelete:
      return "Ошибка удаления записи";
    case RequestStatus.FailedUnAuth:
      return "Ошибка авторизации.";
    default:
      return "";
  }
}

export function isDMLRequestOK(request: RequestStatus): boolean {
  return (
    request === RequestStatus.Added ||
    request === RequestStatus.Updated ||
    request === RequestStatus.Deleted
  );
}



export function isSafeSvg(svgString: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    
    // Проверяем, что корневой элемент — это SVG
    const rootElement = doc.documentElement;
    if (rootElement.nodeName.toLowerCase() !== "svg") {
      return false;
    }

    // Проверяем, что нет опасных элементов
    const hasScriptTags = doc.querySelector("script, foreignobject");
    const hasEventListeners = svgString.includes("onload=") || svgString.includes("onerror=");
    
    return !hasScriptTags && !hasEventListeners;
  } catch (err) {
    return false; // Если парсинг не удался — это не SVG
  }
}

/**
 * Форматирует дату в московском времени в формате DD.MM.YY HH:mm
 * @param dateInput - дата в виде строки или объекта Date
 * @returns отформатированная дата в московском времени
 */
export const formatMoscowDateTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  
  // Создаем объект даты в московском времени
  const moscowDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
  
  // Форматируем дату в нужном формате
  const day = moscowDate.getDate().toString().padStart(2, '0');
  const month = (moscowDate.getMonth() + 1).toString().padStart(2, '0');
  const year = moscowDate.getFullYear().toString().slice(-2);
  const hours = moscowDate.getHours().toString().padStart(2, '0');
  const minutes = moscowDate.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

/**
 * Преобразует IDetailsAddHookRes в IDetailsEditHookRes
 * Добавляет недостающие функции как пустые функции
 * editAccessStatus устанавливается в Editable
 */
export function convertAddToEditHook<FormValues, Record>(
  addHook: IDetailsAddHookRes<FormValues, Record>
): IDetailsEditHookRes<FormValues, Record> {
  return {
    ...addHook,
    record: { 
      ...addHook.record,
      deleteRecordAction: () => {}, // пустая функция
    },
    status: {
      ...addHook.status,
      resetSlicesStatus: () => {}, // пустая функция
      editAccessStatus: EditAccessStatus.Editable,
    },
    moderate: {
      approveRecordAction: () => {}, // пустая функция
      rejectRecordAction: () => {}, // пустая функция
      toModerateRecordAction: () => {}, // пустая функция
    },
  };
}
