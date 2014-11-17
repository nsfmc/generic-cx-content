title: the fifth kind of comment
-
metadesc: sure, you've seen good comments, bad comments, api comments, even some other mysterious fourth comment, but have you seen comments of the fifth kind?
-
content:

This morning while listening to [edge cases](http://edgecasesshow.com/111-here-be-dragons-style-comments.html), i was delighted to hear [wolf](http://twitter.com/rentzsch) talk about comments and how, as he's aged, he prefers really only two flavors of comments, API Comments/Documentation and [here be dragrons](http://en.wikipedia.org/wiki/Here_be_dragons) comments. But sadly, he didn't mention the kind of comments i'm going to talk about here.

To begin, he cites [this gem](http://en.wikipedia.org/wiki/Best_coding_practices#Commenting) of a quote:

>Due to time restrictions or enthusiastic programmers who want immediate results for their code, commenting of code often takes a back seat.

At [work](http://www.khanacademy.org/careers), we have a slogan "[shipping beats perfection](http://bjk5.com/post/60760280107/shipping-beats-perfection-explained)"[^sbp] and it is much of the reason for this other kind of comment, which i will call *the unblocking comment.*

[^sbp]: its background is this other phrase, *[bias towards action](https://dschool.stanford.edu/groups/k12/wiki/548fb/Bias_Toward_Action.html)*, which, to be honest, i don't think i'd heard until this past week. It is, however, an interesting cousin of the more contentious Worse is Better™[^wib]

### the unblocking comment

The behavior we've adopted at work (and to be clear, khan academy is *not* unique in this practice) is to leave comments for the things you aren't able to get to right now so that you can unblock yourself. let me show you a 'for instance' from my super hacky [tumblr editor](https://github.com/nsfmc/stumblr) package:

<pre><code class="language-python"># TODO(marcos): what if this also fails?
if more_info['meta']['status'] == 200:
    post = more_info['response']['posts'][0]
    # TODO(marcos): maybe check a pref for this
    webbrowser.open(post['post_url'])
</code></pre>

there are two `TODO(marcos)` comments here and they map to things that i should, at some point get to eventually, but that aren't 'blocking' or 'stopships' or whatever. They're basically baby yaks that if i'm not careful, will develop into full grown yaks[^yakshaving] demanding my attention and shears.

[^yakshaving]: ![](@pathmalcolm-in-the-middle.gif), [which see](http://raganwald.com/2014/02/28/a-programmers-story.html)

or more recently, this past week, while playing with [Framer](http://github.com/koenbok/Framer):

<pre><code class="language-javascript">// TODO(marcos): use cycle here
var collapsed = true
scrubBG.on(Events.Click, function(){

    if (collapsed) {
        // TODO(marcos): instead of just unclipping the layer
        // animate the text in separately
</code></pre>

And, to be clear, the code works! Right now! it's just that *if* i ever want it to work better, i have already outlined a roadmap for myself on how to do that. The framer code is *by definition* a prototype, so let's be honest, who cares if i'm using `cycle` correctly, but my intuition to Do The Right Thing™[^dtrt] is the sort of yak that might have wasted precious prototyping time.

[^dtrt]: i'm pretty sure spike lee never thought [his movie](http://en.wikipedia.org/wiki/Do_the_Right_Thing) would ever be referenced so often in terms of software engineering discussions

These todos, in the context of both projects, were basically the software development equivalent of a "[sweep](http://www.43folders.com/2006/07/24/b2gtd-mind-sweep)" in gtd[^gtd]. In writing them, i've explained what i need to do (but i can't do right now), but i've absolved myself of the angst of doing it this very minute. 

By leaving the `todo()`, i communicate to others my intent to work out the problem at some later point rather than investing time in writing possibly unneccessary code. In the present day, though, it gets me unstuck and moves me forward towards a working implementation that i can nit-pick.

[^gtd]: A sweep, briefly, is this nifty idea where in order to be able to prioritize all the task you possibly have, you put everything you can think that might be a task into a task list. By moving all those ideas out of your head and into a place you're likely to look at later, you allow your mind to only wander to tasks that are relevant *now.* gtd® is [copyright](http://www.5by5.tv/b2w) DavidCo 2001. 

The novelty here, the point where this ties back to the quote, is that this is actually *the opposite* of the problem outlined in the wikipedia article. In my vim to get towards a working solution, i'm actually leaving important implementation and polish related comments for myself (and others) so that i can address it better... but only once i have something that actually merits fixing.

Again, i want to repeat the central idea here which is that *comments don't have to take a backseat to getting things done*. In fact, i hope i've shown that, comments can provide a relatively easy way to get you from "zero to working"[^mvp] while providing a legitimate roadmap for you to get to something sustainably developed in the future.

[^mvp]: although philosophically aligned, this is *not* going to devolve into an essay about minimal/[maximal](http://www.allenpike.com/2013/maximum-viable-products/) viable products. phew.

### a slight caveat (emptor)

So this sounds great, right? but when do you add a TODO and when do you add actual code? I'm sorry to say that aside from "does it run," i don't know any better than you. I have a spider sense for some species of yaks that i have shorn before, but there are countless others that i haven't encountered yet.

For the ones i haven't seen before, if i'm at a loss to write code to solve the problem, i google for a solution and if i can't turn up something easily, i'll stub out the data structure that i expect or create a conditional variable that i can toggle easily or something like that and leave a todo for myself. When i (often) don't even know what question i would ask google, i usually try to find human help, but i still leave a TODO in that spot until i have some solution or greater insight on my hands. 

So often, the methods i write are so trivial, so easy to parse, that often i can get away with the whole faux literate programming approach. i can write out a set of comments outright of what i expect to happen, what i need to do in broad strokes, i can add stub functions and stub properties and so forth and begin populating them until i have fleshed out my tiny slice of a program. When i have trouble doing that, it is often a sign i haven't thought through the problem well enough.

Naturally, your mileage will vary.[^workflow]

[^workflow]: A nice 'workflow' side effect of this approach, for me, is that i can still do the git-ish thing of one-commit-per-idea and further i can usually then pick off future single tasks by grep'ing for `TODO(marcos)`. I can also see if i stray too far at a given moment if i seem to be removing too many todos at a time (unless i'm deleting a file).

[^wib]: If you avoided that link soup but want to explore a decades old religious war, the idea is effectively '[worse is better](http://www.jwz.org/doc/worse-is-better.html).' In our case, it's more problematic to indefinitely hold back a feature that can have a better effect now because "it's not totally polished." Most importantly, it's admitting that getting bogged down in details doesn't always get you closer to the end result, and at worst, gets you farther from it. This isn't a hard and fast truth, some things *do* deserve more time, more attention, more care and craft. It's up to you, the reader, to determine which things merit that in favor of shipping a benefit to others *now.* I don't know of a good way to explain when that's an appropriate choice to make because *it totally depends on your situation.*
