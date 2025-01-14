import React, { useState } from 'react';
import { useCombobox, dropdown, mergeGroupedItems } from '@szhsin/react-autocomplete';
import styles from '@/styles/Home.module.css';
import { LIST_GROUP } from '../data';

type Item = { name: string; abbr: string };
const getItemValue = (item: Item) => item.name;
const isItemDisabled = ({ abbr }: Item) => abbr.startsWith('CO');

const filterGroupedItems = (value: string = '') =>
  LIST_GROUP.map((group) => ({
    ...group,
    states: group.states.filter((item) =>
      item.name.toLowerCase().startsWith(value.toLowerCase())
    )
  })).filter((group) => !!group.states.length);

export default function Dropdown() {
  const [rovingText, setRovingText] = useState(false);
  const [closeOnSelect, setCloseOnSelect] = useState(true);
  const [value, setValue] = useState<string | undefined>('');
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();

  const groupedItems = filterGroupedItems(value);

  const {
    getInputProps,
    getListProps,
    getItemProps,
    getToggleProps,
    getClearProps,
    isInputEmpty,
    open,
    focusIndex
  } = useCombobox({
    flipOnSelect: true,
    getItemValue,
    isItemDisabled,
    value,
    onChange: (value) => {
      console.log('onChange', value);
      setValue(value);
    },
    selected: selectedItem,
    onSelectChange: setSelectedItem,
    feature: dropdown({ rovingText, closeOnSelect }),
    items: mergeGroupedItems({
      groups: groupedItems,
      getItemsInGroup: (group) => group.states
    })
  });

  let itemIndex = 0;

  return (
    <div className={styles.wrapper}>
      <div>Current value: {value}</div>
      <div>Selected item: {selectedItem?.name}</div>
      <div>focusIndex: {focusIndex}</div>
      <input placeholder="test" />

      <div>
        <label>
          rovingText
          <input
            type="checkbox"
            checked={rovingText}
            onChange={(e) => setRovingText(e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          closeOnSelect
          <input
            type="checkbox"
            checked={closeOnSelect}
            onChange={(e) => setCloseOnSelect(e.target.checked)}
          />
        </label>
      </div>

      <button {...getToggleProps()}>{selectedItem?.name || 'Select'}</button>
      <div
        {...getListProps()}
        style={{
          position: 'absolute',
          border: '1px solid',
          display: open ? 'block' : 'none'
        }}
      >
        <div style={{ padding: 20 }}>
          <input
            className={styles.input}
            {...getInputProps()}
            placeholder="Search a state..."
          />
          {!isInputEmpty && (
            <button
              className={styles.clearButton}
              style={{ position: 'absolute', transform: 'translate(-120%, 10%)' }}
              {...getClearProps()}
            >
              ❎
            </button>
          )}
        </div>

        <ul style={{ overflow: 'auto', maxHeight: 500 }}>
          <li>
            <h3>US STATES</h3>
          </li>
          {groupedItems.map(({ groupKey: key, states: group }) => (
            <React.Fragment key={key}>
              <li>
                <h4 style={{ color: 'lightskyblue', margin: '10px 0' }}>{key}</h4>
              </li>
              {group.map((item) => (
                <li
                  className={isItemDisabled(item) ? styles.disabled : styles.option}
                  key={item.abbr}
                  style={{
                    background: focusIndex === itemIndex ? '#0a0' : 'none',
                    textDecoration: selectedItem === item ? 'underline' : 'none'
                  }}
                  {...getItemProps({ item, index: itemIndex++ })}
                >
                  {item.name}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <button>next</button>
    </div>
  );
}
