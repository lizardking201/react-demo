const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
        case "GET_COMMENTS":
            const comments =
                payload.page > 1 ? [...state.results, ...payload.results] : payload.results
            console.log("comments", comments)
            return {
                ...state,
                error: false,
                errorMsg: "",
                results: comments
            }
        case "SET_COMMENTS_ERROR":
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
