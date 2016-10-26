    var head = document.getElementsByTagName("head")[0]
  
    /* 
     * creates link/css elements based on title, href and alt.
     * if alt is false or not specified, the stylesheet is specified as an
     * alternate stylesheet
     */

    function addStyle(title,href,alt){
      var type = "stylesheet"
      var prefix = prixFixe();
      var loc = prefix+"css/"
      href = loc+href
      if(!alt){type = "alternate "+type}

      var style = document.createElement("link")
      style.setAttribute("rel",type)
      style.setAttribute("type","text/css")
      style.setAttribute("href",href)
      style.setAttribute("title",title)
      return style
    }

    function prixFixe(){
      var depth = window.location.pathname.split("/").length
      var prefix = ""
      for(var i=6; i <depth;i++)  prefix += "../"
      return prefix
    }

    /* These are the available styles for the website */

    var styles = [
      ["Bauhaus","bauhaus.css"], 
      ["Classic","classic.css"],
      ["Sky","sky.css"],
      ["Centered","center.css"],
      ["Swiss","swiss.css"],
      ["Module","module.css"]]

    if(!preferred){
      var preferred = "Module"
    }

    function fixCssLink(){
      /*this fixes the link to the stylesheet css checker*/
      var pf = "http://web.mit.edu/thinker/www/css/"
      var csslink = document.getElementById("footer").getElementsByTagName("a")[1]
      var sf = ""
      for(var i = 0; i < styles.length; i++){
        if(styles[i][0] == preferred){sf = styles[i][1]}
      }
      csslink.setAttribute("href","http://jigsaw.w3.org/css-validator/validator?uri="+pf+sf)
    }

    pushOnload(fixCssLink)

    /* getting saved style information from cookie */
    pos = document.cookie.indexOf("cx_style=");
    if(pos != -1){
      /* if we get a cookie, we should use it*/
      start = pos + 9;
      end = document.cookie.indexOf(";",start);
      if(end == -1) end = document.cookie.length;
      var val = document.cookie.substring(start,end);
      preferred = unescape(val)
    }


    /*   Creating the stylepicker box
     */
    
    addStyleDiv = function(){
      var stylediv = document.createElement("div")
      stylediv.setAttribute("id","stylediv")
      var intro = document.createElement("p")
      intro.appendChild(document.createTextNode(
        "You can select the following css styles"));
      stylediv.appendChild(intro)
      var stylelist = document.createElement("ul")
      //stylelist.setAttribute("id","stylelist")
      var container = document.getElementById("intro_text")
  
      for(var i=0;i<styles.length;i++){
        /*   Add create an element inside of... the body that houses 
         * stylepicking options
         */
        var link = document.createElement("a")
        var li = document.createElement("li")
        var title = document.createTextNode(styles[i][0])
        link.setAttribute("href","javascript:setActiveStyleSheet('"+
          styles[i][0]+"')")
        link.appendChild(title)
        li.appendChild(link)
        stylelist.appendChild(li)
        
      }

      stylediv.appendChild(stylelist)
      
      container.appendChild(stylediv)
      
    }
    
  pushOnload(addStyleDiv)

    /* iterate over styles variable and append links to head */

    for(var i=0;i<styles.length;i++){
      var enable = (styles[i][0] == preferred) ? true : false
      head.appendChild(addStyle(styles[i][0],styles[i][1],enable))
    }

    /* switch the stylesheet with title to active and others to alternate */

    function setActiveStyleSheet(title) {
      
      var links = document.getElementsByTagName("link");
      
      var i, curr;
      
      for(i=0; curr = links[i]; i++) {
        
        if(curr.getAttribute("rel").indexOf("style") != -1 
                          && curr.getAttribute("title")) {
          
          curr.disabled = true;
          
          if(curr.getAttribute("title") == title) 
            
            curr.disabled = false;
        
        }
      
      }
      document.cookie = "cx_style="+title;
      //alert(document.cookie)
    }

    /* pushOnLoad adds a procedure to the window.onload event without 
     * removing other events that may have already been put there.
     */
     
    function pushOnload(/* function */ proc){
      if(window.onload){ 
        var orig = window.onload
        window.onload = function(){ orig(); proc(); }
      }  
      else{ 
        window.onload = proc 
      }
    }

    
    /* pushOnUnload is like pushOnLoad, it safely adds proc to the things 
     * you already want to do when onunload is called
     */
    function pushOnUnload(/* function */ proc){
      if(window.onunload){ 
        window.onunload = function(){ window.onunload(); proc(); }
      }  
      else{ 
        window.onunload = proc 
      }
    }
    
    
    /* these are google adSense variables */
    google_ad_client = "pub-9458917282862072";
    
    google_ad_width = 468;
    
    google_ad_height = 15;
    
    google_ad_format = "468x15_0ads_al";
    
    google_ad_channel ="";
    
    google_color_border = "CCCCCC";
    
    google_color_bg = "FFFFFF";
    
    google_color_link = "000000";
    
    google_color_url = "666666";
    
    google_color_text = "333333";