import "phoenix_html"
import socket from "./socket"
import React from 'react'
import { connect, Provider } from 'react-redux'
import { createReducer } from 'redux-act'
import { render } from 'react-dom'
import {
  combineReducers, applyMiddleware, createStore
} from 'redux'
import logger from 'redux-logger'
import { Icon, Container, Header } from 'semantic-ui-react'
import Timeline from './Timeline'
import Error from './Error'
import {
  addTweet, showError, clearError
} from './actions'

const tweets = createReducer({
  [addTweet]: (list, tweet) => list.concat(tweet)
}, [])
const error = createReducer({
  [showError]: (state, error) => error,
  [clearError]: (state, payload) => null,
}, null)

const reducer = combineReducers({ tweets, error })

const store = createStore(
  reducer,
  applyMiddleware(logger)
)

const mapStateToProps = ({ tweets, error }) => {
  return { tweets, error }
}
const mapDispatchToProps = {
  clearError
}

const App = connect(mapStateToProps, mapDispatchToProps)(
  ({ tweets, error }) => (
    <Container>
      <Header as='h2'>
        <a href="https://github.com/ryo33/mytwitter">
          <Icon name="github" /> ryo33/mytwitter
        </a>
      </Header>
      <Error error={error} clearError={() => clearError()} />
      <Timeline tweets={tweets} />
    </Container>
  )
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

let channel = socket.channel("timeline", {})


socket.onError(() => {
  store.dispatch(showError("there was an error with the connection!"))
})
channel.join()
  .receive("ok", resp => {
    store.dispatch(clearError())
    console.log("Joined successfully", resp)
  })
  .receive("error", resp => {
    store.dispatch(showError("Unable to join"))
  })

channel.on("tweet", tweet => {
  store.dispatch(addTweet(tweet))
})
