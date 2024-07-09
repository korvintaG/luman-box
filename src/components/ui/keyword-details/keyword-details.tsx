import { FC, useEffect, SyntheticEvent } from 'react';
import styles from './keyword-details.module.css'


export type KeywordDetailsUIProps = {
    id: number | null;
    name: string;
    initialName: string; // начальное имя
    error: string;
    setName: (newName: string) => void;
    handleSubmit: (e: SyntheticEvent) => void;
    deleteKeyword: (e: SyntheticEvent) => void;
}

export const KeywordDetailsUI: FC<KeywordDetailsUIProps> = ({id, name, initialName, error, setName, handleSubmit, deleteKeyword}) => {
    let btnCaptione='Сохранить данные';
    let header='Добавление нового автора';
    if (!id)
        btnCaptione='Добавить ключевое слово';
    else
        header=`Редактирование ключевого слова [${initialName}]`;
    
    return <main>
        <h1 className='header_record'>{header}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className='input_block'>
                <label htmlFor="name" className='input_label'>Ключевое слово:</label>
                <input value={name} name="name" placeholder="Введите ключевое слово"
                    className='input_edit'
                    onChange={(e) => setName(e.target.value)}
                />
                {error!='' && <p className={styles.error}>{error}</p>}
            </div>
            <div className='button_block'>
                <button className='button_submit'>{btnCaptione}</button>
                {id && <button className='button_delete' onClick={deleteKeyword}>Удалить ключевое слово</button>}
            </div>
        </form>
    </main>
}
