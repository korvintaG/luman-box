import { User, Role } from "./type";

import clsx from "clsx";

export type classVar = string | undefined | null;

export function combineClasses(
  inherited: classVar,
  replace: classVar,
  add: classVar,
): string {
  let classRes = "";
  if (inherited) classRes = inherited;
  if (replace) classRes = replace;
  if (add) classRes = clsx(classRes, add);
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

export function genHeaderText(
  readOnly: boolean,
  id: number | null,
  name: string | null,
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
