export interface IAuthor {
    id: number;
    id_out: string;
    name: string;
  }
  
export interface ISource {
    id: number;
    id_out: string;
    name: string;
    author_id: number;
 }
  
export interface IKeyword {
  id: number;
  id_out: string;
  name: string;
}

export type IIdea=  {
  id: number;
  id_out: string;
  source_id: number;
  name: string;
  original_text: string;
  content: string;
  date_time_create: string;
  keywords: number[];
}
