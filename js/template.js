var templates = {
  user: [
    "<div class='userInfo'>",
      "<img src='<%= avatar_url %> />'",
      "<ul>",
        "<li class='username'><%= login %></li>",
        "<li class='location'<%= location %></li>",
        "<li class='repototal'><%= public_repos %></li>",
      "</ul>",
    "</div>"
  ].join(""),
  repos: [
    "<div class='repoItem'>",
      "<a href='<%= repoUrl %>' target='_blank'><%= repoName %></a>",
      "<span class='repoUpdated'<%= repoUpdated %></span>",
      "<span class='repoSSH'><%= repoSSH %></span>",
      "<span class='repoClone'><%= repoClone %></span>",
    "</div>"
  ].join("")
}
