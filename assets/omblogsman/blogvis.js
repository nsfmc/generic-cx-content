
window.addEventListener('load', function() {
  // setup the canvas
  var black = new Pre3d.RGBA(.8, .8, .8, 1);
  var white = new Pre3d.RGBA(1, 1, 1, 1);

  var screen_canvas = document.getElementById('canvas');
  var renderer = new Pre3d.Renderer(screen_canvas);
  
  
  var posts_sorted = [];
  for (var k in tworisd){
    if (tworisd.hasOwnProperty(k)){
      posts_sorted.push(parseInt(k,10));
    }
  }
  
  var post_authors = {}
  for(var blogpost in tworisd){
    if (tworisd.hasOwnProperty(blogpost)){
      for(var i=0; i<tworisd[blogpost]['replies'].length; i+=1){
        var reply = tworisd[blogpost]['replies'][i];
        if(!post_authors.hasOwnProperty(reply['author'])){
          post_authors[reply['author']] = true;
        }
      }
    }
  }
  window.console.log(post_authors)
  
  // var post_times = [];
  // post_times.push(Date.parse(tworisd[posts_sorted[0]]['date']));
  // post_times.push(Date.parse(tworisd[posts_sorted[posts_sorted.length-1]]['date']));
  // window.console.log(post_times);
  // window.console.log(post_times[1]-post_times[0]) // total life of blog
  
  var post_age = function(post_id){
    var out = {};
    var blog_post = tworisd[post_id];
    out['first_post'] = Date.parse(blog_post['date']);
    out['age'] = 0; // posts have instantaneous age
    if (blog_post.replies.length > 0){ // there are any replies
      out['first_reply'] = Date.parse(blog_post['replies'][0]['date']);
      var last_reply_index = blog_post['replies'].length - 1;
      out['last_reply'] = Date.parse(blog_post['replies'][last_reply_index]['date']);
      out['age'] = out['last_reply'] - out['first_post']; 
    }
    // window.console.log(out)
    return out;
  }
  posts_sorted.sort(function(a,b){return a-b}) // sort the posts
  
  var blog_age = { // get the age max/mins of the blog
    'first_post':post_age(posts_sorted[0])["first_post"],
    'last_post':post_age(posts_sorted[posts_sorted.length - 1])["first_post"]
  }
  blog_age['age'] = blog_age['last_post'] - blog_age['first_post'];
  // window.console.log(blog_age)
  
  //window.console.log(posts_sorted);
  cube_width = 10 / posts_sorted.length
  var widths = []
  var viz = []
  for (var i=0; i<posts_sorted.length; i+=1){
    var reply_count = tworisd[posts_sorted[i]]["replies"].length;
    //window.console.log(reply_count);
    var relative_age = post_age(posts_sorted[i])['age'] / blog_age['age']
    // window.console.log(relative_age)
    var relative_position = (post_age(posts_sorted[i])['first_post'] - blog_age['first_post']) / blog_age['age']
    // window.console.log(relative_position)
    var blog_post_cube = Pre3d.ShapeUtils.makeBox(.0625,.125,10*relative_age);
    // window.console.log("bar width:"+(10*relative_age))
    // window.console.log("bar offset"+(10*relative_position))
    var transform = new Pre3d.Transform();
    widths.push(10*relative_age)
    transform.translate(i *.125 - posts_sorted.length / 16 , 0, 10*relative_age+20*relative_position);
    viz.push({
      shape: blog_post_cube,
      color: new Pre3d.RGBA(.3, .4, .8, .5),
      trans: transform
    })
  }

  function draw() {
    for (var i = 0; i < viz.length; ++i) {
      var cube = viz[i];
      renderer.fill_rgba = cube.color;
      renderer.transform = cube.trans;
      renderer.bufferShape(cube.shape);
    }
    renderer.draw();
    renderer.emptyBuffer();
  }

  renderer.camera.focal_length = 2.5;
  // Have the engine handle mouse / camera movement for us.
  DemoUtils.autoCamera(renderer, 10, 10, -50, 0.40, -1.06, 0, draw);

  renderer.background_rgba = black;
  
  cur_white = false;
  document.addEventListener('keydown',function(e){
      if (e.keyCode == 83){
        draw();
        return;
      }
      if (e.keyCode != 82)  // r
        return;
      var shuffly = [];
      for (var i=0; i<posts_sorted.length; i+=1){
        shuffly.push(posts_sorted[i]);
      }
      shuffly.sort(function(a,b){return .5-Math.random()})
      post_count = Math.floor(Math.random()*100);
      shuffly = shuffly.slice(0,post_count)
      function set (arr){
        var result = {};
        for (var i = 0; i < arr.length; i++){result[arr[i]] = true;}
        return result;
      }
      shuff = set(shuffly)
      window.console.log(shuff)
      for (var i = 0; i < viz.length; ++i) {
        cube = viz[i];
        if (posts_sorted[i] in shuff){
          renderer.fill_rgba = new Pre3d.RGBA(.5, .7, .2, .5)
        }else{
          renderer.fill_rgba = cube.color;
        }
        renderer.transform = cube.trans;
        renderer.bufferShape(cube.shape);
      }
      
      auths = []
      for(var k in post_authors){
        if (post_authors.hasOwnProperty(k)){
          auths.push(k)
        }
      }
      var idx = Math.floor(Math.random()*auths.length);
      $('#author h2').text(auths[idx])
      
      $('#author').css('display','none')
      $('#author').fadeIn('slow')
      renderer.draw();
      renderer.emptyBuffer();
  },false);
  // document.addEventListener('keydown', function(e) {
  //   if (e.keyCode != 84)  // t
  //     return;
  // 
  //   if (cur_white) {
  //     document.body.className = "black";
  //     renderer.background_rgba = black;
  //   } else {
  //     document.body.className = "white";
  //     renderer.background_rgba = white;
  //   }
  //   cur_white = !cur_white;
  //   draw();
  // }, false);

  draw();
}, false);
