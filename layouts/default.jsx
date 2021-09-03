import { Container, Grid, Icon, Label, Menu } from "semantic-ui-react"
import { useRouter } from "next/router"
import Head from "next/head"
import Header from "@components/header"
import PropTypes from "prop-types"
import React from "react"

const DefaultLayout = ({
    activeItem = "posts",
    basicHeader = false,
    children,
    containerClassName = "",
    inverted = true,
    loading,
    textAlign = "left",
    useGrid = true
}) => {
    const router = useRouter()

    return (
        <div className={`body ${inverted ? "inverted" : ""}`}>
            <Head>
                <title>React App</title>
            </Head>

            <Header basicHeader={basicHeader} inverted={inverted} loading={loading} />
            <Container
                className={`mainContainer ${containerClassName} ${inverted ? "inverted" : ""}`}
                textAlign={textAlign}
            >
                {useGrid ? (
                    <Grid className="mainGrid" stackable>
                        <Grid.Column className="leftColumn" width={4}>
                            <Menu borderless fluid inverted={inverted} size="massive" vertical>
                                <Menu.Item
                                    active={activeItem === "users"}
                                    name="users"
                                    onClick={() => router.push("/users")}
                                >
                                    <Icon name="user" />
                                    Users
                                </Menu.Item>
                                <Menu.Item
                                    active={activeItem === "posts"}
                                    name="posts"
                                    onClick={() => router.push("/posts")}
                                >
                                    <Icon name="mail" />
                                    Posts
                                </Menu.Item>
                                <Menu.Item
                                    active={activeItem === "comments"}
                                    name="comments"
                                    onClick={() => router.push("/comments")}
                                >
                                    <Icon name="comment" />
                                    Comments
                                </Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column className="rightColumn" width={12}>
                            {children}
                        </Grid.Column>
                    </Grid>
                ) : (
                    <>{children}</>
                )}
            </Container>
        </div>
    )
}

DefaultLayout.propTypes = {
    activeItem: PropTypes.string,
    basicHeader: PropTypes.bool,
    children: PropTypes.node,
    containerClassName: PropTypes.string,
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    textAlign: PropTypes.string,
    useGrid: PropTypes.bool
}

export default DefaultLayout
