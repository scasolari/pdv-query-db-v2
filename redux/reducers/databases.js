const initialState = []

const databases = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATABASES':
            return {
                ...state,
                databases: action.payload, // Ensure this is a string
            };
        // other cases
        default:
            return state;
    }
}

export default databases;
