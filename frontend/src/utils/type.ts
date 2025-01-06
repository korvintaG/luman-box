// универсальные типы
export type IDObject = {
    id: number;
}

export type NameObject = {
    name: string;
}

// Авторы
export type AuthorInner = NameObject;
export type Author = AuthorInner & IDObject;
export type AuthorPartial = Partial<Author> & IDObject // то же что автор, но обязательный ID

// Источники
export type SourceInner = NameObject;
export type SourceRaw = SourceInner & {
    author?:AuthorPartial;
}
export type SourcePartial = Partial<Source> & IDObject;
export type Source = SourceRaw & IDObject;

export function sourceFullNameFromObj(source: SourcePartial | Source | null | undefined): string {
    let name='';
    if (source) {
        if (source.name) {
            name=source.name;
            if (source.author)
                if (source.author.name)
                    name=name+' // '+source.author.name;
        }
    }
    return name;
}

export function authorNameFromObj(author?: Partial<Author>): string { 
    if (author) 
        if (author.name)
            return author.name;
    return '';
}

// ключевые слова
export type KeywordInner = NameObject;
export type KeywordRaw = KeywordInner;
export type Keyword = KeywordRaw & IDObject;
export type KeywordPartial = Partial<Keyword> & IDObject;

// Идеи
export type IdeaInner= NameObject & {
    original_text: string;
    content: string;
    date_time_create: string;
}

export type IdeaRaw= IdeaInner & {
    source: SourcePartial;
    keywords?: KeywordPartial[];
}

export type Idea= IdeaRaw &  IDObject


/*export type KeywordsIdea = {
    keyword_id: number,
    idea_id: number
}*/


export type HTMLEditElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const enum RequestStatus {
    Idle = 'idle',
    Loading = 'loading',
    Success = 'success',
    Failed = 'failed',
    FailedUpdate = 'failedUpdate',
    FailedAdd = 'failedAdd',
    FailedDelete = 'failedDelete',
    Updated = 'updated',
    Added = 'added',
    Deleted = 'deleted'
}

export function isRequestFailed(request: RequestStatus): boolean {
    return request===RequestStatus.Failed || request===RequestStatus.FailedAdd 
        || request===RequestStatus.FailedUpdate || request===RequestStatus.FailedDelete
}

export function isDMLRequestFailed(request: RequestStatus): boolean {
    return request===RequestStatus.FailedAdd || request===RequestStatus.FailedUpdate || request===RequestStatus.FailedDelete
}

export function isDMLRequestOK(request: RequestStatus): boolean {
    return request===RequestStatus.Added || request===RequestStatus.Updated || request===RequestStatus.Deleted
}


export type RequestStatusKey = keyof typeof RequestStatus;
export type RequestStatusValue = typeof RequestStatus[RequestStatusKey];