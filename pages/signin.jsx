import { Container } from "semantic-ui-react"
import { parseJwt } from "utils/tokenFunctions"
import { useRouter } from "next/router"
import Authentication from "components/authentication"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import Router from "next/router"

const SignIn = ({ inverted }) => {
    const router = useRouter()
    const { type } = router.query

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const userData = parseJwt()
        if (userData ? userData.emailVerified : false) {
            Router.push("/")
        }

        setLoaded(true)
    }, [loaded])

    return (
        <DefaultLayout
            basicHeader
            containerClassName="signInPage"
            textAlign="center"
            useGrid={false}
        >
            <Container style={{ marginTop: 18 }}>
                {loaded && <Authentication inverted={inverted} login={type !== "join"} />}
            </Container>
        </DefaultLayout>
    )
}

SignIn.propTypes = {
    inverted: PropTypes.bool
}

export default SignIn
