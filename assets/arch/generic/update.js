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
makeEditable = function(){
  var ta = stringToElt(this.innerHTML,"textarea")
  ta.addEventListener("blur",makeStatic,false)
  this.parentNode.replaceChild(ta,this)
  ta.focus(); //ta.select();
}

makeStatic = function(){
  if(this.value.trim() != ""){
    var plain = stringToElt(this.value,"li")
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

