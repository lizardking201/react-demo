import { Container, Divider, Header, Item, Placeholder, Visibility } from "semantic-ui-react"
import { toast } from "react-toastify"
import { images } from "options/images"
import { getConfig } from "options/toast"
import { useRouter } from "next/router"
import { DebounceInput } from "react-debounce-input"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/comments"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import reducer from "reducers/comments"
import useLogReducer from "reducer-logger"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Comments = () => {
    const router = useRouter()

    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [q, setQ] = useState("")

    const [internalState, dispatch] = useLogReducer(reducer, initialState)
    const { error, results } = internalState

    useEffect(() => {
        getComments(q, "name", "desc")
    }, [q])

    const getComments = async (q, sort, dir, page = 0) => {
        if (page === 0) {
            setLoading(true)
        } else {
            setLoadingMore(true)
        }

        axios
            .get(`/api/comment/search`, {
                params: {
                    q,
                    sort,
                    dir,
                    page
                }
            })
            .then((response) => {
                const { data } = response
                dispatch({
                    type: "GET_COMMENTS",
                    payload: data
                })
                setPage(data.page)
                setHasMore(data.hasMore)
                if (page === 0) {
                    setLoading(false)
                } else {
                    setLoadingMore(false)
                }
            })
            .catch((error) => {
                toast.error(error.response.data.msg)
                dispatch({
                    type: "SET_COMMENTS_ERROR",
                    payload: error.response.data.msg
                })
            })
    }

    const onChangeQ = (e) => {
        const value = e.target.value
        setQ(value)
    }

    return (
        <DefaultLayout activeItem="comments" containerClassName="commentsPage">
            <Container>
                <div className="ui labeled input fluid large inverted">
                    <DebounceInput
                        debounceTimeout={800}
                        minLength={2}
                        onChange={onChangeQ}
                        placeholder="Search users"
                        value={q}
                    />
                </div>
                <Divider />
                <Visibility
                    continuous
                    offset={[50, 50]}
                    onBottomVisible={() => {
                        if (!loading && !loadingMore && hasMore) {
                            getComments(q, "name", "desc", page)
                        }
                    }}
                >
                    <Item.Group link>
                        {results.map((item, i) => {
                            const img = images[Math.floor(Math.random() * images.length)]

                            if (loading) {
                                return (
                                    <Item key={`userItem${i}`}>
                                        <Placeholder inverted style={{ marginRight: 12 }}>
                                            <Placeholder.Image
                                                style={{ height: 150, width: 150 }}
                                            />
                                        </Placeholder>
                                        <Item.Content>
                                            <Placeholder inverted fluid>
                                                <Placeholder.Paragraph>
                                                    <Placeholder.Line />
                                                    <Placeholder.Line />
                                                    <Placeholder.Line />
                                                </Placeholder.Paragraph>
                                            </Placeholder>
                                        </Item.Content>
                                    </Item>
                                )
                            }

                            return (
                                <Item
                                    key={`userItem${i}`}
                                    onClick={() => router.push(`/users/${item.username}`)}
                                >
                                    <Item.Image size="tiny" src={`/images/avatar/large/${img}`} />
                                    <Item.Content>
                                        <Item.Header>{item.name}</Item.Header>
                                        <Item.Meta>
                                            <span className="price">@{item.username}</span>
                                        </Item.Meta>
                                        <Item.Description>{item.bio}</Item.Description>
                                    </Item.Content>
                                </Item>
                            )
                        })}
                    </Item.Group>
                </Visibility>
            </Container>
        </DefaultLayout>
    )
}

Comments.propTypes = {
    error: PropTypes.bool,
    errorMsg: PropTypes.string,
    hasMore: PropTypes.bool,
    inverted: PropTypes.bool,
    loading: PropTypes.bool,
    page: PropTypes.number,
    results: PropTypes.arrayOf(
        PropTypes.shape({
            createdAt: PropTypes.string,
            email: PropTypes.string,
            emailVerified: PropTypes.number,
            name: PropTypes.number,
            username: PropTypes.string
        })
    )
}

export default Comments
