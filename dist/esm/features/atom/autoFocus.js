const autoFocus = ({
  onRequestItem
}) => ({
  setFocusIndex
}) => ({
  getInputProps: () => ({
    onChange: e => {
      const value = e.target.value;
      if (value) {
        onRequestItem({
          value
        }, data => setFocusIndex(data.index));
      }
    }
  })
});

export { autoFocus };
