import React, { useState, useEffect } from 'react';
import {
  useMultiSelect,
  multiSelectDropdown,
  groupedTraversal,
  useAutoHeight
} from '@szhsin/react-autocomplete';
import styles from '@/styles/Home.module.css';
import { LIST_GROUP_PLAIN, KEYED_GROUP_PLAIN, LIST_GROUP, KEYED_GROUP } from '../data';

type Item = { name: string; abbr: string };
const getItemValue = (item: Item) => item.name;
const isItemDisabled = ({ abbr }: Item) => abbr.startsWith('CO');

const getGroupedItems = (value: string = '') =>
  LIST_GROUP.map((group) => ({
    ...group,
    states: group.states.filter((item) =>
      item.name.toLowerCase().startsWith(value.toLowerCase())
    )
  })).filter((group) => !!group.states.length);

export default function Dropdown() {
  const [rovingText, setRovingText] = useState(false);
  const [closeOnSelect, setCloseOnSelect] = useState(false);
  const [value, setValue] = useState<string | undefined>('');
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const groupedItems = getGroupedItems(value);

  const {
    getInputWrapperProps,
    getInputProps,
    getListProps,
    getItemProps,
    getToggleProps,
    getClearProps,
    clearable,
    open,
    focusItem,
    removeSelect
    // inlineComplete
  } = useMultiSelect({
    // traversal: linearTraversal({
    //   items,
    //   traverseInput: true
    // }),
    flipOnSelect: true,
    getItemValue,
    isItemDisabled,
    value,
    onChange: (value) => {
      console.log('onChange', value);
      setValue(value);
      // const item = US_STATES.filter((item) =>
      //   item.name.toLowerCase().startsWith(value.toLowerCase())
      // ).find((item) => !isItemDisabled(item));
      // // setItems(items);
      // const item = getGroupedItems(value)[0]?.states.find((item) => !isItemDisabled(item));
      // item && inlineComplete({ item });
    },
    selected: selectedItems,
    onSelectChange: setSelectedItems,
    // feature: autocomplete({ constricted, rovingText }),
    feature: multiSelectDropdown({ rovingText, closeOnSelect }),
    traversal: groupedTraversal({
      traverseInput: true,
      groupedItems,
      getItemsInGroup: (gp) => gp.states
    })
  });

  const inputProps = getInputProps();

  const [maxHeight, computeHeight] = useAutoHeight({
    anchorRef: inputProps.ref,
    show: open,
    margin: 30
  });

  useEffect(() => {
    computeHeight();
  }, [selectedItems, computeHeight]);

  return (
    <div className={styles.wrapper}>
      <div>Current value: {value}</div>
      <div>Focus item: {focusItem?.name}</div>
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

      <button {...getToggleProps()}>{selectedItems.length} selected</button>
      <div
        {...getListProps()}
        style={{
          position: 'absolute',
          border: '1px solid',
          // display: open && items.length ? 'block' : 'none'
          display: open ? 'block' : 'none'
        }}
      >
        <div style={{ padding: 8 }}>
          <div className={styles.multiInputWrapper + ` ${styles.focused}`}>
            {selectedItems.map((item) => (
              <div className={styles.selectedItem} key={item.abbr}>
                {item.name}
                <span onClick={() => removeSelect(item)}>❎</span>
              </div>
            ))}

            <div className={styles.multiInputContainer}>
              <input className={`${styles.input} ${styles.multiInput}`} {...getInputProps()} />
              {clearable && (
                <button className={styles.clearButton} {...getClearProps()}>
                  ❎
                </button>
              )}
            </div>
          </div>
        </div>

        {/* {items.map((item) => (
          <li
            className={isItemDisabled(item) ? styles.disabled : styles.option}
            key={item.abbr}
            style={{ background: focusItem === item ? '#0a0' : 'none' }}
            {...getItemProps({ item })}
          >
            {item.name}
          </li>
        ))} */}

        <ul style={{ overflow: 'auto', maxHeight }}>
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
                    background: focusItem === item ? '#0a0' : 'none',
                    textDecoration: selectedItems.includes(item) ? 'underline' : 'none'
                  }}
                  {...getItemProps({ item })}
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
