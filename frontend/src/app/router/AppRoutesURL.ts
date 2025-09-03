
export const telegramBotURL="https://t.me/Sferatum_bot";

export const appRoutesURL = {
  home: "/",
  main: "/main",
  test: "/test",
  about: "/about",
  auth: "/auth",
  authors: "/authors",
  author: "/authors/:id",
  authorAdd: "/authors/add",
  sources: "/sources",
  source: "/sources/:id",
  sourceAdd: "/sources/add",
  ideas: "/ideas",
  idea: "/ideas/:id",
  ideaAdd: "/ideas/add",
  interconnections:  "/ideas/interconnections/:idea_id/:iitype_id",
  ideaFind: "/ideas/find",
  interconnection: "/interconnections/:id",
  interconnectionAdd: "/interconnections/add/:idea_id/:iitype_id",
  CMS: "/CMS/:article",
  keywords: "/keywords",
  keyword: "/keywords/:id",
  keywordAdd: "/keywords/add",
  user: "/users/:id",
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