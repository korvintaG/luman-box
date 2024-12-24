import clsx from 'clsx';

export type classVar=string | undefined | null;

export function combineClasses(inherited:classVar, replace: classVar, add: classVar): string {
    let classRes='';
    if (inherited)
        classRes=inherited;
    if (replace)
        classRes=replace;
    if (add)
        classRes=clsx(add,classRes);
    return classRes;
}
