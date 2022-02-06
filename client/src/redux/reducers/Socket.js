import { SOCKET_MESSAGE } from "../actions";

const initialState = {
    Message: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SOCKET_MESSAGE:
            return {
                ...initialState,
                Message: action.payload,
            };
        default:
            return state;
    }
}
