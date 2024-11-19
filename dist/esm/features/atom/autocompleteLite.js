import { buttonProps, defaultFocusIndex, getId } from '../../common.js';
import { useFocusCapture } from '../../hooks/useFocusCapture.js';

const scrollIntoView = element => element?.scrollIntoView({
  block: 'nearest'
});
const autocompleteLite = ({
  select,
  rovingText = !select,
  deselectOnClear = true,
  deselectOnChange = true,
  closeOnSelect = true
} = {}) => ({
  getItemValue,
  getSelectedValue,
  onSelectChange,
  isItemSelected,
  isItemDisabled,
  isItemAction,
  onAction,
  value,
  onChange,
  tmpValue,
  setTmpValue,
  focusIndex,
  setFocusIndex,
  open,
  setOpen,
  inputRef,
  items,
  id
}) => {
  var _ref;
  const [startCapture, inCapture, stopCapture] = useFocusCapture(inputRef);
  const inputValue = (_ref = tmpValue || value) != null ? _ref : getSelectedValue();
  const focusItem = items[focusIndex];
  const listId = getId(id, 'l');
  const selectItemOrAction = item => {
    if (isItemAction?.(item)) {
      onAction?.(item);
      return true;
    }
    const itemValue = getItemValue(item);
    if (!select) onChange(itemValue);
    const endIndex = itemValue.length;
    inputRef.current?.setSelectionRange(endIndex, endIndex);
    onSelectChange(item);
  };
  const resetState = shouldClose => {
    setFocusIndex(defaultFocusIndex);
    setTmpValue();
    if (shouldClose || closeOnSelect) {
      setOpen(false);
      if (select) onChange();
    }
  };
  const traverse = isForward => {
    const baseIndex = rovingText ? -1 : 0;
    let newItem,
      newIndex = focusIndex,
      itemCounter = 0;
    const itemLength = items.length;
    for (;;) {
      if (isForward) {
        if (++newIndex >= itemLength) newIndex = baseIndex;
      } else {
        if (--newIndex < baseIndex) newIndex = itemLength - 1;
      }
      newItem = items[newIndex];
      if (!newItem || !isItemDisabled?.(newItem)) break;
      if (++itemCounter >= itemLength) return;
    }
    setFocusIndex(newIndex);
    if (rovingText) setTmpValue(getItemValue(newItem));
  };
  const focusCaptureProps = {
    onMouseDown: startCapture,
    onMouseUp: stopCapture
  };
  return {
    isInputEmpty: !inputValue,
    getFocusCaptureProps: () => focusCaptureProps,
    getClearProps: () => ({
      ...buttonProps,
      ...focusCaptureProps,
      onClick: () => {
        setTmpValue();
        setFocusIndex(defaultFocusIndex);
        onChange('');
        if (deselectOnClear) onSelectChange();
      }
    }),
    getListProps: () => ({
      ...focusCaptureProps,
      id: listId,
      role: 'listbox'
    }),
    getItemProps: ({
      item,
      index
    }) => ({
      id: getId(id, index),
      role: 'option',
      'aria-selected': select ? isItemSelected(item) : index === focusIndex,
      ref: index === focusIndex ? scrollIntoView : undefined,
      onClick: () => !isItemDisabled?.(item) && resetState(selectItemOrAction(item)),
      onPointerMove: () => !isItemDisabled?.(item) && setFocusIndex(index)
    }),
    getInputProps: () => ({
      type: 'text',
      role: 'combobox',
      autoComplete: 'off',
      'aria-autocomplete': 'list',
      'aria-expanded': open,
      'aria-controls': listId,
      'aria-activedescendant': focusIndex >= 0 ? getId(id, focusIndex) : undefined,
      ref: inputRef,
      value: inputValue,
      onChange: e => {
        setOpen(true);
        setFocusIndex(defaultFocusIndex);
        setTmpValue();
        const newValue = e.target.value;
        onChange(newValue);
        if (!select && deselectOnChange || deselectOnClear && !newValue) {
          onSelectChange();
        }
      },
      onBlur: () => {
        if (inCapture()) return;
        if (!select) onChange(inputValue);
        resetState(true);
      },
      onKeyDown: e => {
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowDown':
            e.preventDefault();
            if (open) {
              traverse(e.key != 'ArrowUp');
            } else {
              setOpen(true);
            }
            break;
          case 'Enter':
            if (open) {
              if (focusItem) {
                e.preventDefault();
                resetState(selectItemOrAction(focusItem));
              } else if (!select) {
                resetState(true);
              }
            }
            break;
          case 'Escape':
            if (open) {
              resetState(true);
            } else {
              onChange('');
              if (deselectOnClear) onSelectChange();
            }
            break;
        }
      },
      onMouseDown: e => e.stopPropagation(),
      onClick: () => setOpen(true)
    })
  };
};

export { autocompleteLite };
