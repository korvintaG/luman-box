import { FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, SourceRaw, Author} from '../../../../utils/type'
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {ErrorMessageUI} from '../../uni/error-message/error-message'
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {InputSelectUI} from '../../uni/input-select/input-select'
import styles from './source-details.module.css'
import {genHeaderText} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'

export type SourceDetailsUIProps = {
    id: number | null;
    readOnly: boolean;
    values: SourceRaw; // карточка исходника
    initialName: string; // исходное название источника
    error?: string;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // изменение элемента ввода
    handleSubmit: (e: SyntheticEvent) => void; // действия по submit
    deleteRecord: (e: SyntheticEvent) => void; // действия по удалению источника
    authors: Author[]; // список авторов для выбора в лукапе
    userName: string;
}

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetailsUI: FC<SourceDetailsUIProps> = ({id, values, readOnly,
        initialName, error, handleChange, handleSubmit, deleteRecord, authors, userName}) => {
    const header= genHeaderText(readOnly,id,initialName,'источника'); 
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить источник';

    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InfoFieldUI label='Запись добавил:' text={userName} textClassAdd={styles.input}/>        
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
                deleteRecord={deleteRecord} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить источник' />
    </RecordEditUI>
}

export function SourceDetailsUIFC (props:SourceDetailsUIProps) {
    return (
                <SourceDetailsUI {...props}/>
    ) 
}