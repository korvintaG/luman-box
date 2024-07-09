import { useState, ChangeEvent } from 'react';

/**
 * Хук для работы с формой
 * @param inputValues
 * @returns
 */
export function useForm<T>(inputValues: T) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  /*const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };*/


  return {
    values,
    handleChange,
    setValues,
    reset: () => setValues(inputValues)
  };
}
