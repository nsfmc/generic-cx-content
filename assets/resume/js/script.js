/* Author: 

*/

$(document).ready(function(){
  var md = new Showdown.converter();
  var content = {};
  $("#main").load("resume.md",function(){
    var original = $("#main").text();
    content.markdown = original;
    content.html = md.makeHtml(original);
    renderer.html();
  })
  var renderer = (function(c){
    var html = function(){ $("#main").html(c.html).addClass("html").removeClass("markdown").fadeIn(); }
    var md = function(){$("#main").text(c.markdown).addClass("markdown").removeClass("html")}
    return { "html" : html, "markdown" : md }
  })(content);  
  
  mpmetrics.track("visited resume!");
  
  $("header a").toggle(function(){
    $("#main").fadeOut(function(){ renderer.markdown(); $("#main").fadeIn();})
    if(Modernizr.history){ history.pushState({page:"markdown"},"markdown resume","resume.md"); }
    mpmetrics.track("toggled resume to markdown!");
    return false;
  },function(){
    $("#main").fadeOut(function(){ renderer.html(); $("#main").fadeIn();})
    if(Modernizr.history){ history.pushState({page:"html"},"markdown resume","./"); }
    mpmetrics.track("toggled resume to html!");
    return false;
  });
  
  if(Modernizr.history){
    window.onpopstate = function(evt){
      if(evt.state){renderer[evt.state.page]();}
      else{renderer.html()}
    }
  }
})






















