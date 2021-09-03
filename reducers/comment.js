const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
        case "GET_USER":
            return {
                ...state,
                error: false,
                loading: false,
                user: payload.user
            }
        case "SET_USER_ERROR":
            return {
                ...state,
                error: true,
                errorMsg: action.payload,
                loading: false
            }
        default:
            throw new Error()
    }
}

export default reducer
