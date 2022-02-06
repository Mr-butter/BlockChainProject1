import { GET_BLOCK } from "../actions";

const initialState = {
    Blocks: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BLOCK:
            return {
                ...initialState,
                Blocks: action.payload,
            };
        default:
            return state;
    }
}
