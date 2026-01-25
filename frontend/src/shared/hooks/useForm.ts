import { useState, ChangeEvent } from "react";
import { HTMLEditElement } from "../types/types-for-hooks";

/**
 * Хук для работы с формой
 * @param inputValues
 * @returns
 */
export function useForm<T>(inputValues: T) {
  const [values, setValues] = useState(inputValues);
  const [editStarted, setEditStarted] = useState(false);

  const getFormDTO = (): Partial<T> => {
    let obj: Partial<T> = Object.assign({}, values);
    //console.log('getFormDTO values=',values);
    let key: keyof Partial<T>;
    for (key in obj) {
      if (typeof obj[key] === "object") {
        if (Array.isArray(obj[key])) continue;
        try {
          let anaPart: any = obj[key]; // тут без any никак
          if (!anaPart?.id)
            // считаем, что объект только для .id, если изменится, нужно будет доработать код
            delete obj[key]; 
          else {
            anaPart.id = Number(anaPart.id);
            obj[key] = anaPart;
          }
        } catch { }
      }
    }
    return obj;
  };

  const getFormDTOObl = (): T => {
    let obj: T = { ...values };
    let key: keyof T;
    for (key in obj) {
      if (typeof obj[key] === "object") {
        if (Array.isArray(obj[key])) continue;
        let anaPart: any = obj[key]; // тут без any никак
        if (!anaPart?.id)
          // считаем, что объект только для .id, если изменится, нужно будет доработать код
          delete obj[key];
        else {
          anaPart.id = Number(anaPart.id);
          obj[key] = anaPart;
        }
      }
    }
    return obj;
  };

  const initValues = (el: T) => {
    setValues(el);
    setEditStarted(false);
  }

  const handleChange = (event: ChangeEvent<HTMLEditElement>) => {
    setEditStarted(true);
    const { value, name } = event.target;
    if (name.indexOf(".") > 0) {
      const [a, b] = name.split(".");
      let cobj = { [a]: { [b]: value } };
      setValues({ ...values, ...cobj });
    } else setValues({ ...values, [name]: value });
  };

  // TODO реализовать функцию означивания поля по имени
  const setFieldValueDirect = <T>(fieldName: string, value:T) =>{
    setEditStarted(true);
    setValues(prevValues => ({...prevValues, [fieldName]: value}))
  }

  return {
    values,
    handleChange,
    setValues,
    initValues,
    reset: () => setValues(inputValues),
    getFormDTO,
    getFormDTOObl,
    editStarted,
    setEditStarted,
    setFieldValueDirect
  };
}
