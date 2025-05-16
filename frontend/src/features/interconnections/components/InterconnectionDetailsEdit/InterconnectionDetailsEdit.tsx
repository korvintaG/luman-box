import { FC } from "react";
import { ErrorMessageUI } from "../../../../shared/ui/ErrorMessage/ErrorMessage"; 

import { interconnectionsTypeInfo } from "../../../../shared/constants/InterconnectionTypeInfo"; 
import { User } from "../../../auth/user-types";
import { useInterconnectionDetailsEdit } from "../../hooks/UseInterconnectionDetailsEdit";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm";
import { InterconnectionTypeInfo } from "../../InterconnectionTypes";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/RecordControlBlock";
import styles from "./InterconnectionDetailsEdit.module.css";
import { IdeaCard } from "../ideaCard/ideaCard";
import { InterconnectionDescription } from "../InterconnectionDescription/InterconnectionDescription";
import { FillRecomendation } from "../FillRecomendation/FillRecomendation";
import { InterconnectionTitle } from "../InterconnectionList/InterconnectionTitle/InterconnectionTitle";
import { Authorship } from "../../../../shared/components/Authorship/Authorship";


export type InterconnectionDetailsEditProp = {
    id?: string;
    currentUser:User | null;
    afterSuccessDMLAction : (idea_id: number, iitype_id: number) => void;
    isReverse: boolean;
}

export const InterconnectionDetailsEdit: FC<InterconnectionDetailsEditProp> = 
( {    id, currentUser, afterSuccessDMLAction, isReverse}) => {
    const {form, status, record, moderate  } = useInterconnectionDetailsEdit({id, currentUser});

    let iitype: InterconnectionTypeInfo | undefined = undefined;
    if (record && record.currentRecord ) {
        iitype=interconnectionsTypeInfo.find(el=>el.id===record!.currentRecord!.interconnection_type)
        if (!iitype)
            return <ErrorMessageUI error={`Не найден тип связи идей=${record!.currentRecord!.id}`}/>
    }


    return <RecordEditForm
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        fetchRecord={record.fetchRecord}
      >
            <InterconnectionTitle typeName={iitype?.name} />
            {record.currentRecord && record.currentRecord.user && <Authorship
                userName={record.currentRecord.user.name}
                moderatorName={record.currentRecord.moderator?
                    record.currentRecord.moderator.name:null}
                className={styles.authorship}
                label="Взаимосвзяь"
            />}
            {record.currentRecord && record.currentRecord.ideaCurrent &&
                <div className={styles.idea_top}>
                        <IdeaCard
                        id={record.currentRecord.ideaCurrent.id}
                        name={record.currentRecord.ideaCurrent.name}
                        ideaTypeInfo={iitype?.name1_one}
                        source={{
                            id: record.currentRecord.ideaCurrent.source_id, 
                            name: record.currentRecord.ideaCurrent.source_name
                        }}/>
                </div>}
            <InterconnectionDescription
                nameDirect={form.values.nameDirect}
                nameReverse={form.values.nameReverse}
                handleChange={form.handleChange}
                ideaTypeInfo={iitype}
            />

            {record.currentRecord && record.currentRecord.ideaInterconnect &&
                <div className={styles.idea_bottom}>
                        <IdeaCard
                        id={record.currentRecord.ideaInterconnect.id}
                        name={record.currentRecord.ideaInterconnect.name}
                        ideaTypeInfo={iitype?.name2_one}
                        source={{
                            id: record.currentRecord.ideaInterconnect.source_id, 
                            name: record.currentRecord.ideaInterconnect.source_name
                        }}/>
                </div>}
        <FillRecomendation/>
        <RecordControlBlock
            id={id}
            sliceState={status.sliceStates[0]}
            error={status.errorText}
            editAccessStatus={status.editAccessStatus}
            deleteRecord={record.deleteRecordAction}
            afterSuccessDMLAction={()=>{
                //console.log('afterSuccessDMLAction',isReverse);
                afterSuccessDMLAction(
                    isReverse?
                        record!.currentRecord!.idea2_id
                        :record!.currentRecord!.idea1_id,
                    record!.currentRecord!.interconnection_type)}}
            approveRecord={moderate.approveRecordAction}
            rejectRecord={moderate.rejectRecordAction}
        />

    </RecordEditForm>
}
 

  