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
  spec.thumb_id = spec.thumb_id || "#thumbs";
  spec.gallery_id = spec.gallery_id || "#body";
  var img_id = "";
  var current_page = 1;
  var total_pages = total_pages || current_page;
  
  
  var flickrUrl = function(jsonObj){
    var url = "http://farm"+jsonObj.farm+".static.flickr.com/"+jsonObj.server+"/"+jsonObj.id+"_"+jsonObj.secret;
    return {
      square : url + "_s.jpg",
      thumb  : url + "_t.jpg",
      small  : url + "_m.jpg",
      medium : url + ".jpg",
      large  : url + "_b.jpg",
      page   : "http://flickr.com/photos/"+jsonObj.owner+"/"+jsonObj.id+"/"
    };
  };
    
  var getThumbUrls = function(func){
    arr = []
    $.getJSON(
      flickr_url+"&jsoncallback=?",
      function(data){
        $.each(
          data.photos.photo,
          function(i,item){
            arr.push(flickrUrl(item).square)
          }
        )
        func(arr)
      }
    )
    
  }
  
  var buildThumbs = function(){
    // buildThumbs runs once
    $.getJSON( 
      flickr_url+"&jsoncallback=?", 
      function(data){
        total_pages = Number(data.photos.total); // set the total number of pages
        // buildNav(); // do not build nav until first set of data comes back
        
        // load the most recent portfolio item by default
        loadPortfolioItem(data.photos.photo[0])
        
        $.each(
          data.photos.photo, 
          function(i,item){
            var url = flickrUrl(item).square;
            var thumb_style = {backgroundImage:"url("+url+")", width:'75px', height:'75px', cssFloat:"left"};
            $("<div class='cx_thumb' id='cx_thumb_"+(i+1)+"' title='"+item.title+"'></div>").
            css(thumb_style).
            click(function(){
              $('.cx_thumb').removeClass('cx_selected');
              loadPortfolioItem(item)
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
  
  var loadPortfolioItem = function(data){
    $(spec.gallery_id).empty();
    
    var im_url = flickrUrl(data).large;
    var page_url = flickrUrl(data).page;
    $("<p>").appendTo(spec.gallery_id);
    $("<a class='flickr' target='_blank'>").attr({href:page_url}).
      append($("<img>").attr({title:data.title, src:im_url})).
      appendTo("<p class='display'>").appendTo(spec.gallery_id);
    $("<h3>"+data.title+"</h3>").appendTo(spec.gallery_id);
    
    var photo_info_url = "http://api.flickr.com/services/rest/"+
                    "?method=flickr.photos.getInfo"+
                    "&api_key="+spec.api_key+"&"+
                    "&photo_id="+ data.id +
                    "&format=json&jsoncallback=?";
    
    $.getJSON(photo_info_url, function(d){
      var desc = d.photo.description["_content"];
      desc = desc.replace(/\n/gi,"<br />");
      $("<p class='desc'>"+desc+"</p>").appendTo(spec.gallery_id);
    });

  }
    
  var init = function(){
    buildThumbs();
  }
  
  return {
    flickrUrl: flickrUrl,
    getThumbs: getThumbUrls,
    init: init
  }
  
}();

$(cx_generic.flickrPortfolio.init)
  
/*
buildThumbs()







loadPortfolioPage(1)

*/