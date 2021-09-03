const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
        case "GET_USERS":
            const users =
                payload.page > 1 ? [...state.results, ...payload.results] : payload.results
            return {
                ...state,
                error: false,
                errorMsg: "",
                results: users
            }
        case "SET_USERS_ERROR":
            return {
                ...state,
                error: true,
                errorMsg: action.payload,
                results: [{}, {}, {}]
            }
        default:
            throw new Error()
    }
}

export default reducer
