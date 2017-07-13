import React from 'react'
import { Popup, Image, Segment, Container, Statistic, Icon } from 'semantic-ui-react'

const User = ({ user, children }) => {
  const url = user.url || `https://twitter.com/${user.screen_name}`
  const profile_banner_url = user.profile_banner_url
  const items = [
    {label: 'Tweets', value: user.statuses_count},
    {label: 'Following', value: user.friends_count},
    {label: 'Followers', value: user.followers_count},
  ]
  return (
    <Popup
      trigger={children}
      position='bottom right'
      hoverable
      wide
      size='huge'
    >
      <a href={url}>{user.name}</a>
      {profile_banner_url ? (
        <Image src={profile_banner_url} fluid />
      ) : null}
      {user.description && user.description.length > 0 ? (
        <Segment basic>
          {user.description}
        </Segment>
      ) : null}
      <Statistic.Group items={items} size='mini' horizontal />
    </Popup>
  )
}

export default User
