import { createAction } from 'redux-act'

export const addTweet = createAction('add tweet', tweet => tweet)
export const showError = createAction('error', error => error)
export const clearError = createAction('clear error')
