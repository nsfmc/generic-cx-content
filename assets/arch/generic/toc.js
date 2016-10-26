/*
 *
 *  Copyright (c) 2005 Marcos Ojeda, thinker at mit dot edu
 *
 */

function makeLink(/* string  */ href, /* string  */ content){
  var a = document.createElement("a")
  a.setAttribute("href",href)
  a.appendChild(document.createTextNode(content))
  return a
}

function makeTOC(/* node */ toc){
  var nodeset = document.getElementsByTagName("h2")
  for(var i=0; i<nodeset.length;i++){
    var tc = nodeset[i].firstChild.nodeValue
    toc.appendChild(makeLink("#"+tc,tc)) 
    toc.appendChild(document.createTextNode(" "))
    nodeset[i].setAttribute("id",tc)
  }
}

function loadTOC(){
  var toc = document.getElementById('toc')
  if(toc){
    makeTOC(toc)
  }
}

pushOnload(loadTOC)