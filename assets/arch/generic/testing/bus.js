bus85 = [[6,05,"AM"],[6,30,"AM"],[7,00,"AM"],[7,30,"AM"],[8,05,"AM"],[8,40,"AM"],[9,20,"AM"],[10,00,"AM"],[10,40,"AM"],[11,20,"AM"],[12,05,"AM"],[12,50,"AM"],[1,30,"PM"],[2,10,"PM"],[2,50,"PM"],[3,30,"PM"],[4,10,"PM"],[4,50,"PM"],[5,30,"PM"],[6,10,"PM"],[6,50,"PM"],[7,20,"PM"]]

/**
 * nextBus takes an array of times and returns 
 * the time that most closely follows the current time.
 * If none is present, false is returned.
 * @type Date
 * @params  sched a schedule of [hr,min,"AM|PM"] tuples
 * @returns Date or false
 */
function nextBus(/*Array*/sched){
  for(var i =0; i < sched.length; i++){
    var c = new Date(); var d = new Date()
    var ih = sched[i][0]; var m = sched[i][1]; var post = sched[i][2]
    var h = (post == "AM") ? ih : ih +12;

    d.setHours(h); d.setMinutes(m)
    var delta = c-d
    if(delta <= 0){
      output(delta/60000);return d}
  }
  return false
}
//nextBus(bus85)

/**
 * parseTime takes a time like "12:30am, 7:55pm"
 * and returns the current day's date object with
 * that time set.
 */
Date.prototype.parseTime(/*string*/ time){
  //12PM == 1200
  //12AM == 0000
  var hmsRe = /(
                [\d]{1} 
                  (?=\D*\d\d(\D+|\b)) 
              | [\d]{2})
             /g
  var modRe = /[A-Za-z]+/g
  
  var timeArr = time.match(timeRe)
  var mod = time.match(modRe)[0].toLowerCase()
  var ih = timeArr[0]
  var h = (ih > 12 || mod == "A"
  this.setHours(timeArr[0]); 
  this.setMinutes(timeArr[1])
}
