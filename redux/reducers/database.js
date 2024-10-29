const initialState = []

const database = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATABASE':
            return {
                ...state,
                database: action.payload, // Ensure this is a string
            };
        // other cases
        default:
            return state;
    }
}

export default database;
