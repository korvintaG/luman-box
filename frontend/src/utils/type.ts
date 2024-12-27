export type Author = {
    id: number;
    name: string;
}

export type SourceEditData = {
    name: string;
    author?:{id: number}
}

export type Source = SourceEditData & {id: number;}

export type SourceExtension = Source & {
    author?: Author;
};

export function authorNameFromObj(author?: Author): string {
    if (author) 
        if (author.name)
            return author.name;
    return '';
}

export type IdeaEditData=  {
    //source_id: number;
    name: string;
    original_text: string;
    content: string;
    date_time_create: string;
    keywords: number[];
    source: {id: number; name?: string}
}

export type Idea= IdeaEditData &  { id: number; }

export type IdeaExtension = Idea & {user: string};

export type Keyword = {
    id: number,
    name: string
}

export type KeywordsIdea = {
    keyword_id: number,
    idea_id: number
}


export type HTMLEditElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const enum RequestStatus {
    Idle = 'idle',
    Loading = 'loading',
    Success = 'success',
    Failed = 'failed',
    Updated = 'updated'
}

export type RequestStatusKey = keyof typeof RequestStatus;
export type RequestStatusValue = typeof RequestStatus[RequestStatusKey];