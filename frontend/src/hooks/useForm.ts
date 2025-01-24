import { useState, ChangeEvent } from 'react';
import { HTMLEditElement } from '../utils/type'
import { lookup } from 'dns';

/**
 * Хук для работы с формой
 * @param inputValues
 * @returns
 */
export function useForm<T>(inputValues: T) {
  const [values, setValues] = useState(inputValues);

  const getFormDTO= ():Partial<T>=>{
    let obj:Partial<T>=Object.assign({}, values)
    let key: keyof Partial<T>;
    for(key in obj) {
      if (typeof obj[key]=== 'object') {
        let anaPart:any=obj[key]; // тут без any никак
        if (!anaPart.id) // считаем, что объект только для .id, если изменится, нужно будет доработать код
          delete(obj[key])
        else {
          anaPart.id=Number(anaPart.id);
          obj[key]=anaPart
        }
      }
    }    
    return obj;
  };

  const getFormDTOObl= ():T=>{
    let obj:T={...values};
    let key: keyof T;
    for(key in obj) {
      if (typeof obj[key]=== 'object') {
        let anaPart:any=obj[key]; // тут без any никак
        if (!anaPart.id) // считаем, что объект только для .id, если изменится, нужно будет доработать код
          delete(obj[key])
        else {
          anaPart.id=Number(anaPart.id);
          obj[key]=anaPart
        }
      }
    }    
    return obj;
  };


  const handleChange = (event: ChangeEvent<HTMLEditElement >) => {
    console.log('handleChange',event.target)
    const { value, name } = event.target;
    if (name.indexOf('.')>0)
    {
      const [a, b] = name.split('.')
      let cobj={[a]:{[b]:value}};
      setValues({ ...values, ...cobj });
    }
    else
      setValues({ ...values, [name]: value });
  };

  return {
    values,
    handleChange,
    setValues,
    reset: () => setValues(inputValues),
    getFormDTO,
    getFormDTOObl
  };
}
