/*
 *
 Copyright (c) 2005 Marcos Ojeda, thinker at mit dot edu

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 *
 */

function xPathQuery(/* string */ query, /* node  */ reference){ 
  var path = document.evaluate(query,reference, null,7,null) 
  return path 
}

function makeLink(/* string  */ href, /* string  */ content){
  var a = document.createElement("a")
  a.setAttribute("href",href)
  a.appendChild(document.createTextNode(content))
  return a
}

function makeTOC(/* node  */toc){ 
  var arr = xPathQuery("//h2",document)
  for(var i=0;i < arr.snapshotLength;i++){
    var tc = arr.snapshotItem(i).textContent
    toc.appendChild(makeLink("#"+tc,tc)) 
    toc.appendChild(document.createTextNode(" "))
    arr.snapshotItem(i).setAttribute("id",tc)
  }
}

function loadTOC(){
  var toc = document.getElementById('toc')
  if(toc){
    if(document.evaluate)
      otherTOC(toc)
    else
      toc.parentNode.removeChild(toc)
  }
}

function pushOnload(/* function */ proc){
  if(window.onload){ 
    window.onload = function(){ window.onload(); proc(); }
  }  
  else{ 
    window.onload = proc 
  }
}

pushOnload(loadTOC)
