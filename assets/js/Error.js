import React from 'react'
import { Message } from 'semantic-ui-react'
import {
  clearError
} from './actions'

const Error = ({ error, clearError }) => (
  error ? (
    <Message error content={error} onDismiss={clearError} />
  ) : null
)

export default Error
