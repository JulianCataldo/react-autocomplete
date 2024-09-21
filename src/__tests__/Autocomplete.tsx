import { useState } from 'react';
import { type ComboboxProps, useCombobox, autocomplete } from '..';
import type { AutocompleteFeatureProps } from '../types';
import { US_STATES } from './data';

type Item = { name: string; abbr: string };
const getItemValue = (item: Item) => item.name;

export default function Autocomplete(
  props: Partial<ComboboxProps<Item>> & AutocompleteFeatureProps<Item>
) {
  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState<Item>();
  const items = value
    ? US_STATES.filter((item) => item.name.toLowerCase().startsWith(value.toLowerCase()))
    : US_STATES;

  const {
    getLabelProps,
    getInputProps,
    getToggleProps,
    getClearProps,
    getListProps,
    getItemProps,
    open,
    focusIndex,
    isInputEmpty,
    isItemSelected
  } = useCombobox({
    ...props,
    getItemValue,
    items,
    value,
    onChange: setValue,
    selected,
    onSelectChange: setSelected,
    feature: autocomplete(props)
  });

  const displayList = !!(open && items.length);

  return (
    <div>
      <div>
        value: <span data-testid="value">{value}</span>
      </div>
      <div>
        selected: <span data-testid="selected">{selected?.name}</span>
      </div>

      <div>
        <label {...getLabelProps()}>State</label>
      </div>
      <input {...getInputProps()} />
      {!isInputEmpty && <button {...getClearProps()}>Clear</button>}
      <button {...getToggleProps()}>{open ? 'Close' : 'Open'}</button>

      <ul
        {...getListProps()}
        style={{
          display: displayList ? 'block' : 'none',
          position: 'absolute',
          overflow: 'auto',
          maxHeight: 300
        }}
      >
        <li data-testid="header">header</li>
        {items.map((item, index) => (
          <li
            key={item.abbr}
            style={{
              color: props.isItemDisabled?.(item) ? 'gray' : 'white',
              backgroundColor: focusIndex === index ? 'red' : 'transparent',
              textDecoration: isItemSelected(item) ? 'underline' : 'none'
            }}
            {...getItemProps({ item, index })}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
