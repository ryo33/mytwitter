defmodule Mytwitter.Timeline do
  use GenServer
  require Logger

  def start_link do
    GenServer.start_link(__MODULE__, name: __MODULE__)
  end

  def init(_opts) do
    stream = ExTwitter.stream_user
    pid = self()
    spawn_link fn ->
      for message <- stream do
        send pid, message
      end
      exit :kill
    end
    {:ok, :ok}
  end

  @user_keys [:name,
              :screen_name,
              :description,
              :url,
              :profile_banner_url,
              :profile_image_url_https,
              :statuses_count,
              :friends_count,
              :followers_count]
  @tweet_keys [:id,
               :id_str,
               :user,
               :retweeted_status,
               :created_at,
               :text]

  def format_user(user) do
    user
    |> Map.take(@user_keys)
  end

  def format_tweet(nil), do: nil
  def format_tweet(tweet) do
    tweet
    |> Map.take(@tweet_keys)
    |> Map.update!(:user, &format_user/1)
    |> Map.update(:retweeted_status, nil, &(format_tweet(&1)))
  end

  def handle_info(message, :ok) do
    with tweet = %ExTwitter.Model.Tweet{} <- message,
    false <- tweet.user.protected,
    nil <- tweet.in_reply_to_screen_name,
    nil <- tweet.in_reply_to_status_id,
    nil <- tweet.in_reply_to_status_id_str,
    nil <- tweet.in_reply_to_user_id,
    nil <- tweet.in_reply_to_user_id_str,
    nil <- tweet.quoted_status,
    [] <- Map.get(tweet.entities, :hashtags, []),
    [] <- Map.get(tweet.entities, :media, []),
    [] <- Map.get(tweet.entities, :symbols, []),
    [] <- Map.get(tweet.entities, :urls, []) do
      Mytwitter.Web.Endpoint.broadcast!("timeline", "tweet", format_tweet(tweet))
    end
    {:noreply, :ok}
  end
end
