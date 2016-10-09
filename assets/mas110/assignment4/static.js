init_rand = Math.random();

pos = document.cookie.indexOf("rand=");
if(pos != -1){
  start = pos + 5;
  end = document.cookie.indexOf(";",start);
  if(end == -1) end = document.cookie.length;
  var val = document.cookie.substring(start,end);
  rand = unescape(val)
}else{
  rand = init_rand;
  document.cookie = "rand="+rand+
                    ";path=/;domain=mit.edu";
}
if(rand < 1/3){
  img = "michelle.jpg"
  name = "michelle"
  stolen = "http://www.mit.edu/~blihua/mas110/assignment3/michelle.jpg"
  blurb = "<p>I've talked to michelle before. We struck up a conversation outside of class once.</p><p>once.</p><p>I'm sure i sounded like a real dope.<br /><em>stupid stupid stupid!</em></p><p>She's a senior. I mean, I'm a senior <em>too</em>.</p><p>Course 4 <em>and</em> 15... i wanted to do something like that once, but i couldn't hack it.</p><p>you know. i'm probably wasting my time. She probably doesn't even remember me.</p><p>i bet she never even looks at me.</p>";
  helloblurb = "<p><em>I shouldn't do this. She doesn't even remember me.</em></p><p>What do you think? I get the feeling that this is a waste of my time.</p><p>I <em>know</em> that i should just do it, but what if she doesn't even remember me. I don't even remember what i told her the last time. I do that a lot, i forget what i tell people. What if she thinks i'm a big faker?</p><p>Hey Michelle, how's it going? Remember me? We were talking the other day outside of class. How are you?</p>";
  sub = 1
}else if(rand > 1/3 && rand < 2/3){
  img = "adrienne.jpg"
  stolen = "http://www.mit.edu/~tstern/mas110/assignment3/adrienne.jpg"
  name = "adrienne"
  blurb = "<p>Look at her.</p> <p>You can see it in her eyes. That intensity.  <em>she must live in Bexeley</em> you say. It radiates from her. You'd stop looking if you could.</p> <p>i could say a lot, but i don't have to. Those hip frames expose her MAS tendencies, but inside, she dreams of course six.  Who knows what <em>else</em> she's keeping from us.</p> <p>Freshman year goes by so quickly.<br /> What'll she decide?</p> <p>Adrienne? Is that French? So artistic and intellectual...</p> <p>Do you see her too?</p>";
  helloblurb = "<p>I'm so nervous. You can tell i'm nervous, why am i telling you.</p><p><em>What am i nervous about, i don't even know her.</em></p><p><em>Ok, just go up and say it. you've done it before. you can do it this time.</em></p><p>You know what this is like, don't you. It's like you're paralyzed. You'd go up and say something but you're afraid of what'd happen if you did.</p><p>Hi Adrienne, i'm marcos, we're in group A together.</p>";
  sub = 2
}else if(rand > 2/3){
  img = "moiracomp.jpg"
  stolen = "http://web.mit.edu/thinker/www/mas110/assignment3/moira.jpg"
  name = "moira"
  blurb = "<p>I know. I know. I just couldn't stop looking at her hands.</p> <p>Moira... that's her name, you know. she's a junior. it was the first time she'd been to tosci's. It was our first time... you know, i really had fun last night...we must have been there hours.</p> <p>She wants to major course 21... 21E or 21S, but she's not sure if it'll work out.</p> <p>I know she's been seein' someone for two years, but...<br /> <p>look, i don't know how much i should be telling you. she's not real into having stuff about herself on the internet.</p> ";
  helloblurb = "<p>I feel like i've built this up too much, i mean, <em>I know you don't want to hear this, maybe you do. Look, i've been thinking a lot...</em></p><p>I don't know, it's too hard for me to do this.</p><p>even though i don't look it, i'm really shy. I have a hard time going through with stuff like this.</p><p>Hello Moira, i had a great time at toscis.</p>";
  sub = 3
}

problem1 = function(){
  document.getElementById("subject").src = img
  document.getElementById("intro_text").innerHTML = blurb
  return false;
}
problem4 = function(){
  document.getElementById("subject").src = stolen
  document.getElementById("intro_text").innerHTML = helloblurb
  return false;
}
