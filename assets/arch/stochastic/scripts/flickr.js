/* 
expected kind of response from flickr

jsonFlickrApi(
  {"photos":
    {"page":1, "pages":22, "perpage":1, "total":"22", "photo":
      [{"id":"2506995847", "owner":"72809415@N00", "secret":"0a077ef1c2", 
        "server":"2034", "farm":3, "title":"jan tschicold postcards", 
        "ispublic":1, "isfriend":0, "isfamily":0}
      ]
    },
  "stat":"ok"})
*/

var cx_generic = cx_generic || {};

cx_generic.flickrPortfolio = function(spec){
  spec = spec || {};
  spec.api_key = spec.api_key || "ad5e3ee622a20f8774488118dea1a78a";
  spec.nsid = spec.nsid || "72809415@N00";
  spec.search_tag = spec.search_tag || "mine";
  flickr_url =  "http://api.flickr.com/services/rest/?method=flickr.photos.search&"+
                       "api_key="+spec.api_key+"&user_id="+spec.nsid+"&"+
                       "tags="+spec.search_tag+"&"+ // filters photos by tag "mine"
                       "content_type=7&"+ // both photos and illustrations
                       "format=json&";
  spec.thumb_id = spec.thumb_id || "#portfolio_thumbs";
  spec.nav_id = spec.nav_id || "#portfolio_nav";
  spec.gallery_id = spec.gallery_id || "#body";
  var img_id = "";
  var current_page = 1;
  var total_pages = total_pages || current_page;
  
  
  var flickrUrl = function(jsonObj){
    var url = "http://farm"+jsonObj.farm+".static.flickr.com/"+jsonObj.server+"/"+jsonObj.id+"_"+jsonObj.secret;
    return {
      square : function(){ return url + "_s.jpg"; },
      thumb : function(){ return url + "_t.jpg"; },
      small : function(){ return url + "_m.jpg"; },
      medium : function(){ return url + ".jpg"; },
      large : function(){ return url + "_b.jpg"; },
      page: function(){ return "http://flickr.com/photos/"+jsonObj.owner+"/"+jsonObj.id+"/"; }
    };
  };
    
  var buildNav = function() {
    if($("#p_nav").length === 1){
      $("#p_nav").empty();
    }else {
      $("<div id='p_nav'></div>").appendTo(spec.nav_id);      
    }
    if($("#n_nav").length === 1){
      $("#n_nav").empty();
    }else {
      $("<div id='n_nav'></div>").appendTo(spec.nav_id);      
    }
    var prev_page = (current_page === 1) ? total_pages : current_page - 1;
    var next_page = (current_page + total_pages + 1) % total_pages;
    $("<a href='#'>&larr;previous&#8195;</a> ").click(function(){ loadPortfolioPage(prev_page); return false;}).appendTo("<p>").appendTo("#p_nav");
    $("<a href='#'>&#8195;next&rarr;</a>").click(function(){ loadPortfolioPage(next_page);  return false;}).appendTo("<p>").appendTo("#n_nav");
  };
  
  var getThumbUrls = function(func){
    arr = []
    $.getJSON(
      flickr_url+"&jsoncallback=?",
      function(data){
        $.each(
          data.photos.photo,
          function(i,item){
            //console.log(flickrUrl(item).square())
            arr.push(flickrUrl(item).square())
          }
        )
        func(arr)
      }
    )
    
  }
  
  var buildThumbs = function(){
    $.getJSON( 
      flickr_url+"&jsoncallback=?", 
      function(data){
        total_pages = Number(data.photos.total); // set the total number of pages
        buildNav(); // do not build nav until first set of data comes back
        
        $.each(
          data.photos.photo, 
          function(i,item){
            var url = flickrUrl(item).square();
            var thumb_style = {backgroundImage:"url("+url+")", width:'75px', height:'75px', cssFloat:"left"};
            $("<div class='cx_thumb' id='cx_thumb_"+(i+1)+"'></div>").
            css(thumb_style).
            click(function(){
              $('.cx_thumb').removeClass('cx_selected');
              loadPortfolioPage(i+1);
              $(this).addClass('cx_selected');
              return false;
            }).
            hover(
              function(){$(this).fadeTo(100,.33);},
              function(){
              $(this).fadeTo(100,1);
              }
            ).
            appendTo(spec.thumb_id);
            
          }
        );
        $("<div></div>").css({clear:"both"}).appendTo(spec.thumb_id);
      });
  };
  
  var getPortfolioItem = function(data){
    $(spec.gallery_id).empty();

    $.each(data.photos.photo, function(i,item){
      var img_url = flickrUrl(item).small();
      var page_url = flickrUrl(item).page();
      $("<p>&nbsp;</p>").appendTo(spec.gallery_id);
      $("<a class='flickr' target='_blank' href='"+page_url+"'><img title='"+item.title+"' src='"+img_url+"' /></a>").appendTo("<p class='display'></p>").appendTo(spec.gallery_id);
      $("<h3>"+item.title+"</h3>").appendTo(spec.gallery_body);

      var photo_info_url = "http://api.flickr.com/services/rest/"+
                      "?method=flickr.photos.getInfo"+
                      "&api_key="+spec.api_key+"&"+
                      "&photo_id="+ item.id +
                      "&format=json&jsoncallback=?";
    
    $.getJSON(photo_info_url, function(data){
      var desc = data.photo.description["_content"];
      desc = desc.replace(/\n/gi,"<br />");
      $("<p class='desc'>"+desc+"</p>").appendTo(spec.gallery_id);
    });

   });
  };
  
  var loadPortfolioPage = function(page){
    buildNav();
    current_page = page;
    //buildNav(); // rebuild each time the image changes
    $.getJSON(flickr_url+"&per_page=1&page="+page+"&jsoncallback=?", getPortfolioItem);
  };
  
  var init = function(){
    buildThumbs();
    loadPortfolioPage(1);
  };
  
  return {
    flickrUrl: flickrUrl,
    //buildThumbs: buildThumbs,
    getThumbs: getThumbUrls,
    init: init,
    loadPortfolioPage: loadPortfolioPage
  };
  
};

  
/*
buildThumbs()







loadPortfolioPage(1)

*/