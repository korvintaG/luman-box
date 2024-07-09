import { FC, SyntheticEvent } from 'react';
import styles from './author-details.module.css'

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsUIProps = {
    id: number | null;
    name: string;
    initialName: string; // начальное имя
    error: string;
    setName: (newName: string) => void; // из useState
    handleSubmit: (e: SyntheticEvent) => void; // сохранить изменения в базе
    deleteAuthor: (e: SyntheticEvent) => void; // функция удаления автора
}

export const AuthorDetailsUI: FC<AuthorDetailsUIProps> = ({id, name, initialName, error, setName, handleSubmit, deleteAuthor}) => {
    let btnCaptione='Сохранить данные';
    let header='Добавление нового автора';
    if (!id)
        btnCaptione='Добавить автора';
    else
        header=`Редактирование автора [${initialName}]`;
   
    return <main>
        <h1 className='header_record'>{header}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className='input_block'>
                <label htmlFor="name" className='input_label'>ФИО автора:</label>
                <input className='input_edit'
                    value={name} name="name" placeholder="Укажите ФИО автора"
                    onChange={(e) => setName(e.target.value)}>
                </input>
            </div>
            {error!='' && <p className='error'>{error}</p>}
            <div className='button_block'>
                <button className='button_submit'>{btnCaptione}</button>
                {id && <button className='button_delete' onClick={deleteAuthor}>Удалить автора</button>}
            </div>
        </form>
    </main>
}
