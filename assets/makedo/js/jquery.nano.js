/* Nano Templates (Tomasz Mazur, Jacek Becela) */

(function($){
  $.nano = function(template, data){
    return template.replace(/\{([\w\.]*)}/g, function(str, key){
      var keys = key.split("."), value = data[keys.shift()]
      $.each(keys, function(){ 
        trace(this)
        if (value.hasOwnProperty(this)) value = value[this] 
        else value = str
      })
      return value
    })
  }
})(jQuery)