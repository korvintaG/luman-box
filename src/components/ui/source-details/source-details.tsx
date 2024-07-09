import { FC, ChangeEvent, SyntheticEvent } from 'react';
import clsx from 'clsx';
import { SourceEditData, Author} from '../../../utils/type'
import styles from './source-details.module.css'

export type SourceDetailsUIProps = {
    id: number | null;
    values: SourceEditData; // карточка исходника
    initialName: string; // исходное название источника
    error: string;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // изменение элемента ввода
    handleSubmit: (e: SyntheticEvent) => void; // действия по submit
    deleteSource: (e: SyntheticEvent) => void; // действия по удалению источника
    authors: Author[]; // список авторов для выбора в лукапе
}

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetailsUI: FC<SourceDetailsUIProps> = ({id, values, initialName, error, handleChange, handleSubmit, deleteSource, authors}) => {
    let btnCaptione='Сохранить данные';
    let header='Добавление нового источника';

    if (!id)
        btnCaptione='Добавить источник'
    else
        header=`Редактирование источника [${initialName}]`;
   
    return <main>
        <h1 className='header_record'>{header}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className='input_block'>
                <label htmlFor="name" className={clsx('input_label',styles.input_label)}>Название источника:</label>
                <input className={clsx('input_edit',styles.input)} 
                    value={values.name} name="name" placeholder="Укажите название источника"
                    onChange={handleChange}/>
            </div>
            <div className='input_block'>
                <label htmlFor="author_id" className={clsx('input_label',styles.input_label)}>Выберите автора:</label>
                <select value={values.author_id} name="author_id" onChange={handleChange}
                    className={clsx('input_edit',styles.input,'select')} >
                    <option value='0'></option>
                    {authors.map((el)=>
                        <option className={styles.option} value={el.id} key={el.id}>{el.name}</option>
                    )}
                </select>
            </div>
            {error!='' && <p className='error'>{error}</p>}
            <div className='button_block'>
                <button className='button_submit'>{btnCaptione}</button>
                {id && <button className='button_delete' onClick={deleteSource}>Удалить источник</button>}
            </div>
        </form>
    </main>
}
