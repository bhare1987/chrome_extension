var ghqv = {
  init: function(){
    ghqv.presentation();
    ghqv.events();
  },
  presentation: function(){
    ghqv.checkUserName();
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
      $div.removeClass('hide').html(ghqv.compileTemplate(handlebarTemplates.user(), ghqv.config.userData));
      ghqv.addReposToDom(ghqv.config.reposData, '.reposContainer');
    }
  },
  checkUserName: function(){
    if (localStorage.getItem('ghqvUserName')) {
      var $input = $('input[name="username"]');
      var $div = $('.prompt div');
      ghqv.getUserData();
      ghqv.getRepoData();
      $input.addClass('hide');
      $div.removeClass('hide').html(ghqv.compileTemplate(handlebarTemplates.user(), ghqv.config.userData));
      ghqv.addReposToDom(ghqv.config.reposData, '.reposContainer');
    }
  },
  // getTmpl: function(templateName){
  //   return templates[templateName];
  // },
  // constructTmpl: function(templateName){
  //   var tmpl = ghqv.getTmpl(templateName);
  //   var tmplFunc = _.template(tmpl);
  //   return tmplFunc;
  // },
  // constructContent: function(templateName, object){
  //   var output = ghqv.constructTmpl(templateName);
  //   return output(object);
  // },
  addReposToDom: function(repos, container) {
    ghqv.compileTemplate(handlebarTemplates.repos, repos);
    $(container).append(ghqv.compileTemplate(handlebarTemplates.repos(), repos));
  },
  compileTemplate: function(template, data){
    var template = Handlebars.compile(template);
    return template(data);
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
