const initialState = {
    error: false,
    errorMsg: "",
    inverted: true,
    loading: true,
    user: {
        data: {},
        posts: {
            error: false,
            errorMsg: "",
            hasMore: false,
            loading: true,
            page: 1,
            results: [{}, {}, {}]
        }
    }
}

export default initialState
