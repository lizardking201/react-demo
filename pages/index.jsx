import { Container, Header } from "semantic-ui-react"
import { useEffect } from "react"
import DefaultLayout from "@layouts/default"
import PropTypes from "prop-types"
import React from "react"

const Home = ({ inverted = true }) => {
    useEffect(() => {}, [])

    return (
        <DefaultLayout
            activeItem="interactions"
            containerClassName="homePage"
            inverted={inverted}
            showFooter={false}
        >
            <Container>
                <Header as="h1" inverted={inverted}>
                    Recently added
                </Header>
                <div style={{ marginTop: "28px" }}></div>
            </Container>
        </DefaultLayout>
    )
}

Home.propTypes = {
    posts: PropTypes.shape({
        hasMore: PropTypes.bool,
        loading: PropTypes.bool,
        page: PropTypes.number,
        results: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.shape({
                    createdAt: PropTypes.string,
                    description: PropTypes.string
                })
            ])
        )
    }),
    inverted: PropTypes.bool
}

export default Home
