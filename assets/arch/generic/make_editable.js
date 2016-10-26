/**
 * Copyright (C) 2006 Marcos Andrés Ojeda
 *
 */

//Document.domain = "mit.edu";

/**
 *  a user types and as they type nothing happens until they stop typing.
 *  specifically, when a user stops typing for 10 seconds, the form should
 *  submit. 
 */
var queue = new Array();

expose = function(obj){
  var outie = ""
  for(var name in obj){
    var val = obj[name] 
    if(val != "" && !(val instanceof Object) && name != "length"){
      outie += name+": "+obj[name]+"\n"
    }
  }
  return outie
}

function mimicStyle(/*element*/template,/*element*/target){
  var templateStyle = window.getComputedStyle(template,null)
   for(var name in templateStyle){
    value = templateStyle[name]
    if(value != "" && !(value instanceof Object) && name != "length"){
      try{
        target.style[name] = value
      }
      catch(e){
      }
    }
  }
}

String.prototype.trim = function(){
  return this.replace(new RegExp("^\\s+|\\s+$", "gi"), "");
}

updateWithDelay = function(target, source, delay){
  clearTimeouts();
  addTimeout(
    window.setTimeout(
      "updateTextArea('"+target+"','"+source+"')",
      delay))
}

addTimeout = function(id){
  queue.push(id)
  return true;
}

clearTimeouts = function(){
  for(var i=0;i<queue.length;i++){
    window.clearTimeout(queue[i])
  }
  return true;
}

/**
 *  These two functions convert nodes between editable and uneditable nodes
 * They are 
 */

makeEditable = function(){
  //TODO set the textarea dimensions to the same size as the paragraph
  var content = this.innerHTML
  content = longToShort(content)
  var input = stringToElt(content,"textarea")
  mimicStyle(this,input)
  //try to change the style of the textarea to match the element...
  //forceStyles(this,input)
  input.original = this.tagName
  input.addEventListener("blur",makeStatic,false)
  //input.onkeyup = updateWithDelay()
  this.parentNode.replaceChild(input,this)
  input.focus()
  input.onkeypress = crlf
}

makeStatic = function(/*tag*/){
  /*
   * Assign makeStatic as the onBlur event of a textarea
   * It will change the textarea to an element that is
   * visibly static when focus is lost.
   */
  var content = this.innerHTML
  if(!content) content = this.value
  if(content.trim() != ""){

    var plain = stringToElt("",this.original)
    plain.innerHTML = shortToLong(this.value)
    plain.addEventListener("click",makeEditable,false)
    this.parentNode.replaceChild(plain,this)
  }else{
    this.parentNode.removeChild(this)
  }
}

stringToElt = function(/*text*/string,/*text*/tag){
  /*
   *
   */
  var p = document.createElement(tag)
  p.appendChild(document.createTextNode(string))
  return p
}

function crlf(/*event*/event){
  /*
   * this function should be added as the onkeypress handler
   * of a textarea
   */
  var loc = this.selectionStart
  var before = this.value.substring(0,loc)
  var after = this.value.substring(loc,this.textLength)
  if(event.keyCode == 13){
    
    var prev = stringToElt("",this.original)
    prev.innerHTML = before.trim()
    prev.addEventListener("click",makeEditable,false)
    prev.original = this.original
    
    var rent = this.parentNode
    rent.insertBefore(prev,this)
    this.value = after.trim()
    this.selectionStart = 0; this.selectionEnd = 0;
  }
}

updateTextArea = function(target,source){
  var t = document.getElementById(target)
  var s = document.getElementById(source)
  
  if(s.value.trim() != ""){
    var appended = stringToElt(s.value,"li")
    appended.addEventListener("click",makeEditable,false)

    t.insertBefore(appended,t.firstChild)
    s.value = ""
  }
}

function addTextArea(){
  var parent = document.getElementById("steps")
  var ta = stringToElt("","textarea")
//  ta.style.setProperty("width","26em","")
//  ta.style.setProperty("margin-left","2em","")
  parent.insertBefore(ta,parent.firstChild)
  ta.focus()
  ta.addEventListener("blur",makeStatic,false)
  
}

function getPos(/*htmlElement*/elt){
  /*
   *   getPos returns the position of any element 
   * relative to its siblings (i.e. first, second third...)
   */
  
  var siblings = elt.parentNode.childNodes
  var loc = 0 //0 or 1 indexed, your choice
  
  for(var i=0; i<siblings.length;i++){
    
    var curr = siblings[i]
    
    if(curr === elt){ return loc;}
    
    if(curr.nodeType == ELEMENT_NODE) { loc++; }
  
  }
}

/*
 * reSwap is an abstraction for text.replace
 * in case we ever use a different function
 */

function reSwap(/*regexp*/re,/**/replacement,/*text*/text){
  return text.replace(re,replacement)
}


function shortToLong (text)
{
  //these convert from shortHand to html for display
  text = makeItalic(text)
  text = makeBold(text)
  return text
}

function longToShort (text)
{
  //these convert from html to shorthand
  text = unmakeItalic(text)
  text = unmakeBold(text)
  return text
}

function makeItalic (/*text*/text){
  /*
   *  makeItalic converts shorthand italic to html italics
   */
  return reSwap(/__(.*?)__/g,"<em>$1</em>",text)
}

function unmakeItalic (/*text*/text){
  /*
   *  unmakeItalic converts html italic to shorthand italics
   */
   return reSwap(/<em>(.*?)<\/em>/g,"__$1__",text)
}

function makeBold (/*text*/text){
  /*
   *  makeItalic converts shorthand bold to html bold
   */
  return reSwap(/\*\*(.*?)\*\*/g,"<strong>$1</strong>",text)
}

function unmakeBold (/*text*/text){
  /*
   *  unmakeItalic converts html bold to shorthand italics
   */
   return reSwap(/<strong>(.*?)<\/strong>/g,"**$1**",text)
}

var req;

function loadXMLDoc(url,proc) {
  req = false; //setting the global req var
  if(window.XMLHttpRequest) {
    try {
      req = new XMLHttpRequest();
    } catch(e) {
      req = false;
    }
  }
  if(req) {
    req.onreadystatechange = proc;
    req.open("GET", url, true);
    req.send("");
  }
}

function pushOnload(/* function */ proc){
  if(window.onload){ 
    var orig = window.onload
    window.onload = function(){ orig(); proc(); }
  }  
  else{ 
    window.onload = proc 
  }
}

/*
 *  you can set the value of editable to limit which elements can be edited.
 *  keep in mind, however, that all its children will also be editable
 */
if(!editable) {
  editable = ["P","LI","H1","H2","H3","H4"]
}

function startup(){
  for(var i=0;i<editable.length;i++){
    var elts = document.getElementsByTagName(editable[i])
    for(var j=0;j<elts.length;j++){
      elts[j].addEventListener("click",makeEditable,false)
    }
  }
}

pushOnload(startup)