import { InterconnectionTypeInfo } from "../../../InterconnectionTypes"; 
   
import { FC } from "react";
import styles from "./InterconnectionList.module.css";
import { ButtonAddUI } from "../../../../../shared/ui/buttons/button-add"; 
import { useInterconnectionList } from "../../../hooks/UseInterconnectionList";
import { IdeasTable } from "../../ui/IdeasTable/IdeasTable";
import { Preloader } from "../../../../../shared/ui/Preloader";
import { InterconnectionsListTitle } from "../../ui/InterconnectionsListTitle/InterconnectionsListTitle";
import { RecordsList } from "../../../../../shared/components/RecordsList";


export type InterconnectionListProps = {
    interconnectionTypeInfo: InterconnectionTypeInfo;
    readOnly: boolean;
    gotoInterconnectionAdd: (isReverse: boolean)=>void;
    idea_id:number;
    iitype_id:number;
};

export const InterconnectionList: FC<InterconnectionListProps> = (
    {interconnectionTypeInfo: iTI,
     readOnly,
     gotoInterconnectionAdd, idea_id, iitype_id}
  ) => {

    const {interconnections, sliceState, error, addNewInterconnection, fetchRecords} = 
        useInterconnectionList({gotoInterconnectionAdd, idea_id, iitype_id});

    if (!interconnections)
        return <Preloader/>

    return <RecordsList
        skipUl
        fetchRecords={fetchRecords}
        sliceState={sliceState}
        error={error}
        mainClassName={styles.container}
    >
        <InterconnectionsListTitle
            idea={interconnections.idea}
            iitype_name={iTI.name}
        />
        <section className={styles.left_section}>
            <IdeasTable
                sectionClass={styles.left_section_table}
                title={iTI.name1_many}
                isReverse={true}
                ideas={interconnections.interconnections_reverse}
            />
            {!readOnly && <ButtonAddUI 
                classAdd={styles.button_add}
                caption="Добавить взаимосвязь"
                action={()=>addNewInterconnection(true)} />}
        </section>
        <iTI.icon className={styles.icon}/>
        <section className={styles.right_section}>
            <IdeasTable
                sectionClass={styles.right_section_table}
                title={iTI.name2_many}
                isReverse={false}
                ideas={interconnections.interconnections_direct}
            />
            {!readOnly && <ButtonAddUI 
                classAdd={styles.button_add}
                caption="Добавить взаимосвязь"
                action={()=>addNewInterconnection(false)} />}
        </section>
    </RecordsList>

  }

