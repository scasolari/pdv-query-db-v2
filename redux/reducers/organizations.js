const initialState = []

const organizations = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ORGANIZATIONS':
            return {
                ...state,
                organizations: action.payload, // Ensure this is a string
            };
        // other cases
        default:
            return state;
    }
}

export default organizations;
