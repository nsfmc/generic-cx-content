var two_risd = function(){
  
    // 
    // for (var k in tworisd){
    //   if (tworisd.hasOwnProperty(k)){
    //     posts_sorted.push(parseInt(k,10));
    //   }
    // }
  
  var post_ids = []; // all the blog post id #s
  var post_authors = {}; // tworisd.js reformatted by author instead of by thread
  var authors = [];
  for(var blogpost in tworisd){ // blogpost is the blog id#
    if (tworisd.hasOwnProperty(blogpost)){ 
      post_ids.push(parseInt(blogpost,10))
      
      for(var i=0; i<tworisd[blogpost]['replies'].length; i+=1){
        var reply = tworisd[blogpost]['replies'][i]; // a reply
        var post_author = reply['author'];    // none of these are being used
        var post_date = reply['date'];        // but they exist in case i decide not
        var post_content = reply['content'];  // to save the reply object
        
        if(!post_authors.hasOwnProperty(post_author)){
          authors.push(post_author);
          post_authors[post_author] = [reply];
        }else if(post_authors.hasOwnProperty(post_author)){
          post_authors[post_author].push(reply);
        }
      }
    }
  }
  // numerically sort the post_ids
  var post_ids_sorted = post_ids.sort(function(a,b){return a-b;}); 
  authors.sort(); // alphabetically sort the authors
  
  return {
    "posts" : {
      "authors" : post_authors, 
      "threads" : tworisd,
    },
    "ids" : post_ids_sorted,  // the post ids numerically sorted
    "authors" : authors       // all the author names sorted
  };
}();
