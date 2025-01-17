import { FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, SourceRaw, Author} from '../../../../utils/type'
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {ErrorMessageUI} from '../../uni/error-message/error-message'
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {InputSelectUI} from '../../uni/input-select/input-select'
import styles from './source-details.module.css'

export type SourceDetailsUIProps = {
    id: number | null;
    readOnly: boolean;
    values: SourceRaw; // карточка исходника
    initialName: string; // исходное название источника
    error?: string;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // изменение элемента ввода
    handleSubmit: (e: SyntheticEvent) => void; // действия по submit
    deleteSource: (e: SyntheticEvent) => void; // действия по удалению источника
    authors: Author[]; // список авторов для выбора в лукапе
}

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetailsUI: FC<SourceDetailsUIProps> = ({id, values, readOnly,
        initialName, error, handleChange, handleSubmit, deleteSource, authors}) => {
    const header = id ? `Редактирование источника [${initialName}]` : 'Добавление нового источника';
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить источник';

    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InputEditUI name="name" label='Название источника:' value={values.name} 
                placeholder="Укажите название источника"
                inputClassAdd={styles.input}
                readOnly={readOnly}
                handleChange={handleChange} />
            <InputSelectUI name="author.id" label="Выберите автора:" value={values.author?values.author.id:0}
                readOnly={readOnly}
                selectClassAdd={styles.input}
                handleChange={handleChange} values={authors}/>
            {error && <ErrorMessageUI error={error}/>}
            <RecordButtonBlockUI id={id} 
                readOnly={readOnly}
                deleteRecord={deleteSource} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить источник' />
    </RecordEditUI>
}
