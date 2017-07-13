import React from 'react'
import { Button, Comment, Form, Header } from 'semantic-ui-react'

const Timeline = ({ tweets }) => (
  <Comment.Group>
    <Header as='h3' dividing>Timeline</Header>
    {tweets.map(t => {
      let tweet = t
      if (t.retweeted_status) {
        tweet = t.retweeted_status
      }
      return (
        <Comment key={tweet.id}>
          <Comment.Avatar src={tweet.user.profile_image_url_https} />
          <Comment.Content>
            <Comment.Author as='a'>{tweet.user.name}</Comment.Author>
            <Comment.Metadata>
              <div>@{tweet.user.screen_name}</div>
              <div>{tweet.created_at}</div>
            </Comment.Metadata>
            <Comment.Text>{tweet.text}</Comment.Text>
          </Comment.Content>
        </Comment>
      )
    })}
  </Comment.Group>
)

export default Timeline
