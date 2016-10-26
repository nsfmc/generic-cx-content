Document.domain = "mit.edu";

/**
 *  a user types and as they type nothing happens until they stop typing.
 *  specifically, when a user stops typing for 10 seconds, the form should
 *  submit. 
 */
var queue = new Array();

String.prototype.trim = function()
{
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
 *  These functions convert nodes between editable and uneditable nodes
 */
makeEditable = function(id){
  var node = document.getElementById("disp_"+id)
  var form = document.getElementById("form_"+id)
  node.parentNode.removeChild(node);
  form.style.display = 'block';
}

makeStatic = function(){
  if(this.value.trim() != ""){
    var plain = stringToElt(this.value,"p")
    plain.addEventListener("click",makeEditable,false)
    this.parentNode.replaceChild(plain,this)
  }else{
    this.parentNode.removeChild(this)
  }
}

stringToElt = function(string,tag){
  var p = document.createElement(tag)
  p.appendChild(document.createTextNode(string))
  return p
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
  var parent = document.getElementById("blog")
  var ta = stringToElt("","textarea")
  ta.setAttribute("cols",35)
  ta.style.setProperty("margin-left","2em","")
  parent.insertBefore(ta,parent.firstChild)
  ta.focus()
  ta.addEventListener("blur",makeStatic,false)
  
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

function showAll() {
  if (req.readyState == 4) {
    if (req.status == 200) {
      var blog = document.getElementById("posts")
      var text = req.responseText;
      blog.innerHTML = text;
    }
  }
}

function showId(id){
  var fragment = document.createDocumentFragment();
  loadXMLDoc("http://localhost/~marcos/web_scripts/blog.php?mode=view&id="+id, getFragment);
  function getFragment(){
    if (req.readyState == 4) {
      if (req.status == 200) {
        var text = req.responseText;
        blog.innerHTML = text;
      }
    }
  }

}

loadXMLDoc("http://localhost/~marcos/web_scripts/blog.php?mode=view", showAll)
