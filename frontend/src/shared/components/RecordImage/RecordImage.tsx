import { FC, SyntheticEvent, useId, useRef } from "react";
import styles from "./RecordImage.module.css";
import { RequestStatus } from "../../types/types-for-hooks";
import { ButtonUI } from "../../ui/button";

export const STORE_FILE_PATH =
  process.env.REACT_APP_IMAGE_URL! +
  "/" +
  process.env.REACT_APP_STORE_FILE_PATH!;

export const UPLOAD_FILE_PATH =
  process.env.REACT_APP_IMAGE_URL! +
  "/" +
  process.env.REACT_APP_UPLOAD_FILE_PATH!;

export type RecordImageProps = {
  imageURL: string | null;
  newImageURL: string | null | undefined;
  readOnly: boolean;
  uploadFileAction: (data: FormData) => void;
  deleteImage: () => void;
  //sliceStatus: RequestStatus;
};

export const RecordImage: FC<RecordImageProps> = (props) => {
  //console.log("RecordImage", props);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const id = useId();
  let src: string | null = null;
  if (props.newImageURL !== null) {
    // не сброшено
    if (props.newImageURL) src = `${UPLOAD_FILE_PATH}/${props.newImageURL}`;
    else if (props.imageURL) src = `${STORE_FILE_PATH}/${props.imageURL}`;
  }

  const handleFileChange = (e: SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.length) {
      const dataFile = new FormData();
      dataFile.append("image", e.currentTarget.files[0]);
      props.uploadFileAction(dataFile);
    }
  };

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  if (!src && props.readOnly)
    return null;

  return (
    <div className={styles.container}>
      {src && <img src={src} />}
      {!props.readOnly && (
        <div className={styles.control}>
          <input
            id={id}
            ref={fileRef}
            className={styles.hidden}
            onChange={handleFileChange}
            data-cy="file-input"
            type="file"
          />

          <ButtonUI
            type="button"
            logicType="add"
            caption="Загрузить фото"
            onClick={handleUploadClick}
            data-cy="upload-button"
          />
          {src && (
            <ButtonUI
              logicType="alert"
              // className={styles.button_del}
              onClick={(e) => props.deleteImage()}
              caption="Удалить фото"
              data-cy="delete-button"
            />
          )}
        </div>
      )}
    </div>
  );
};
