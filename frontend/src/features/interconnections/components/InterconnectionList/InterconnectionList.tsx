import { InterconnectionTypeInfo } from "../../InterconnectionTypes"; 
   
import { FC } from "react";
import styles from "./InterconnectionList.module.css";
import { ButtonAddUI } from "../../../../shared/ui/buttons/button-add"; 
import { IdeaTitle } from "../../../../shared/components/Titles/IdeaTitle/IdeaTitle";
import { SourceTitle } from "../../../../shared/components/Titles/SourceTitle/SourceTitle"; 
import { useInterconnectionList } from "../../hooks/UseInterconnectionList";
import { IdeasTable } from "../IdeasTable/IdeasTable";
import { Preloader } from "../../../../shared/ui/Preloader";


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

    return <main className={styles.container}>
        <h1 className={styles.title}>
            <IdeaTitle 
                ideaID={interconnections.idea.id}
                ideaName={interconnections.idea.name}
            />
            <SourceTitle 
                sourceID={interconnections.idea.source_id}
                sourceName={interconnections.idea.source_name}
            />
            <span>Тип взаимосвязи:&nbsp; 
                <div className={styles.interconnections_type_comment}>
                    {iTI.name}</div>
            </span>
        </h1>
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
    </main>

  }

