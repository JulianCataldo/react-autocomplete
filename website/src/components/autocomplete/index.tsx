import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useCombobox, autocompleteLite } from '@szhsin/react-autocomplete';
import ClearIcon from '@site/static/img/x.svg';
import { RadioButton } from '../Radio';
import styles from './styles.module.css';

const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Pineapple', 'Strawberry'];

type Mode = 'select' | 'free';

const Autocomplete = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const [mode, setMode] = useState<Mode>('select');
  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const items = value
    ? FRUITS.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
    : FRUITS;
  const isSelectMode = mode === 'select';

  const {
    getInputProps,
    getClearProps,
    getListProps,
    getItemProps,
    open,
    focusIndex,
    isInputEmpty,
    inputRef
  } = useCombobox({
    items,
    value,
    onChange: setValue,
    feature: autocompleteLite({ select: isSelectMode }),
    ...(isSelectMode && {
      selected,
      onSelectChange: setSelected
    })
  });

  useEffect(() => {
    if (open) {
      if (listRef.current.getBoundingClientRect().bottom > window.innerHeight) {
        listRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    }
  }, [open, items.length]);

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    setValue(undefined);
    setSelected(undefined);
    inputRef.current.focus();
  };

  return (
    <div>
      <div className={styles.modes}>
        <RadioButton
          name="mode"
          value="select"
          label="Select mode"
          groupValue={mode}
          onChange={handleModeChange}
        />
        <RadioButton
          name="mode"
          value="free"
          label="Free mode"
          groupValue={mode}
          onChange={handleModeChange}
        />
      </div>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          placeholder={isSelectMode ? 'Pick a fruit...' : 'Type to search...'}
          {...getInputProps()}
        />
        {!isInputEmpty && (
          <button className={styles.clear} {...getClearProps()}>
            <ClearIcon />
          </button>
        )}
      </div>

      <ul
        ref={listRef}
        className={styles.list}
        {...getListProps()}
        style={{
          display: open ? 'block' : 'none',
          position: 'absolute'
        }}
      >
        {items.length ? (
          items.map((item, index) => (
            <li
              className={clsx(
                styles.item,
                focusIndex === index && styles.focused,
                selected === item && styles.selected
              )}
              key={item}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))
        ) : (
          <li className={styles.noResult}>No results</li>
        )}
      </ul>
    </div>
  );
};

export default Autocomplete;
