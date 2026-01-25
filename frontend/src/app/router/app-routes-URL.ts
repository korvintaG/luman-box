
export const telegramBotURL="https://t.me/Sferatum_bot";

const routeAdd="/new"; // добавление новой записи
const routeEdit="/:id"; // редактирование записи
const routeAuthor="/authors"; // маршрут авторов
const routeSource="/sources"; // маршрут источников
const routeIdea="/ideas"; // маршрут идей
const routeInterconnection="/interconnections"; // маршрут связей
const routeKeyword="/keywords"; // маршрут ключевых слов
const routeUser="/users"; // маршрут пользователей

export const appRoutesURL = {
  home: "/",
  main: "/main",
  test: "/test",
  about: "/about",
  auth: "/auth",
  authors: routeAuthor,
  author: routeAuthor+routeEdit,
  authorAdd: routeAuthor+routeAdd,
  sources: routeSource,
  source: routeSource+routeEdit,
  sourceAdd: routeSource+routeAdd,
  ideas: routeIdea,
  idea: routeIdea+routeEdit,
  ideaAdd: routeIdea+routeAdd,
  interconnections:  routeInterconnection+routeEdit,
  ideaFind: routeIdea+"/find",
  interconnectionAdd: routeInterconnection+routeAdd+"/:idea_id/:iitype_id",
  CMS: "/CMS/:article",
  keywords: routeKeyword+"/:class_keyword_id/children",
  keyword: routeKeyword+routeEdit,
  keywordAdd: routeKeyword+"/:class_keyword_id/children"+routeAdd,
  user: routeUser+routeEdit,
};


/**
 * Возвращает маршрут с означенным параметром
 * @param route - маршрут
 * @param param - параметр
 * @returns маршрут с означенным параметром
 */
export function getRouteParam(route: string, param: number): string {
  return getRouteWParam(route) + param;
}

/**
 * Взять маршрут без подстроки параметра (с ":")
 * @param route  - маршрут
 * @returns строка маршрута без параметра
 */
export function getRouteWParam(route: string): string {
  const pos = route.indexOf(":");
  if (pos === -1) return route;
  else return route.substring(0, pos);
}

export function genPath(path:string):string{
  return `/${path}`
}