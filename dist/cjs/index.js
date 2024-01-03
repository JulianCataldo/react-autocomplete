'use strict';

var react = require('react');

const useAutocomplete = ({
  feature: {
    onInputChange,
    onInputClick,
    onBlur,
    onKeyDown,
    onItemClick
  } = {},
  items = [],
  onChange = () => {}
}) => {
  const inputRef = react.useRef();
  const [inputValue, setInputValueBase] = react.useState('');
  const [isOpen, setOpenBase] = react.useState(false);
  const [focusIndex, setfocusIndex] = react.useState(-1);
  const [instance] = react.useState({});
  const state = {
    inputValue: [inputValue, setInputValueBase],
    focusIndex: [focusIndex, setfocusIndex],
    isOpen: [isOpen, setOpenBase]
  };
  const featureEvent = {
    state,
    props: {
      items,
      onChange
    }
  };
  const getInputProps = () => ({
    value: inputValue,
    ref: inputRef,
    onChange: e => onInputChange == null ? void 0 : onInputChange({
      value: e.target.value,
      ...featureEvent
    }),
    onClick: () => onInputClick == null ? void 0 : onInputClick(featureEvent),
    onBlur: () => !instance.a && (onBlur == null ? void 0 : onBlur(featureEvent)),
    onKeyDown: ({
      key
    }) => onKeyDown == null ? void 0 : onKeyDown({
      key,
      ...featureEvent
    })
  });
  const getItemProps = ({
    index = -1
  } = {}) => ({
    onMouseDown: () => instance.a = 1,
    onClick: () => {
      var _inputRef$current;
      onItemClick == null || onItemClick({
        index,
        ...featureEvent
      });
      (_inputRef$current = inputRef.current) == null || _inputRef$current.focus();
      instance.a = 0;
    }
  });
  const getProps = (elementType, option) => {
    switch (elementType) {
      case 'input':
        return getInputProps();
      default:
        return getItemProps(option);
    }
  };
  return {
    getProps,
    state
  };
};

const autocomplete = () => {
  const updateAndCloseList = ({
    props: {
      onChange
    },
    state: {
      inputValue: [, setInputValue],
      focusIndex: [, setfocusIndex],
      isOpen: [isOpen, setOpen]
    }
  }, value) => {
    if (isOpen) {
      if (value != null) {
        setInputValue(value);
        onChange(value);
      }
      setOpen(false);
      setfocusIndex(-1);
    }
  };
  return {
    onItemClick: ({
      index,
      ...event
    }) => updateAndCloseList(event, event.props.items[index]),
    onInputChange: ({
      value,
      props: {
        onChange
      },
      state: {
        inputValue: [, setInputValue],
        focusIndex: [, setfocusIndex],
        isOpen: [, setOpen]
      }
    }) => {
      setInputValue(value);
      setfocusIndex(-1);
      setOpen(true);
      onChange(value);
    },
    onInputClick: ({
      state: {
        isOpen: [, setOpen]
      }
    }) => setOpen(true),
    onBlur: event => updateAndCloseList(event, event.state.inputValue[0]),
    onKeyDown: ({
      key,
      ...event
    }) => {
      const {
        props: {
          items
        },
        state: {
          focusIndex: [focusIndex, setfocusIndex],
          inputValue: [inputValue, setInputValue],
          isOpen: [isOpen, setOpen]
        }
      } = event;
      const traverseItems = itemIndex => {
        setfocusIndex(itemIndex);
        setInputValue(items[itemIndex]);
      };
      let nextIndex = focusIndex;
      const itemLength = items.length;
      switch (key) {
        case 'ArrowDown':
          if (isOpen) {
            if (++nextIndex >= itemLength) nextIndex = 0;
            traverseItems(nextIndex);
          } else {
            setOpen(true);
          }
          break;
        case 'ArrowUp':
          if (isOpen) {
            if (--nextIndex < 0) nextIndex = itemLength - 1;
            traverseItems(nextIndex);
          } else {
            setOpen(true);
          }
          break;
        case 'Enter':
          updateAndCloseList(event, items[focusIndex]);
          break;
        case 'Escape':
          updateAndCloseList(event, inputValue);
          break;
      }
    }
  };
};

exports.autocomplete = autocomplete;
exports.useAutocomplete = useAutocomplete;
