import { Button, Divider, Form, Header, Input, Segment } from "semantic-ui-react"
import axios from "axios"
import initialState from "states/auth"
import PropTypes from "prop-types"
import React, { useCallback, useState } from "react"
import reducer from "reducers/auth"
import useLogReducer from "reducer-logger"

const Authentication = (props) => {
    const [internalState, dispatch] = useLogReducer(reducer, initialState)

    const [buttonText, setButtonText] = useState(props.login ? "Create an account" : "Sign in")
    const [email, setEmail] = useState("")
    const [headerText, setHeaderText] = useState(props.login ? "Sign In" : "Sign Up")
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingRegistration, setLoadingRegistration] = useState(false)
    const [login, setLogin] = useState(props.login)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [registerText, setRegisterText] = useState(
        props.login ? "New to this app?" : "Already have an account?"
    )
    const [regPassword, setRegPassword] = useState("")
    const [username, setUsername] = useState("")

    const toggleLogin = useCallback(() => {
        const buttonText = login ? "Sign in" : "Create an account"
        const headerText = login ? "Join" : "Sign In"
        const registerText = login ? "Already have an account?" : "New to this app?"
        setButtonText(buttonText)
        setHeaderText(headerText)
        setRegisterText(registerText)
        setLoadingLogin(false)
        setLoadingRegistration(false)
        setLogin(!login)
    }, [login])

    const submitLoginForm = () => {
        if (email.length > 0 && password.length > 0) {
            setLoadingLogin(true)
            axios
                .post("/api/user/login", {
                    email,
                    password
                })
                .then(async (response) => {
                    const { data } = response
                    dispatch({
                        payload: data,
                        type: "SET_USER_DATA"
                    })

                    await setToken(data.user)
                    Router.push("/")
                })
                .catch((error) => {
                    toast.error(error.response.data.msg)

                    dispatch({
                        payload: error.response.data,
                        type: "SET_LOGIN_ERROR"
                    })
                })
        }
    }

    const submitRegistrationForm = () => {
        setLoadingRegistration(true)
        axios
            .post("/api/user/create", {
                email,
                name,
                password,
                status,
                username
            })
            .then(async (response) => {
                const { data } = response
                dispatch({
                    payload: data,
                    type: "SET_USER_DATA"
                })

                await setToken(data.user)
            })
            .catch((error) => {
                toast.error(error.response.data.msg)

                dispatch({
                    payload: error.response.data,
                    type: "SET_REGISTER_ERROR"
                })
            })
    }

    const MainForm = () => {
        if (login) {
            return (
                <Form inverted={props.inverted} size="big">
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setEmail(value)
                            }}
                            placeholder="Email or username"
                            value={email}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setPassword(value)
                            }}
                            placeholder="Password"
                            type="password"
                            value={password}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Button
                            color="yellow"
                            content="Sign in"
                            fluid
                            loading={loadingLogin && !props.loginError}
                            onClick={submitLoginForm}
                            size="big"
                            type="submit"
                        />
                    </Form.Field>
                </Form>
            )
        }

        return (
            <>
                <Form inverted={props.inverted} size="big">
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setRegEmail(value)
                            }}
                            placeholder="Email"
                            value={regEmail}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setRegPassword(value)
                            }}
                            value={regPassword}
                            placeholder="Password"
                            type="password"
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            autoComplete="off"
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setName(value)
                            }}
                            placeholder="Full name"
                            value={name}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            inverted={props.inverted}
                            onChange={(e, { value }) => {
                                setUsername(value)
                            }}
                            placeholder="Username"
                            value={username}
                        />
                    </Form.Field>
                </Form>
                <Divider inverted={props.inverted} />
                <Button
                    color="yellow"
                    content="Create an account"
                    fluid
                    loading={loadingRegistration && !props.registerError}
                    onClick={submitRegistrationForm}
                    size="big"
                />
            </>
        )
    }

    return (
        <div className="authComponent">
            <Header as="h1" inverted={props.inverted} size="huge">
                {headerText}
            </Header>
            <Segment basic className="authSegment" inverted>
                {MainForm()}
            </Segment>
            <Header as="p" className="registerText" inverted={props.inverted}>
                {registerText}{" "}
                <span className="registerLink" onClick={() => toggleLogin()}>
                    {buttonText}
                </span>
            </Header>
        </div>
    )
}

Authentication.propTypes = {
    bearer: PropTypes.string,
    inverted: PropTypes.bool,
    login: PropTypes.bool,
    loginError: PropTypes.bool,
    loginErrorMsg: PropTypes.string,
    registerError: PropTypes.bool,
    registerErrorMsg: PropTypes.string
}

Authentication.defaultProps = {
    inverted: true,
    login: false
}

export default Authentication
