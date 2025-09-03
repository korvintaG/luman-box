import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { InterconnectionTypeInfo } from "../../../types/UI-types";

import styles from "./InterconnectionList.module.css";
import { ButtonUI } from "../../../../../shared/ui/button";
import { useInterconnectionList } from "../../../hooks/UseInterconnectionList";
import { IdeasTable } from "../../ui/IdeasTable/IdeasTable";
import { Preloader } from "../../../../../shared/ui/Preloader";
import { RecordsList } from "../../../../../shared/components/RecordsList";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { genIdeaURL } from "../../../../../app/router/navigation";

export type InterconnectionListProps = {
  interconnectionTypeInfo: InterconnectionTypeInfo;
  readOnly: boolean;
  gotoInterconnectionAdd: (isReverse: boolean) => void;
  idea_id: number;
  iitype_id: number;
};

export const InterconnectionList: FC<InterconnectionListProps> = ({
  interconnectionTypeInfo: iTI,
  readOnly,
  gotoInterconnectionAdd,
  idea_id,
  iitype_id,
}) => {
  const {
    interconnections,
    sliceState,
    error,
    addNewInterconnection,
    fetchRecords,
  } = useInterconnectionList({ gotoInterconnectionAdd, idea_id, iitype_id });

  if (!interconnections) return <Preloader />;

  const tabHeader = `Взаимосвязи идеи [${interconnections.idea.name}] типа: ${iTI.name}`;

  return (
    <>
      <Helmet>
        <title>{tabHeader}</title>
      </Helmet>

      <RecordsList
        skipUl
        fetchRecords={fetchRecords}
        sliceState={sliceState}
        error={error}
        showBackButton
        header={`Взаимосвязи типа: ${iTI.name}`}
        mainClassName={styles.container}
        breadcrumbs={[
          BreadcrumbSimpeType.IdeasList,
          {
            name: `Идея: [${interconnections.idea.name}, ID=${interconnections.idea.id}]`,
            path: genIdeaURL(interconnections.idea.id),
            svg: interconnections.idea.SVG || undefined
          },
        ]}
      >
        <section className={styles.left_section}>
          <IdeasTable
            sectionClass={styles.left_section_table}
            title={iTI.name1_many}
            isReverse={true}
            ideas={interconnections.interconnections_reverse}
          />
          {!readOnly && (
            <ButtonUI
              logicType="add"
              // className={styles.button_add} 
              caption="Добавить взаимосвязь"
              onClick={() => addNewInterconnection(true)}
            />
          )}
        </section>
        <iTI.icon className={styles.icon} />
        <section className={styles.right_section}>
          <IdeasTable
            sectionClass={styles.right_section_table}
            title={iTI.name2_many}
            isReverse={false}
            ideas={interconnections.interconnections_direct}
          />
          {!readOnly && (
            <ButtonUI
              logicType="add"
              // className={styles.button_add}
              caption="Добавить взаимосвязь"
              onClick={() => addNewInterconnection(false)}
            />
          )}
        </section>
      </RecordsList>
    </>
  );
};
