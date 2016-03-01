var ghqv = {
  init: function(){
    ghqv.presentation();
    ghqv.events();
  },
  presentation: function(){
    ghqv.getUserData();
    ghqv.getRepoData();
    setTimeout(ghqv.checkUserName, 500);
  },
  config: {
    urlBase: "https://api.github.com/users",
    userData: "",
    reposData: ""
  },
  events: function(){
    $('input[name="username"]').on('keyup', ghqv.getUserName);
  },
  getUserName: function(event){
    event.preventDefault();
    if (event.keyCode == 13) {
      var $input = $('input[name="username"]');
      var $div = $('.prompt div');
      localStorage.setItem('ghqvUserName', $input.val());
      ghqv.getUserData();
      ghqv.getRepoData();
      $input.val("").addClass('hide');
      $div.removeClass('hide');
      ghqv.buildUserHTML(ghqv.config.userData, '.prompt div');
      ghqv.buildRepoHTML('.reposContainer');
    }
  },
  checkUserName: function(){
    if (localStorage.getItem('ghqvUserName')) {
      var $input = $('input[name="username"]');
      var $div = $('.prompt div');
      $input.addClass('hide');
      $div.removeClass('hide');
      ghqv.buildUserHTML(ghqv.config.userData, '.prompt div');
      ghqv.buildRepoHTML('.reposContainer');
    }
  },
  buildUserHTML: function(data, container){
    userStr = "<div class='userInfo'><img src='"
            + ghqv.config.userData.avatar_url
            + "'><ul><li class='username'><strong>Username:</strong> "
            + ghqv.config.userData.login
            + "</li><li class='location'><strong>Location:</strong> "
            + ghqv.config.userData.location
            + "</li><li class='repototal'><strong>Number of Repos:</strong> "
            + ghqv.config.userData.public_repos
            + "</li></ul></div>";
    console.log(userStr);
    $(container).html(userStr);
  },
  buildRepoHTML: function(container){
    repoStr = "";
    ghqv.config.reposData.forEach(function(el){
      repoStr += "<div class='repoItem'><a href='"
              +  el.repoUrl
              +  "' target='_blank'>"
              +  el.repoName
              +  "</a>"
              +  "<span class='repoUpdated'><strong>Last Updated:</strong> "
              +  el.repoUpdated
              +  "</span><span class='repoSSH'><strong>SSH:</strong> "
              +  el.repoSSH
              +  "</span><span class='repoClone'><strong>Clone:</strong> "
              +  el.repoClone
              +  "</span></div>"
    });
    $(container).html(repoStr);
  },
  getUserData: function() {
    var response = $.ajax({
      method: "GET",
      url: ghqv.config.urlBase + "/" + localStorage.getItem('ghqvUserName'),
      dataType: "json"
    });
    response.done(function(){
      ghqv.config.userData = response.responseJSON;
    });
  },
  getRepoData: function() {
    var response = $.ajax({
      method: "GET",
      url: ghqv.config.urlBase + "/" + localStorage.getItem('ghqvUserName') + "/repos",
      dataType: "json"
    });
    response.done(function(){
      ghqv.config.reposData = response.responseJSON.map(function(el){
        return {
          repoUrl: el.html_url,
          repoName: el.name,
          repoUpdated: moment.utc(el.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a"),
          repoSSH: el.ssh_url,
          repoClone: el.clone_url
        }
      });
    });
  }

}

$(document).ready(function(){
  ghqv.init();
});
