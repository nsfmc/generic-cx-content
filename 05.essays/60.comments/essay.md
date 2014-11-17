title: the fifth kind of comment
-
metadesc: sure, you've seen good comments, bad comments, api comments, even some other mysterious fourth comment, but have you seen comments of the fifth kind?
-
content:

This morning while listening to [edge cases](http://edgecasesshow.com/111-here-be-dragons-style-comments.html), i was delighted to hear [wolf](http://twitter.com/rentzsch) talk about comments and how, as he's aged, he prefers really only two flavors of comments, API Comments/Documentation and [HC SVNT DRACONES](http://en.wikipedia.org/wiki/Here_be_dragons) comments.

Comically, he references wikipedia which contains [this gem](http://en.wikipedia.org/wiki/Best_coding_practices#Commenting) of a quote:

>Due to time restrictions or enthusiastic programmers who want immediate results for their code, commenting of code often takes a back seat. Programmers working as a team have found it better to leave comments behind since coding usually follows cycles, or more than one person may work on a particular module. However, some commenting can decrease the cost of knowledge transfer between developers working on the same module.

i want to focus on the first part of this statement because it's the most counterintuitive.

>Due to time restrictions or enthusiastic programmers who want immediate results for their code, commenting of code often takes a back seat.

At [work](http://www.khanacademy.org/careers), we have a slogan "[shipping beats perfection](http://bjk5.com/post/60760280107/shipping-beats-perfection-explained)" whose background is this other phrase, *[bias towards action](https://dschool.stanford.edu/groups/k12/wiki/548fb/Bias_Toward_Action.html)*, which, to be honest, i don't think i'd heard until this past week. 

## blah blah Worse is Better™[^wib]

The behavior we've adopted at work (and to be clear, khan academy is *not* unique in this practice) is to leave comments for the things you aren't able to get to right now. let me show you a 'for instance' from my super hacky [tumblr editor](https://github.com/nsfmc/stumblr) package:


    # TODO(marcos): what if this also fails?
    if more_info['meta']['status'] == 200:
        post = more_info['response']['posts'][0]
        # TODO(marcos): maybe check a pref for this
        webbrowser.open(post['post_url'])

there are two `TODO(marcos)` comments here and they map to things that i should, at some point get to eventually, but that aren't 'blocking' or 'stopships' or whatever. They're basically baby yaks that if i'm not careful, will develop into full grown yaks[^yakshaving] demanding my attention and shears.

[^yakshaving]: ![](@pathmalcolm-in-the-middle.gif)

or more recently, this past week, while i playing with Framer:

    // TODO(marcos): use cycle here
    var collapsed = true
    scrubBG.on(Events.Click, function(){

        if (collapsed) {
            // TODO(marcos): instead of just unclipping the layer
            // animate the text in separately

And, to be clear, the code works! Right now! it's just that *if* i ever want it to work better, i have already outlined a roadmap for myself on how to do that. The framer code is *by definition* a prototype, so let's be honest, who cares if i'm using `cycle` correctly, but my intuition to Do The Right Thing™[^dtrt] is the sort of yak that could have wasted precious prototyping time.

[^dtrt]: i'm pretty sure spike lee never thought his movie would ever be referenced so often in terms of software engineering discussions

These todos, in the context of both projects, were basically the software development equivalent of a "[sweep](http://www.43folders.com/2006/07/24/b2gtd-mind-sweep)" in gtd[^gtd]. On my end, i've accomplished this minor goal of having explained what i need to do, even if i haven't done it yet. By leaving it as a `todo`, i can more clearly work out the problem at some later point rather than investing time in writing possibly unneccessary code. In the present day, though, it gets me unstuck and moves me forward.

[^gtd]: gtd™ is copyright DavidCo 2001

The novelty here, the point where this ties back to the quote, is that this is actually *the opposite* of the problem outlined in the wikipedia article. In my vim to get towards a working solution, i'm actually leaving important implementation and polish related comments for myself (and others) so that i can address it better... but only once i have something that actually merits fixing.

Again, i want to repeat the central idea here which is that *comments don't have to take a backseat to getting things done*. In fact, i hope i've shown that, comments can provide a relatively easy way to get you from "zero to working" while providing a legitimate roadmap for you to get to something sustainably developed in the future. this isn't about minimal viable products

A nice 'workflow' side effect of this approach, btw, is that i can still do the git-ish thing of one-commit-per-idea and further i can usually then pick off future single tasks by grep'ing for `TODO(marcos)`.

## a slight caveat (emptor)

So this sounds great, right? but when do you add a TODO and when do you add actual code? I'm sorry to say that i don't know. I have a spider sense for some species of yaks that i have shorn before, but there are countless others that i haven't encountered yet.

For the ones i haven't seen before, if i'm at a loss to write code to solve the problem, i google for a solution and if i can't turn up something easily, i'll stub out the data structure that i expect or create a conditional variable that i can toggle easily or something like that and leave a todo for myself. When i (often) don't even know what question i would ask google, i usually try to find human help, but i still leave a TODO in that spot until i have some solution or greater insight on my hands. 

So often, the methods i write are so trivial, so easy to parse, that often i can get away with the whole faux literate programming approach. i can write out a set of comments outright of what i expect to happen, what i need to do in broad strokes, i can add stub functions and stub properties and so forth and begin populating them until i have fleshed out my tiny slice of a program. When i have trouble doing that, it is often a sign i haven't thought through the problem well enough.

Naturally, your mileage will vary.


[^wib]: Briefly, if you avoided that link soup but still want to click on a much larger philosophically loaded link, the idea is effectively '[worse is better](http://www.jwz.org/doc/worse-is-better.html).' In our case, it's often more problematic to indefinitely hold back a feature that can have a measurably better effect because "it's not totally polished." And most importantly, it's an acknowledgement that getting bogged down in details doesn't necessarily get you any closer to the end result, and at worst, gets you much farther from it. This isn't a hard and fast truth, some things *do* deserve more time, more attention, more care and craft. It's up to you, the reader, to determine which things merit that in favor of shipping a benefit to others *now.* I don't know of a good way to explain when that's an appropriate choice to make because *it totally depends on your situation.*
