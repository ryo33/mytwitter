import "phoenix_html"
import socket from "./socket"
import React from 'react'
import { connect, Provider } from 'react-redux'
import { createAction, createReducer } from 'redux-act'
import { render } from 'react-dom'
import {
  combineReducers, applyMiddleware, createStore
} from 'redux'
import logger from 'redux-logger'
import Timeline from './Timeline'

const addTweet = createAction('add tweet', tweet => tweet)
const tweets = createReducer({
  [addTweet]: (list, tweet) => list.concat(tweet)
}, [])

const reducer = combineReducers({ tweets })

const store = createStore(
  reducer,
  applyMiddleware(logger)
)

const mapStateToProps = ({ tweets }) => {
  return { tweets }
}

const App = connect(mapStateToProps)(Timeline)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

let channel = socket.channel("timeline", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

channel.on("tweet", tweet => {
  store.dispatch(addTweet(tweet))
})
