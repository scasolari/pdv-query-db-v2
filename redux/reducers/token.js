const initialState = {
    profile: '',
};

const profile = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...state,
                profile: action.payload, // Ensure this is a string
            };
        // other cases
        default:
            return state;
    }
}

export default profile;
