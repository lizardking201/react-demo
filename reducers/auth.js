const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
        case "LOGOUT":
            return initial

        case "SET_LOGIN_ERROR":
            return {
                ...state,
                loginError: true,
                loginErrorMsg: payload.msg
            }

        case "SET_REGISTER_ERROR":
            return {
                ...state,
                registerError: true,
                registerErrorMsg: payload.msg
            }

        case "SET_USER_DATA":
            const user = {
                // bio: payload.user.bio,
                createdAt: payload.user.createdAt,
                email: payload.user.email,
                emailVerified: payload.user.emailVerified,
                name: payload.user.name,
                id: payload.user.id,
                img: payload.user.img,
                username: payload.user.username
            }

            return {
                ...state,
                authenticated: true,
                bearer: payload.token,
                data: user,
                loginError: false,
                loginErrorMsg: "",
                registerError: false,
                registerErrorMsg: ""
            }

        default:
            return state
    }
}

export default reducer
