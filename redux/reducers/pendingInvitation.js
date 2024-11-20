const initialState = []

const pendingInvitation = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PENDING_INVITATION':
            return {
                ...state,
                pending_invitation: action.payload, // Ensure this is a string
            };
        // other cases
        default:
            return state;
    }
}

export default pendingInvitation;
