const initialState = []

const organization = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ORGANIZATION':
            return {
                ...state,
                organization: action.payload, // Ensure this is a string
            };
        // other cases
        default:
            return state;
    }
}

export default organization;
