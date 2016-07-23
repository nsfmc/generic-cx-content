/*
 *  
 * Copyright (c) 2005 Marcos Ojeda, thinker at mit dot edu
 *
 * breadcrumbs.js adds breadcrumbs to a website by walking up
 * the window.location value and creating links to each succesive
 * level.
 *
 *   Like toc.js, breadcrumbs.js looks for a paragraph element
 * with id="crumbs" the content can be anything you want.
 *
 */

function Breadcrumbs(){
  /*
   *  ROOTTITLE is what your root is called 
   *    (since / isn't really a name)
   *  START refers to how deep your web root is on the server:
   *    0-> web.mit.edu/
   *    1-> web.mit.edu/thinker/
   *    2-> web.mit.edu/thinker/www/
   */

  ROOTTITLE = "home"
  START = 2 

  paths = window.location.pathname.split("/")
  depth = paths.length - 1
  depth -= (paths[depth] =="") ? 1:0
  curr_page = paths[depth].split(".")[0]

  function makeCrumbs(/*HTMLelement*/elt){
    var href= ""
    for(var i=0; i<depth;i++){
      href += paths[i]+"/"
      if(i==START)  appendLink(elt, href, ROOTTITLE, " < ")
      if(i>START) appendLink(elt, href, paths[i], " < ")
    }
    appendText(elt,curr_page)
  }

  function appendText(/*HTMLelement*/elt,text){
    elt.appendChild(document.createTextNode(text))
  }
  function appendLink(/*HTMLelement*/elt,href,text,sep){
    elt.appendChild(makeLink(href,text)) 
    appendText(elt,sep)
  }

  Breadcrumbs.init = init;
  function init(){
    try{
      nav = document.getElementById("crumbs")
      makeCrumbs(nav)
    }
    catch(e)
    {
      //no crumb id around
    }
  }
}

Breadcrumbs()

pushOnload(Breadcrumbs.init)