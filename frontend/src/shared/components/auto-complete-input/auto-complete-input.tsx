import { FC, useState, useEffect, useRef, useId, useCallback, KeyboardEvent, ChangeEvent } from "react";
import styles from "./auto-complete-input.module.scss";
import { CustomInput } from "../../types/ui-types";

export const autoCompleteDataCy = 'autocomplete';

export type AutocompleteInputProps<T> = Omit<React.ComponentPropsWithoutRef<"input">, "onChange" | "value" | "onSelect"> & CustomInput & {
  /** Функция поиска, которая принимает строку запроса и возвращает Promise с массивом результатов */
  searchFunction: (query: string) => Promise<T[]>;
  /** Функция для получения отображаемого текста из элемента */
  getDisplayText: (item: T) => string;
  /** Функция для получения значения из элемента (для value) */
  getValue?: (item: T) => any;
  /** Минимальное количество символов для начала поиска (по умолчанию 3) */
  minChars?: number;
  /** Callback при выборе элемента */
  onSelect?: (item: T | null) => void;
  /** Callback при изменении значения */
  onChange?: (value: string, selectedItem: T | null) => void;
  /** Значение для отображения */
  value?: string;
  /** Выбранный элемент */
  selectedItem?: T | null;
  dataCy?: string;
};

export const AutocompleteInput = <T,>({
  label,
  searchFunction,
  getDisplayText,
  getValue,
  minChars = 3,
  onSelect,
  onChange,
  value: controlledValue,
  selectedItem: controlledSelectedItem,
  dataCy,
  readOnly,
  ...inputProps
}: AutocompleteInputProps<T>) => {
  const inputId = useId();
  const [inputValue, setInputValue] = useState<string>(controlledValue || "");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<T | null>(controlledSelectedItem || null);
  const [error, setError] = useState<string | null>(null);
  const [openFromTop, setOpenFromTop] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);

  // Синхронизация с controlled props
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (controlledSelectedItem !== undefined) {
      setSelectedItem(controlledSelectedItem);
      if (controlledSelectedItem) {
        setInputValue(getDisplayText(controlledSelectedItem));
      }
    }
  }, [controlledSelectedItem, getDisplayText]);

  // Функция для определения, открывать ли список сверху или снизу
  const calculateListPosition = useCallback(() => {
    if (!inputRef.current) return;
    
    const rect = inputRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const inputCenterY = rect.top + rect.height / 2;
    
    // Если центр поля ввода находится в нижней половине окна, открываем сверху
    const shouldOpenFromTop = inputCenterY > windowHeight / 2;
    setOpenFromTop(shouldOpenFromTop);
  }, []);

  // Поиск при изменении значения
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedValue = inputValue.trim();
    
    if (trimmedValue.length < minChars) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    setError(null);

    searchTimeoutRef.current = setTimeout(async () => {
      // Сохраняем позицию курсора перед блокировкой
      if (inputRef.current) {
        cursorPositionRef.current = {
          start: inputRef.current.selectionStart || 0,
          end: inputRef.current.selectionEnd || 0
        };
      }
      
      // Блокируем ввод перед началом запроса к серверу
      setIsLoading(true);
      
      try {
        const results = await searchFunction(trimmedValue);
        setError(null);
        setSuggestions(results);
        calculateListPosition();
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ошибка при поиске";
        setError(errorMessage);
        setSuggestions([]);
        calculateListPosition();
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } finally {
        // Разблокируем ввод после завершения запроса (успешного или с ошибкой)
        setIsLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        // Если запрос был отменен (изменился inputValue), разблокируем ввод
        setIsLoading(false);
        // Очищаем сохраненную позицию курсора
        cursorPositionRef.current = null;
      }
    };
  }, [inputValue, searchFunction, minChars]);

  // Восстановление фокуса и позиции курсора после разблокировки
  useEffect(() => {
    if (!isLoading && inputRef.current && cursorPositionRef.current) {
      // Используем requestAnimationFrame для гарантии, что DOM обновлен
      requestAnimationFrame(() => {
        if (inputRef.current && cursorPositionRef.current) {
          // Восстанавливаем фокус
          inputRef.current.focus();
          
          // Восстанавливаем позицию курсора
          const { start, end } = cursorPositionRef.current;
          inputRef.current.setSelectionRange(start, end);
          
          // Очищаем сохраненную позицию
          cursorPositionRef.current = null;
        }
      });
    }
  }, [isLoading]);

  // Пересчет позиции списка при изменении размера окна или прокрутке
  useEffect(() => {
    if (!showSuggestions) return;

    const handleResizeOrScroll = () => {
      calculateListPosition();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [showSuggestions, calculateListPosition]);

  // Закрытие подсказок при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedItem(null);
    setShowSuggestions(true);
    
    if (onChange) {
      onChange(newValue, null);
    }
  };

  const handleSelectItem = (item: T) => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(item);
    }
    
    // Сбрасываем поле ввода в пустую строку после выбора
    setInputValue("");
    setSelectedItem(null);
    
    if (onChange) {
      onChange("", null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;

    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectItem(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Если значение не соответствует выбранному элементу, очищаем выбор
    if (selectedItem && getDisplayText(selectedItem) !== inputValue.trim()) {
      setSelectedItem(null);
      if (onSelect) {
        onSelect(null);
      }
      if (onChange) {
        onChange(inputValue, null);
      }
    }
  };

  // Функция для выделения подстроки в тексте
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query || query.trim().length === 0) {
      return text;
    }

    const trimmedQuery = query.trim();
    const lowerText = text.toLowerCase();
    const lowerQuery = trimmedQuery.toLowerCase();
    
    // Находим все вхождения подстроки без учета регистра
    const parts: Array<{ text: string; highlight: boolean }> = [];
    let lastIndex = 0;
    let searchIndex = 0;

    while ((searchIndex = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
      // Добавляем текст до совпадения
      if (searchIndex > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, searchIndex),
          highlight: false
        });
      }
      
      // Добавляем выделенную часть
      parts.push({
        text: text.substring(searchIndex, searchIndex + trimmedQuery.length),
        highlight: true
      });
      
      lastIndex = searchIndex + trimmedQuery.length;
    }
    
    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        highlight: false
      });
    }
    
    // Если совпадений не найдено, возвращаем исходный текст
    if (parts.length === 0) {
      return text;
    }
    
    // Рендерим части с выделением
    return (
      <>
        {parts.map((part, index) => 
          part.highlight ? (
            <mark key={index} className={styles.highlighted_text}>
              {part.text}
            </mark>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </>
    );
  };

  if (readOnly) 
    return null; /*(
      <>
        {label && (
          <label htmlFor={inputId} className={styles.label} data-cy={dataCy ? `${dataCy}-label` : undefined}>
            {label}
          </label>
        )}
        <p
          id={inputId}
          className={styles.field_readonly}
          data-cy={dataCy ? `${dataCy}-field-readonly` : undefined}
        >
          {inputValue || inputProps.placeholder || ""}
        </p>
      </>
    );
  }*/

  return (
    <div className={styles.autocomplete_container}>
      {label && (
        <label htmlFor={inputId} className={styles.label} data-cy={dataCy ? `${dataCy}-label` : undefined}>
          {label}
        </label>
      )}
      <div className={styles.input_wrapper}>
        <input
          ref={inputRef}
          id={inputId}
          className={styles.input}
          data-cy={(dataCy ? dataCy : autoCompleteDataCy) + '_input'}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (suggestions.length > 0) {
              calculateListPosition();
              setShowSuggestions(true);
            }
          }}
          disabled={isLoading}
          autoComplete="off"
          {...inputProps}
        />
        {isLoading && (
          <span className={styles.loading_indicator}>...</span>
        )}
        {/*error && (
          <span className={styles.error_text}>{error}</span>
        )*/}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className={`${styles.suggestions_list} ${openFromTop ? styles.suggestions_list_top : ""}`}
            data-cy={(dataCy ? dataCy : autoCompleteDataCy) + '_suggestions'}
          >
            {suggestions.map((item, index) => {
              const displayText = getDisplayText(item);
              const trimmedInputValue = inputValue.trim();
              return (
                <li
                  key={getValue ? getValue(item) : index}
                  data-cy={(dataCy ? dataCy : autoCompleteDataCy) + '_suggestion-' + index.toString()}
                  className={`${styles.suggestion_item} ${
                    index === selectedIndex ? styles.suggestion_item_selected : ""
                  }`}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {highlightText(displayText, trimmedInputValue)}
                </li>
              );
            })}
          </ul>
        )}
        {showSuggestions && suggestions.length === 0 && inputValue.trim().length >= minChars && !isLoading && (
          <ul className={`${styles.suggestions_list} ${openFromTop ? styles.suggestions_list_top : ""}`}>
            <li className={error ? styles.suggestion_item_error : styles.suggestion_item_empty}>
              {error || "Ничего не найдено"}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
