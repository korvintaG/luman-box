import { FunctionComponent } from "react";
import { SimpleComponentType } from "../CMS/CMSTypes";

export interface IAboutCard {
  id: number;
  title: string;
  titleURL: string;
  text: SimpleComponentType | FunctionComponent<{}>;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
