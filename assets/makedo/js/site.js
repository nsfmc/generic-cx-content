// Site.js


makedo = function(){
  var fisherYates = function(inputArray) {
    // shuffles a copy of the array
    var arr = inputArray.slice(0);

    var ii = arr.length;
    if ( ii == 0 ) return false;
    while ( --ii ) {
      var j = Math.floor( Math.random() * ( ii + 1 ) );
      var tempi = arr[ii];
      var tempj = arr[j];
      arr[ii] = tempj;
      arr[j] = tempi;
    }
    return arr;
  };

  var fillthumbs = function(data){
    for(var i=0; i<data.folks.length; i+=1){
      var chump = data.folks[i];
      var thumb = $("<li>").
        append($("<img>",{
          src:"images/folks/"+chump.thumb,
          alt:chump.name,
          title:chump.name
          }));
      $("#us ul").append(thumb);
    }
  };
  
  return {
    getFolks : fillthumbs
  };
}();

$(document).ready(function(){
  
  $.getJSON('makedo.json',makedo.getFolks);
  
  // var classOptions = ["yellow","teal","black"];
  // var classes = fisherYates(classOptions);
  // console.log(classes);
  // $("h1 img").addClass(classes.pop());
  // var toggleColor = classes.pop();
  // (function(){
  //   $("h1 img").toggleClass(toggleColor);
  //   setTimeout(arguments.callee, Math.floor(Math.random()*1200)+8000);
  // }());
});