import { FC } from "react";
import { InfoFieldUI } from "../../ui/fields/info-field/info-field"; 
import styles from "./Authorship.module.css";

export type AuthorshipProps = {
  userName: string | null;
  moderatorName: string | null | undefined;
  className: string;
  label?:string;
};

export const Authorship: FC<AuthorshipProps> = (props: AuthorshipProps) => {
  if (!props.userName && !props.moderatorName) return null;
  return (
    <section className={styles.main}>
      {props.userName && (
        <InfoFieldUI
          label={(props.label?props.label:"Запись")+" добавил:"}
          text={props.userName}
          labelClassAdd={props.className}
        />
      )}
      {props.moderatorName && (
        <InfoFieldUI
          labelClassAdd={props.className}
          label="Проверил:"
          text={props.moderatorName}
        />
      )}
    </section>
  );
};
