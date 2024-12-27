import { useState, ChangeEvent } from 'react';
import { HTMLEditElement } from '../utils/type'

/**
 * Хук для работы с формой
 * @param inputValues
 * @returns
 */
export function useForm<T>(inputValues: T) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event: ChangeEvent<HTMLEditElement >) => {
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
    reset: () => setValues(inputValues)
  };
}
