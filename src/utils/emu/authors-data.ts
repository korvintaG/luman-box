import { Author } from "../type";

export let authorsCur: Author[] = [
    { id: 68, name: 'Адлер Мортимер' },
    { id: 90, name: 'Бивор Энтони' },
    { id: 116, name: 'Бушков Алекснадр' },
    { id: 97, name: 'Васильев Сергей' },
    { id: 54, name: 'Гамильтон Эдмунд' },
    { id: 21, name: 'Гуревич Павел Семенович' },
    { id: 124, name: 'Данилевский Игорь' },
    { id: 45, name: 'Дас Сатья' },
    { id: 137, name: 'Дацюк Сергей' },
    { id: 1, name: 'Зонке Аренс' },
    { id: 126, name: 'Ильичев Евгений' },
    { id: 31, name: 'Караганов Сергей' },
    { id: 6, name: 'Карлос Кастанеда' },
    { id: 110, name: 'Манн Игорь' },
    { id: 48, name: 'Маск Илон' },
    { id: 94, name: 'Мур Джеффри' },
    { id: 70, name: 'Ньюпорт Кэл' },
    { id: 41, name: 'Поварнин Сергей' },
    { id: 73, name: 'Полковников Дмитрий' },
    { id: 85, name: 'Рерих Елена' },
    { id: 109, name: 'Толле Экхарт' },
    { id: 42, name: 'Фурсов Андрей' },
    { id: 19, name: 'Харгадон Эндрю' },
    { id: 80, name: 'Чехов А.П.' }
];

export function setName(id: number, name: string) {
    authorsCur=[...authorsCur.filter(el=>el.id!=id), {id,name}];//.find(el=>el.id===id)!.name=name;
    authorsCur.sort((a, b) => (a.name > b.name)? 1 : ((b.name > a.name) ? -1 : 0));
}

export function addAuthor(name: string) {
    const maxIdAuthor=authorsCur.reduce((acc, curr) => acc.id > curr.id ? acc : curr);
    authorsCur=[...authorsCur, {id: maxIdAuthor.id+1,name}];//.find(el=>el.id===id)!.name=name;
    authorsCur.sort((a, b) => (a.name > b.name)? 1 : ((b.name > a.name) ? -1 : 0));
}

export function delAuthor(id: number) {
    authorsCur=[...authorsCur.filter(el=>el.id!=id)];//.find(el=>el.id===id)!.name=name;
}
