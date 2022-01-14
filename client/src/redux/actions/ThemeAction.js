const setMode = (mode) => {
  return {
    type: "SET_MODE",
    payload: mode,
  };
};

const setColor = (color) => {
  return {
    type: "SET_COLOR",
    payload: color,
  };
};

const exportDefault = {
  setColor,
  setMode,
};

export default exportDefault;
