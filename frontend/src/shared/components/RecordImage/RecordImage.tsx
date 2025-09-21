import { FC, SyntheticEvent, useId, useRef, useState } from "react";
import styles from "./RecordImage.module.css";
import { RequestStatus } from "../../types/types-for-hooks";
import { ButtonUI } from "../../ui/button";
import { useMsgModal } from "../../hooks/useMsgModal";
import { MsgErrorModalUI } from "../../ui/Modal/MsgErrorModal/MsgErrorModal";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const msgErrorHook = useMsgModal();
  let src: string | null = null;
  if (props.newImageURL !== null) {
    // не сброшено
    if (props.newImageURL) src = `${UPLOAD_FILE_PATH}/${props.newImageURL}`;
    else if (props.imageURL) src = `${STORE_FILE_PATH}/${props.imageURL}`;
  }

  const errorCloseAction = () => {
    setErrorMessage(null);
    msgErrorHook.closeDialog();
  };

  const handleFileChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setErrorMessage(null); // Сбрасываем предыдущую ошибку
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Пожалуйста, выберите файл изображения');
      msgErrorHook.openDialogDirectly();
      //props.deleteImage()
      return;
    }

    const maxFileSize = Number(process.env.REACT_APP_MAX_FILE_SIZE!);
    console.log('file.size', file.size, 'maxFileSize', maxFileSize);
    if (file.size > maxFileSize) {
      setErrorMessage(`Размер файла не должен превышать ${Math.round(maxFileSize / 1024)}KB`);
      e.currentTarget.value = '';
      msgErrorHook.openDialogDirectly();
     // props.deleteImage();
      return;
    }

    const dataFile = new FormData();
    dataFile.append("image", file, file.name);
    props.uploadFileAction(dataFile);
  };

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  if (!src && props.readOnly)
    return null;

  return (
    <div className={styles.container}>
    {msgErrorHook.dialogWasOpened && (
      <MsgErrorModalUI
        message={`${errorMessage}`}
        closeAction={errorCloseAction}
      />
    )}

      {src && <img src={src} data-cy="image-preview" />}
      {/*errorMessage && (
        <div className={styles.error} data-cy="file-error">
          {errorMessage}
        </div>
      )*/}
      {!props.readOnly && (
        <div className={styles.control}>
          <input
            id={id}
            ref={fileRef}
            className={styles.hidden}
            onChange={handleFileChange}
            data-cy="file-input"
            accept="image/*"
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
