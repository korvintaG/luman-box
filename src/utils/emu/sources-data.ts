import { Source, SourceEditData, SourceExtension } from "../type";
import {authorsCur} from './authors-data'

export let sourcesCur: Source[] = [
    { id:1, author_id:1, name:'Как делать полезные заметки'},
    { id:21, author_id:19, name:'Управление инновациями : опыт ведущих компаний'},
    { id:4, author_id:21, name:'Предисловие к книге Карлоса Кастанеды "Учение Дона Хуана: путь знания индейцев Яки"'},
    { id:28, author_id:6, name:'Учение Дона Хуана: путь знания индейцев Яки'},
    { id:45, author_id:6, name:'Сказки о силе'},
    { id:66, author_id:41, name:'Как читать книги'},
    { id:70, author_id:42, name:'Как изменится мир в ближайшие годы. Что стоит за происходящим.'},
    { id:82, author_id:42, name:'Проект глобальной перестройки в действии. От зомби к "Планете обезьян".'},
    { id:90, author_id:45, name:'Про обман Собчак, женский мозг, измены, секреты отношений / 50 вопросов'},
    { id:113, author_id:42, name:'Как наука скрывает реальность. Глубинная власть и её истоки.'},
    { id:136, author_id:54, name:'Город на краю света'},
    { id:156, author_id:42, name:'Мир ломается. Что дальше?'},
    { id:178, author_id:68, name:'Как читать книги. Руководство по чтению великих произведений'},
    { id:181, author_id:42, name:'Проект мировых элит "Два человечества". Что будет, если они победят.'},
    { id:185, author_id:70, name:'Цифровой минимализм. Фокус и осознанность в шумном мире'},
    { id:197, author_id:42, name:'Конец мировой системы. Население Земли сократится на 90 процентов?'},
    { id:204, author_id:73, name:'Опытный кролик'},
    { id:221, author_id:42, name:'Самый большой раскол в истории человечества'},
    { id:229, author_id:42, name:'Приходит мир, который не ждали. Что для планеты означает конец прогресса'},
    { id:232, author_id:80, name:'Письмо Суворину А. С., 18 декабря 1893 г. Москва'},
    { id:247, author_id:41, name:'Искусство спора'},
    { id:270, author_id:85, name:'Как поменять мышление'},
    { id:283, author_id:90, name:'Сталинград'},
    { id:316, author_id:94, name:'Преодоление пропасти. Как вывести технологический продукт на массовый рынок'},
    { id:318, author_id:6, name:'Отдельная реальность'},
    { id:419, author_id:109, name:'Сила настоящего'},
    { id:445, author_id:110, name:'Маркетинг без бюджета. 50 работающих инструментов'},
    { id:481, author_id:124, name:'Загадка слова "Русь"'},
    { id:504, author_id:126, name:'Магеллан - прибытие'},
    { id:601, author_id:137, name:'Дебаты Портникова и Латыниной: неудобные вопросы.'}
];

export let  sourcesExtension: SourceExtension[]=prepare();

export function prepare():SourceExtension[] {
    let sources = sourcesCur.map((el)=> {
        const author=authorsCur.find((e)=>e.id===el.author_id);
        return {...el, 
            authorName:author? author.name : ''
        }
    });
    sources.sort((a, b) => (a.name > b.name)? 1 : ((b.name > a.name) ? -1 : 0));
    return sources;
}    

export function setSource(element:Source) {
    sourcesCur=[...sourcesCur.filter(el=>el.id!=element.id), element];
    sourcesExtension=prepare();
}

export function addSource(element: SourceEditData) {
    const maxIdSource=sourcesCur.reduce((acc, curr) => acc.id > curr.id ? acc : curr);
    sourcesCur=[...sourcesCur, {name:element.name, author_id:Number(element.author_id), id: maxIdSource.id+1}];
    sourcesExtension=prepare();
}

export function delSource(id: number) {
    sourcesCur=[...sourcesCur.filter(el=>el.id!=id)];
    sourcesExtension=prepare();
}

