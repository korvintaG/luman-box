import { Keyword, KeywordsIdea } from "../type";

export let keywords: Keyword[] = [
    {id:2, name:'Противоречие'},
    {id:419, name:'Точка зрения'},
    {id:601, name:'Возможности'},
    {id:958, name:'Саморазвитие'},
    {id:4, name:'Инфантильность'},
    {id:6, name:'Незрелость'},
    {id:112, name:'Просвещение'},
    {id:115, name:'Будь своим учителем'},
    {id:12, name:'Осознание'},
    {id:70, name:'Успех'},
    {id:71, name:'Контекст'},
    {id:126, name:'Путь (дао)'},
    {id:127, name:'Благоговение'},
    {id:287, name:'Культура'},
    {id:288, name:'Мистика'},
    {id:289, name:'Запрет'},
    {id:998, name:'Общество'},
    {id:1979, name:'Усиление'},
    {id:590, name:'Сознание'},
    {id:1565, name:'Творец мира'},
    {id:311, name:'Место силы'},
    {id:495, name:'Тональ'},
    {id:496, name:'Индейцы'},
    {id:760, name:'Политика'},
    {id:52, name:'Привычки'},
    {id:610, name:'Новые привычки'},
    {id:955, name:'Изменение'},
    {id:1019, name:'Жизнь'},
    {id:117, name:'Интериоризация'},
    {id:736, name:'Сериалы'},
    {id:569, name:'Чтение'},
    {id:1298, name:'Искусство'},
    {id:45, name:'Эмоция'},
    {id:227, name:'Образование'},
    {id:909, name:'Знание'},
    {id:203, name:'Экономика'},
    {id:225, name:'Социология'},
    {id:683, name:'Время'},
    {id:896, name:'Политология'},
    {id:172, name:'Наука'},
    {id:1109, name:'Вера'},
    {id:556, name:'Рост (увеличение)'},
    {id:1277, name:'Замедление'},
    {id:9, name:'Самообман'},
    {id:1224, name:'Учитель'},
    {id:11, name:'Понимание'},
    {id:940, name:'Расширение'},
    {id:1040, name:'Книга'},
    {id:3121, name:'Граница'},
    {id:368, name:'Страх'},
    {id:1604, name:'Уверенность'},
    {id:2235, name:'Уважение'},
    {id:2261, name:'Пробуждение'},
        
];

export let keywordsIdeas: KeywordsIdea[]=[
    {keyword_id:2, idea_id:1},
    {keyword_id:419, idea_id:1},
    {keyword_id:601, idea_id:1},
    {keyword_id:958, idea_id:1},
    {keyword_id:4, idea_id:2},
    {keyword_id:6, idea_id:2},
    {keyword_id:112, idea_id:2},
    {keyword_id:115, idea_id:2},
    {keyword_id:12, idea_id:4},
    {keyword_id:70, idea_id:4},
    {keyword_id:71, idea_id:4},
    {keyword_id:126, idea_id:60},
    {keyword_id:127, idea_id:60},
    {keyword_id:287, idea_id:253},
    {keyword_id:288, idea_id:253},
    {keyword_id:288, idea_id:254},
    {keyword_id:289, idea_id:254},
    {keyword_id:998, idea_id:254},
    {keyword_id:1979, idea_id:254},
    {keyword_id:590, idea_id:261},
    {keyword_id:1565, idea_id:261},
    {keyword_id:311, idea_id:274},
    {keyword_id:495, idea_id:472},
    {keyword_id:496, idea_id:472},
    {keyword_id:760, idea_id:472},
    {keyword_id:52, idea_id:621},
    {keyword_id:610, idea_id:621},
    {keyword_id:955, idea_id:621},
    {keyword_id:1019, idea_id:621},
    {keyword_id:117, idea_id:732},
    {keyword_id:736, idea_id:732},
    {keyword_id:569, idea_id:743},
    {keyword_id:1298, idea_id:743},
    {keyword_id:45, idea_id:751},
    {keyword_id:227, idea_id:751},
    {keyword_id:909, idea_id:751},
    {keyword_id:203, idea_id:837},
    {keyword_id:225, idea_id:837},
    {keyword_id:683, idea_id:837},
    {keyword_id:896, idea_id:837},
    {keyword_id:172, idea_id:959},
    {keyword_id:1109, idea_id:959},
    {keyword_id:203, idea_id:1105},
    {keyword_id:556, idea_id:1105},
    {keyword_id:1277, idea_id:1105},
    {keyword_id:9, idea_id:1234},
    {keyword_id:1224, idea_id:1234},
    {keyword_id:11, idea_id:1242},
    {keyword_id:940, idea_id:1242},
    {keyword_id:1040, idea_id:1242},
    {keyword_id:3121, idea_id:1242},
    {keyword_id:126, idea_id:2254},
    {keyword_id:368, idea_id:2254},
    {keyword_id:909, idea_id:2254},
    {keyword_id:1604, idea_id:2254},
    {keyword_id:2235, idea_id:2254},
    {keyword_id:2261, idea_id:2254},
];

export function setKeywordName(id: number, name: string) {
    keywords=[...keywords.filter(el=>el.id!=id), {id,name}];//.find(el=>el.id===id)!.name=name;
    keywords.sort((a, b) => (a.name > b.name)? 1 : ((b.name > a.name) ? -1 : 0));
}

export function addKeyword(name: string) {
    const maxIdKeywords=keywords.reduce((acc, curr) => acc.id > curr.id ? acc : curr);
    keywords=[...keywords, {id: maxIdKeywords.id+1,name}];//.find(el=>el.id===id)!.name=name;
    keywords.sort((a, b) => (a.name > b.name)? 1 : ((b.name > a.name) ? -1 : 0));
}

export function delKeyword(id: number) {
    keywords=[...keywords.filter(el=>el.id!=id)];//.find(el=>el.id===id)!.name=name;
}


export function prepare() {
    keywords.sort((a, b) => (a.name > b.name)? 1 : ((b.name > a.name) ? -1 : 0));
}    

export function setKeywordsIdea(idea_id: number, ideaKeywords: number[]) {
    const newEls=ideaKeywords.map(kw=>({idea_id: idea_id,keyword_id:kw}));
    keywordsIdeas=[...keywordsIdeas.filter(el=>el.idea_id!=idea_id), ...newEls];
}

prepare();