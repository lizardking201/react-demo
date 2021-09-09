import { Container, Divider, Header, Item, Label, Placeholder, Visibility } from "semantic-ui-react"
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
                <Header as="h1" content="Browse Comments" inverted />
                <div className="ui labeled input fluid large inverted">
                    <DebounceInput
                        debounceTimeout={800}
                        minLength={2}
                        onChange={onChangeQ}
                        placeholder="Search comments"
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
                    <Item.Group divided link relaxed="very">
                        {results.map((item, i) => {
                            const img = images[Math.floor(Math.random() * images.length)]

                            if (loading) {
                                return (
                                    <Item key={`userItem${i}`}>
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
                                    key={`commentItem${i}`}
                                    onClick={() => router.push(`/comment/${item.id}`)}
                                >
                                    <Item.Content>
                                        <Item.Header>Comment #{item.id}</Item.Header>
                                        <Item.Meta>{item.likeCount} likes</Item.Meta>
                                        <Item.Description>{item.message}</Item.Description>
                                        <Item.Extra>
                                            <Label icon="user" content={item.userName} />
                                            <Label
                                                icon="comment"
                                                content={`On Post -> ${item.postTitle}`}
                                            />
                                        </Item.Extra>
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
            id: PropTypes.number,
            likeCount: PropTypes.number,
            message: PropTypes.string,
            postDescription: PropTypes.string,
            postId: PropTypes.number,
            postTitle: PropTypes.string,
            userId: PropTypes.number,
            userName: PropTypes.name
        })
    )
}

export default Comments
