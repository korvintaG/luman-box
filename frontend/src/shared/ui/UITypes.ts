export type Classes = {
    classAdd?:string; // не везде есть
    classReplace?:string; // не везде есть
    classLabelReplace?: string;
    classLabelAdd?: string;
    classInputReplace?: string;
    classInputAdd?: string;
}

export type CustomInput = {
    label: string;
    classes?: Classes;
}
