import { useState } from 'react';
import { clsx } from 'clsx';
import { useCombobox, autocomplete } from '@szhsin/react-autocomplete';
import ClearIcon from '@site/static/img/x.svg';
import ChevronDown from '@site/static/img/chevron-down.svg';
import ChevronUp from '@site/static/img/chevron-up.svg';
import STATES from '@site/src/data/states';
import styles from '@site/src/css/styles.module.css';
import customStyles from './styles.module.css';
import { RadioButton } from '../Radio';

type Mode = 'select' | 'free';

const Autocomplete = () => {
  const [mode, setMode] = useState<Mode>('select');
  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const items = value
    ? STATES.filter((item) => item.toLowerCase().startsWith(value.toLowerCase()))
    : STATES;
  const isSelectMode = mode === 'select';

  const {
    getLabelProps,
    getInputProps,
    getClearProps,
    getToggleProps,
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
    feature: autocomplete({ select: isSelectMode }),
    ...(isSelectMode && {
      selected,
      onSelectChange: setSelected
    })
  });

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    setValue(undefined);
    setSelected(undefined);
    inputRef.current.focus();
  };

  return (
    <div className={customStyles.wrap}>
      <div className={customStyles.modes}>
        <RadioButton
          name="mode"
          value="free"
          label="Free mode"
          groupValue={mode}
          onChange={handleModeChange}
        />
        <div className={customStyles.desc}>
          <i>(the default setting)</i> The text entered in the input field is not restricted to
          the items in the dropdown list.
        </div>
        <RadioButton
          name="mode"
          value="select"
          label="Select mode"
          groupValue={mode}
          onChange={handleModeChange}
        />
        <div className={customStyles.desc}>
          The allowed text in the input field is restricted to the items in the dropdown list.
        </div>
      </div>
      <label {...getLabelProps()}>State</label>
      <div className={styles.inputWrap}>
        <input className={styles.input} placeholder="Select or type..." {...getInputProps()} />
        {!isInputEmpty && (
          <button className={styles.clear} {...getClearProps()}>
            <ClearIcon />
          </button>
        )}
        <button className={styles.toggle} {...getToggleProps()}>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      <ul
        className={styles.list}
        {...getListProps()}
        style={{
          display: open ? 'block' : 'none',
          position: 'absolute',
          overflow: 'auto',
          maxHeight: 300,
          zIndex: 1
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

export { Autocomplete };
