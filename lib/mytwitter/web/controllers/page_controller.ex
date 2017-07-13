defmodule Mytwitter.Web.PageController do
  use Mytwitter.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
