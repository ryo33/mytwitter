import React from 'react'
import { Button, Comment, Form, Icon } from 'semantic-ui-react'
import UserPopup from './UserPopup'

const Timeline = ({ tweets }) => (
  <Comment.Group>
    {tweets.map(t => {
      let tweet = t
      let retweet = t.retweeted_status != null
      if (retweet) {
        tweet = t.retweeted_status
      }
      return (
        <Comment key={t.id}>
          {retweet ? (
            <Comment.Content>
              <Icon name="retweet" color="green" />
              <UserPopup user={t.user}>
                <Comment.Author as='a'>{t.user.name}</Comment.Author>
              </UserPopup>
              <Comment.Metadata>
                <div>@{t.user.screen_name}</div>
                <div>{t.created_at}</div>
              </Comment.Metadata>
            </Comment.Content>
          ) : null}
          <UserPopup user={tweet.user}>
            <Comment.Avatar src={tweet.user.profile_image_url_https} />
          </UserPopup>
          <Comment.Content>
            <UserPopup user={tweet.user}>
              <Comment.Author as='a'>{tweet.user.name}</Comment.Author>
            </UserPopup>
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
