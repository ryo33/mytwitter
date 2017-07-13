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
    [] <- Map.get(tweet.entities, :urls, []),
    [] <- Map.get(tweet.entities, :user_mentions, []) do
      Mytwitter.Web.Endpoint.broadcast!("timeline", "tweet", tweet)
    else
      _ ->
        Logger.debug(inspect message)
    end
    {:noreply, :ok}
  end
end
