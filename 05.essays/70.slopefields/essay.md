title: fun with vector fields
-
codelang: javascript
-
metadesc: i hardly remembered anything about slope fields until i deployed them to make khan academy's learnstorm announcement.
-
metaphoto: @pathJqQO.png
-
content:

A while ago, we needed to send out a notification to all our [LearnStorm](https://www.khanacademy.org/learnstorm) winners inviting them to the Finals event in Mountain View. It's a big deal! Only *200 Students* from all of the bay area got invited to the event and because most of them were under 13, we couldn't email them.

So instead, I dropped a big banner on the site the next time they visited.

## what'll it look like?

If you haven't seen it, you are about to discover that the [slope field](https://www.khanacademy.org/math/differential-equations/first-order-differential-equations/differential-equations-intro/v/slope-field-to-visualize-solutions) motif is the heart of learnstorm's identity.

![](http://dl.dropboxusercontent.com/u/406291/Screenshots/JGuX.png)

But wait a second... math??? we can't even [center a div](http://howtocenterincss.com), how can we possibly do anything with slope fields?

Actually, let's step back a second: what *is* a slope field?

### a math detour

A slope field is basically what it claims to be: the slope of a differential equation calculated at periodic points on a plane. And differential equations only express *the feel* of an equation, not exactly what it looks like because they're missing several constant values.

So for a plain ol' circle (y^2 + x^2 = 1), you have *y' = -x/y + c* (which you could find via implicit differentiation), but again' all that's saying is that the slope for this differential equation at *any point* is the x value divided by the y value times negative one plus some arbitrary c (which, for us, we'll just pretend is zero).

And when we want to draw this, we don't actually want y', we really want whatever *direction* y' corresponds to so that we can figure out where a triangle is pointing. With a simple equation like y' = -x / y , we're going to run into this problem where for zeroey y values we have infinitely positive or negative y' and what do you do with that?

Well, `Math` to the rescue! Specifically the standard [atan2](https://en.wikipedia.org/wiki/Atan2) method which returns the angle in radians (from the origin) for the point at (x,y). It's a special function which calculates the arctangent *but* is smart enough to compensate for zero denominators in pretty much the same way you would (because it takes the denominator as an argument).

Looking at the `atan2` implementation, you find that it does the kind of "intuitive limit-ey division" that you're often asked to do in the first weeks of a calc class. Instead of `NaN` you get ±π/2 and instead of 0 you get 0 or π. It's great! and it's *exactly* what we need because for a given x,y pair, you get exactly the corresponding radian value.

And you'll recall, we have a diff eq that is given by y' = -x/y, we can use atan2 to find the slope of each point on the plane. Ok, we know how we might this, now we just need to get started actually drawing it.

## Prototyping

The first step of prototyping this was a small script that i wrote using [PlotDevice](plotdevice.io), a python-based drawing application i'm real fond of. Take a look, you might like it!

But first things first: I needed to be certain that I could fake out the learnstorm identity; at the very least, if I began to run out of time, i could, at the very least, use a static (but novel) image as the background for the banner.

![a first sketch with nodebox](http://dl.dropboxusercontent.com/u/406291/Screenshots/HB9P.png)

Well, this is looking promising! But now i have a small problem: how do i animate this?

Stepping back, let's do a small crit here: part of what makes the learnstorm identity cool is that you get this round vibe *even though* everything is stuck on a grid. Breaking the grid in this case would not only require me animating each dart but animating them along circular paths which, i mean, would look *awesome* but... umm... let's save that for LearnStorm 2016...

And because we're already in the bay area, let's take advantage of this moment to visibly Pivot. We already have a sort of infrastructure for generating slope fields, but the problem is that i want something i can easily animate. Time for a new differential equation!

Maybe we can just make something up, something real easy, like...

    y' = x + y

and if you plot this out correctly, you end up seeing something like this:

![](http://dl.dropboxusercontent.com/u/406291/Screenshots/sdKS.png)

but say you make a mistake (who does that?) and remove that super convenient `atan2` we just learned about, you get something... *interesting.*

![](http://dl.dropboxusercontent.com/u/406291/Screenshots/4TcL.png)

because what's happening is that if you pick a row or a column, you find that the values are monotonically increasing but at a slightly different starting point and because the atan2 isn't around, the darts just continue rotating and rotating...

Ok, so now we have a moderately intriguing slope field which, let's be honest, isn't a *true() slope field at all.

So, back to our project: how do we animate it? Well, the neat thing again is that if you walk along the y axis (or x axis) every dart will rotate however much you moved. So if you start with the darts on a grid and tell they all moved just a little in one direction, they *all* rotate just a little bit more counterclockwise, like so:

<iframe src="http://gfycat.com/ifr/LinearWideeyedHorsefly" frameborder="0" scrolling="no" width="600" height="200" style="-webkit-backface-visibility: hidden;-webkit-transform: scale(1);" ></iframe>

Which is great and hypnotic. But how do we incorporate this into the announcement banner?

My first instinct was animated gif: but the gifs ended up being multi-megabyte monstrosities and movies no better. Even the gyfcat embed up a few paragraphs ago is, at worst, 4M and, at best, a 400k webp movie. and the quality... let's just say, not the best. Let's be honest, this is not a very complicated thing! it's just a bunch of triangles rotating round and round and...

## wait a minute

So instead of actually rendering some background image and scaling it up, why not actually *animate* background elements using a little something you may have heard of called [Dynamic HTML](http://en.wikipedia.org/wiki/Dynamic_HTML).

Here's how I would roughly do it: i would use a single dart image, lay out a bunch of them on a grid and then rotate them with css. And then i would use css to start each dart's animation at, say some radians value and rotate 2π radians over some fixed time scale.

But because (please correct me on hn) there's no easy way to create a css animation with arbitrary start/end points and because it would be especially wasteful to specify a new animation starting at some radian value going a full 2π for all radian values, i instead opted for a more, shall we say, lo-fi approach.

I would have each dart use the same 2π rotation animation, but I would set each dart's animation delay to achieve the same effect.

Then, I would set this field of spinning darts on some z-index below the actual html notification.

## implementing this

My [first attempt](https://gist.github.com/nsfmc/fc241d6f97a4b3b5203d/95b38bcc9707128c2b1d0501d22f48d070eea036) did something comical: because i had already generated the animation above as part of my testing, i printed the starting rotation for each dart and saved that as a json array which i loaded directly into a small react template yielding something approximately like the


    ...
    var dartRot = [0, 0.234, 0.469, ..., and lots more, ...]
    ...
    for (var i=0; i < dartRot.length; i += 1){
      style = { animationDelay: dartRot[i], ..., };
      return <dart style={style} />;
    }
    ...


I iterated over all the values and then used that to set the animation delay. My goodness, how ridiculous! That's basically as bad as writing out all those css animations one-by-one.

Instead, I took until the next morning to realize that i could do something less ridiculous:

    ...
    var GRID_SCALING = 4.27;
    for (var x=0; x < dartCols; x += 1){
      for (var y=0; y < dartRows; y += 1){
        style = { animationDelay: (x+y)/GRID_SCALING, ..., };
        return <dart style={style} />;
      }
    }
    ...


And the nice thing here is that not only is the code less packed with magic arrays, it's also wayyyyyy more obvious what's going on here. Even setting the x/y positions (*not shown*) in the style object is more obvious and you end up having code that allow you to think in terms of a unit grid but render elements by twiddling the knobs of your various scale factors.

And the (post-rationalized) cool thing about this is that the animation appears to stagger into being. Everything initially starts off pointing to one direction only to eventually fall in line at some point along the animation delay.

## lessons learned

Well, aside from the fact that it's fun to use math to make cool notifications, the main lesson (i think), is that by thinking in terms of parametrizing early on, you can easily come up with neat ways of procedurally generating animations later on.

Part of this was definitely embedded in the early prototyping and differential equation soul searching.

In this case, although the animation was implemented using react , this is the sort of thing that you could do with anything else like d3 or even good ol' jQuery.
