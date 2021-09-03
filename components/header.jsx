import { Button, Container, Grid, Icon, Image, Menu } from "semantic-ui-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { parseJwt } from "utils/tokenFunctions"
import PropTypes from "prop-types"
import React from "react"

const PageHeader = ({ basicHeader }) => {
    const router = useRouter()

    const [authenticated, setAuthenticated] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        const userData = parseJwt()
        console.log("user data", userData)
        if (userData) {
            setUser(userData)
            setAuthenticated(true)
        } else {
            setAuthenticated(false)
        }
    }, [])

    return (
        <div className="pageHeader">
            <div className="topHeader">
                <Container className={`desktop ${basicHeader ? "basic" : ""}`}>
                    {basicHeader ? (
                        <Image
                            alt="logo"
                            className="logo"
                            onClick={() => router.push("/")}
                            rounded
                            src="/images/logos/cat.svg"
                        />
                    ) : (
                        <Grid stackable>
                            <Grid.Column className="logoColumn" width={4}>
                                <Image
                                    alt="logo"
                                    className="logo"
                                    onClick={() => router.push("/")}
                                    rounded
                                    src="/images/logos/cat.svg"
                                />
                            </Grid.Column>
                            <Grid.Column className="inputColumn" width={12}>
                                {authenticated === false && (
                                    <>
                                        <Button
                                            className="joinButton"
                                            color="green"
                                            content="Register"
                                            onClick={() => router.push("/signin?type=join")}
                                            size="big"
                                            style={{ float: "right", marginTop: 4 }}
                                        />
                                        <Button
                                            color="blue"
                                            content="Sign In"
                                            onClick={() => router.push("/signin")}
                                            size="big"
                                            style={{ float: "right", marginTop: 4 }}
                                        />
                                    </>
                                )}
                            </Grid.Column>
                        </Grid>
                    )}
                </Container>
                <Container className={`mobile ${basicHeader ? "basic" : ""}`}>
                    {basicHeader ? (
                        <Image
                            alt="logo"
                            className="logo"
                            onClick={() => router.push("/")}
                            rounded
                            src="/images/logos/cat.svg"
                        />
                    ) : (
                        <Menu borderless fitted="vertically" fixed="top" fluid inverted>
                            <Container>
                                <Menu.Item position="left">
                                    <Image
                                        alt="logo"
                                        className="logo"
                                        onClick={() => router.push("/")}
                                        rounded
                                        src="images/logos/cat.svg"
                                    />
                                </Menu.Item>
                                <Menu.Item position="right">
                                    {authenticated === false && (
                                        <>
                                            <Button
                                                className="joinButton"
                                                color="green"
                                                content="Register"
                                                onClick={() => router.push("/signin?type=join")}
                                                style={{ float: "right", marginTop: 4 }}
                                            />
                                            <Button
                                                color="blue"
                                                content="Sign In"
                                                onClick={() => router.push("/signin")}
                                                style={{ float: "right", marginTop: 4 }}
                                            />
                                        </>
                                    )}
                                    <Icon
                                        color={sidebarVisible ? "yellow" : null}
                                        inverted
                                        name="ellipsis horizontal"
                                        onClick={() => setSidebarVisible(!sidebarVisible)}
                                        size="big"
                                    />
                                </Menu.Item>
                            </Container>
                        </Menu>
                    )}
                </Container>
            </div>
        </div>
    )
}

PageHeader.propTypes = {
    basicHeader: PropTypes.bool,
    loading: PropTypes.bool,
    toggleSearchMode: PropTypes.func
}

export default PageHeader
