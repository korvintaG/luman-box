import { LabelPosition } from "../../../types/ui-types";

export type InputTextUIProps = React.ComponentPropsWithoutRef<"textarea"> & {
      label?: string;
      labelPosition?: LabelPosition;
      dataCy?: string;
  };
  