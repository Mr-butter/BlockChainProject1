const setColor = (color) => {
    return {
        type: "SET_COLOR",
        payload: color,
    };
};

const exportDefault = {
    setColor,
};

export default exportDefault;
