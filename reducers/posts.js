const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
        case "GET_POSTS":
            const posts =
                payload.page > 1 ? [...state.results, ...payload.results] : payload.results
            return {
                ...state,
                error: false,
                errorMsg: "",
                results: posts
            }
        case "SET_POSTS_ERROR":
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
