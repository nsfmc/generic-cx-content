function pq(){
  var sl = new String(window.location)
  qs = sl.split("?")[1]
  if(qs != undefined){
    var literal = "var http_get = {"
    var pairs = qs.split("&")
    for(var i=0; i<pairs.length; i++){
      var s = pairs[i].split("=")
      literal += s[0] + ":'" + s[1] + "'"
      if(i != pairs.length - 1)
        literal += ','
    }
    literal += "}"
    eval(literal)
    return http_get
  }
  return false
}

function getPage(name, collection){
	for(var i=0; i < collection.length; i++){
	  if(collection[i].short == name)
	    return i
	}
	return false
}

function make_template( collection, page ){
  
  var project = collection[page]
  
  next_page = (page+1 >= collection.length) ? 0 : page + 1
  
  var template = '<div id="wrapper">' +
  	'<div class="image_switch">' +
  	'<img src="' + project.image +'">' +
  	'</div>'+

  	'<div class="description">' +
  			'<p class="description_name">' + project.long + '</p>' +
  			project.description +
  	'</div>' +

  '<div class="next_button" <a href="?page='+ next_page +'"> next </a>' + //to-do PUT page number here
  '</div>' +

  '</div>'

  return template

}

$_GET = pq()

page = (!$_GET["page"]) ? 0 : new Number($_GET["page"]) 
project = $_GET["project"]
