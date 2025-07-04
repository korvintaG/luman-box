import { Author } from "../../features/authors/AuthorTypes";
import { RequestStatus } from "../common-types";
import { Source, SourcePartial } from "../../features/sources/SourceTypes";
import { User, Role } from "../../features/auth/user-types";

import clsx from "clsx";

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
  Moderatable = "moderatable",
}

export function getEditAccess(
  id: string | undefined,
  currentUser: User | null,
  currentRecord: any,
): EditAccessStatus {
  if (!currentUser)
    // не авторизован
    return EditAccessStatus.Readonly;
  if (!id)
    // новый всегда можно
    return EditAccessStatus.Editable;
  if (!currentRecord) return EditAccessStatus.Readonly;
  // точно есть автор и пользователь
  else if (!currentRecord.user)
    // старый
    return EditAccessStatus.Readonly;
  else if (!currentRecord.user.id) return EditAccessStatus.Readonly;
  else if ([Role.Admin, Role.SuperAdmin].includes(currentUser.role_id)) {
    if (currentRecord.moderated > 0) {
      // уже отмодерировано
      if (currentUser.role_id === Role.SuperAdmin)
        return EditAccessStatus.Editable; // супермодератор может менять все
      else return EditAccessStatus.Readonly; // обычный модератор ничего не может делать с отмодерированными
    } else return EditAccessStatus.Moderatable;
  } else if (currentRecord.moderated > 0) return EditAccessStatus.Readonly;
  else
    return currentUser.id === currentRecord.user.id
      ? EditAccessStatus.Editable
      : EditAccessStatus.Readonly;
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
		if (converter[word[i]] == undefined){
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
  source: SourcePartial | Source | null | undefined,
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

export function authorNameFromObj(author?: Partial<Author>): string {
  if (author) if (author.name) return author.name;
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
      return "Ошибка неизвестного типа";
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