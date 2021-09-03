import { Button, Container, Dimmer, Grid, Header, Image, List, Loader } from "semantic-ui-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getConfig } from "options/toast"
import { useRouter } from "next/router"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/user"
import Link from "next/link"
import PropTypes from "prop-types"
import React from "react"
import reducer from "reducers/user"
import useLogReducer from "reducer-logger"

const toastConfig = getConfig()
toast.configure(toastConfig)

const defaultImg = "/images/avatar/large/molly.png"

const User = () => {
    const router = useRouter()
    const { slug } = router.query

    const [internalState, dispatch] = useLogReducer(reducer, initialState)
    const { error, errorMsg, inverted, loading, user } = internalState

    useEffect(() => {
        const getInitialProps = async () => {
            if (typeof slug !== "undefined") {
                await getUser(slug)
            }
        }

        getInitialProps()
    }, [slug])

    const getUser = async (id) => {
        axios
            .get(`/api/user/${id}`)
            .then((response) => {
                const { data } = response
                dispatch({
                    type: "GET_USER",
                    payload: data
                })
            })
            .catch((error) => {
                toast.error(error.response.data.msg)
                dispatch({
                    type: "SET_USER_ERROR",
                    payload: error.response.data.msg
                })
            })
    }

    return (
        <DefaultLayout activeItem="users" containerClassName="usersPage" showFooter={false}>
            <Container>
                {loading ? (
                    <Container textAlign="center">
                        <Dimmer active className="pageDimmer">
                            <Loader active size="huge" />
                        </Dimmer>
                    </Container>
                ) : (
                    <>
                        {error ? (
                            <Container className="errorMsgContainer" textAlign="center">
                                <Header as="h1" inverted={inverted}>
                                    {errorMsg}
                                    <div />
                                    <Button
                                        color="green"
                                        content="Search all users"
                                        icon="search"
                                        // inverted={inverted}
                                        onClick={() => router.push(`/users`)}
                                    />
                                </Header>
                            </Container>
                        ) : (
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <Image
                                            alt="user img"
                                            // onError={(i) => (i.target.src = defaultImg)}
                                            circular
                                            src={defaultImg}
                                            style={{ height: 150, width: 150 }}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={12}>
                                        <Header inverted size="huge">
                                            {user.name}
                                            <Header.Subheader>@{user.username}</Header.Subheader>
                                        </Header>
                                        <List
                                            className="gridList"
                                            horizontal
                                            inverted={inverted}
                                            size="big"
                                        >
                                            <List.Item></List.Item>
                                        </List>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )}
                    </>
                )}
            </Container>
        </DefaultLayout>
    )
}

User.propTypes = {
    error: PropTypes.bool,
    errorMsg: PropTypes.string,
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    user: PropTypes.shape({
        data: PropTypes.shape({
            createdAt: PropTypes.string,
            email: PropTypes.string,
            emailVerified: PropTypes.number,
            name: PropTypes.number,
            username: PropTypes.string
        }),
        posts: PropTypes.shape({
            error: PropTypes.bool,
            errorMsg: PropTypes.string,
            hasMore: PropTypes.bool,
            loading: PropTypes.bool,
            page: PropTypes.number,
            results: PropTypes.arrayOf(
                PropTypes.shape({
                    createdAt: PropTypes.string,
                    description: PropTypes.string,
                    title: PropTypes.string
                })
            )
        })
    })
}

export default User
