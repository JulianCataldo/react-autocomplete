const autocomplete = ({
  rovingText,
  traverseInput
} = {}) => ({
  _: cxInstance,
  items,
  getItemValue,
  onChange,
  setInputValue,
  focusIndex,
  setFocusIndex,
  open,
  setOpen,
  inputRef
}) => {
  const updateValue = (value, type) => {
    cxInstance.b = value;
    setInputValue(value);
    onChange(value, {
      type
    });
  };
  const updateAndCloseList = (value, type) => {
    if (open) {
      if (value != null) {
        updateValue(value, type);
      }
      setOpen(false);
      setFocusIndex(-1);
    }
  };
  const traverseItems = isUp => {
    const baseIndex = (traverseInput != null ? traverseInput : rovingText) ? -1 : 0;
    let nextIndex = focusIndex;
    const itemLength = items.length;
    if (isUp) {
      if (--nextIndex < baseIndex) nextIndex = itemLength - 1;
    } else {
      if (++nextIndex >= itemLength) nextIndex = baseIndex;
    }
    setFocusIndex(nextIndex);
    if (rovingText) {
      var _getItemValue;
      setInputValue((_getItemValue = getItemValue(items[nextIndex])) != null ? _getItemValue : cxInstance.b);
      const input = inputRef.current;
      cxInstance.c = [input.selectionStart, input.selectionEnd];
    }
  };
  const getInputProps = () => ({
    onChange: e => {
      setFocusIndex(-1);
      setOpen(true);
      updateValue(e.target.value, 'input');
    },
    onSelect: e => {
      const {
        value,
        selectionStart,
        selectionEnd
      } = e.target;
      const [start, end] = cxInstance.c;
      if (cxInstance.b !== value && (selectionStart !== start || selectionEnd !== end)) {
        setFocusIndex(-1);
        updateValue(value, 'input');
      }
    },
    onClick: () => setOpen(true),
    onBlur: () => updateAndCloseList(getItemValue(items[focusIndex]), 'blur'),
    onKeyDown: ({
      key
    }) => {
      switch (key) {
        case 'ArrowUp':
          if (open) {
            traverseItems(true);
          } else {
            setOpen(true);
          }
          break;
        case 'ArrowDown':
          if (open) {
            traverseItems(false);
          } else {
            setOpen(true);
          }
          break;
        case 'Enter':
          updateAndCloseList(getItemValue(items[focusIndex]), 'submit');
          break;
        case 'Escape':
          updateAndCloseList(cxInstance.b, 'esc');
          break;
      }
    }
  });
  const getItemProps = option => ({
    onClick: () => updateAndCloseList(getItemValue(items[option == null ? void 0 : option.index]), 'submit')
  });
  return {
    getInputProps,
    getItemProps
  };
};

export { autocomplete };