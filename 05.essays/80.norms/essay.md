title: what you don't know
-
metadesc: why does empathy from a computer feel so discomforting in practice?
-
localmetaphoto: @pathjUQA.png
-
content:


> If a bridge sways and falls, we can diagnose that as a failure, fault the engineering, and try to do better next time. If Google shows you these 11 results instead of those 11, or if a hiring algorithm puts this person’s résumé at the top of a file and not that one, who is to definitively say what is correct, and what is wrong? Without laws of nature to anchor them, algorithms used in such subjective decision making can never be truly neutral, objective or scientific.

<!-- more -->

> Programmers do not, and often cannot, predict what their complex programs will do. Google’s Internet services are billions of lines of code. Once these algorithms with an enormous number of moving parts are set loose, they then interact with the world, and learn and react. The consequences aren’t easily predictable.

via [zeynep tufekci](http://mobile.nytimes.com/2016/05/19/opinion/the-real-bias-built-in-at-facebook.html)

when i was in college, my [system design class](http://web.mit.edu/6.033/www/) devoted a section of reading to looking at large scale systems and one of the fun ones at the time (2005) was google's mapreduce which was designed both to make parallelism accessible and make the most of commodity hardware, as you can see in the [mapreduce paper's abstract](http://research.google.com/archive/mapreduce.html):

> Programs written in this functional style are automatically parallelized and executed on a large cluster of **commodity machines**. The run-time system takes care of the details of partitioning the input data, scheduling the program's execution across a set of machines, **handling machine failures**, and managing the required inter-machine communication. This allows programmers without any experience with parallel and distributed systems to easily utilize the resources of a large distributed system.

> Our implementation of MapReduce runs on a **large cluster of commodity machines and is highly scalable**: a typical MapReduce computation processes many terabytes of data on thousands of machines. Programmers find the system easy to use: hundreds of MapReduce programs have been implemented and upwards of one thousand MapReduce jobs are executed on Google's clusters every day.

Emphasis mine because, the meaning may now be coded, but at the time, the whole point of using the phrase "commodity machine" implied "this computer could barely gurantee an sla if its life depended on it" and "woe be unto the fools paying the lavish costs for sparc/dec/ibm/etc servers running commercial bsd/vax/irix/etc." Because the whole crux is that mapreduce is still victim to the peasant ails of _commodity machines_ but it does the best it can to insulate you from catastrophic failure (and performantly!) while returning usable results.

There was a moment while we discussed the paper where we had this cute illustration, i'll do my best to explain it since it's basically a funnel: there was The Cloud™, it represented all possible data on the internet. A subsection of that cloud was the amount of the public-facing internet that google had indexed. A subsection of that cloud was the entirety of the results _google knew about_ for your given query. And finally, a subset of that cloud represented the results of your query that had survived the search job* either due to timeouts/latency/commodity hardware/solar flares/etc. (*map-reduce was, at least then, not actively what was used for search, but it's a good enough proxy for the behavior of a large fault-tolerant system that may favor partial output to no-output)

The point being that for almost all queries, there was likely impossibly large number of results for the _specific thing_ you were looking for and (improbably) the least novel thing was getting your search results quickly. but crucially, mapreduce dealt with the issue of a result not showing up because you, as internet user, _just have absolutely no clue_ how many of the results could be of any actual value. So what if pages 4-6 of the Total Results don't show up? Do you even go that far? _Would you notice?_ (at the time, and still today, people tend to not look past the first page of results). Even if one or two links are missing, you still get most of the relevant data back (better than nothing).

When the number of results for your query is in the tens of thousands, does it matter if 4500-4520 are missing (or even just slightly misordered)? You may scoff, but this is a legitimate question! If it matters, much like a tree in the woods, does it matter if you never look at the results (or are statistically unlikely to look at them). Does it matter if the results are correctly ordered the next time you reload the page?

This is not to say that there isn't bias in google's search result algorithm (it thankfully is biased against some kinds of harmful content), but that there is a belief that _any result is better than no result._ (not unreasonable, in my opinion)

Facebook's lee byron (in a [very interesting post about building a feed](https://hashnode.com/post/architecture-how-would-you-go-about-building-an-activity-feed-like-facebook-cioe6ea7q017aru53phul68t1/answer/ciol0lbaa02q52s530vfqea0t)) makes the following observation about the benefits of [lazy-loading](https://en.wikipedia.org/wiki/Lazy_loading) a dataset presented to somebody browsing a feed.

> **How many followers will the most popular content sources have?**

> Twitter used to call this the "Bieber problem": when he tweeted, a fan-out operation occurred, placing this new tweet into the feeds of every one of his followers which was a massive job that locked up whole machines. In Twitter's earlier years, a couple quick @justinbieber tweets in a row could "fail whale" the whole service.

> The "Bieber problem" is an illustration of a critical decision of the architecture of a feed service: do you build a user's feed at write time or at read time? Twitter's architecture placed tweets into feeds as soon as they were written into the service. By contrast, Facebook's architecture waits for a user to read their feed before actually looking up the latest posts from each followed account.

>...

> Should the story at the very top of your activity feed be the very most latest thing that happened, or should it be the very most interesting thing that happened? This is more of a product decision than an architectural one, but it has serious implications on your feed architecture.

I would argue that he understates how much a archituctural choices can _retcon_ their way into product decisions. If a tweet is deleted from my feed as i'm reading, can i really be all that angry? "Who's right" in this case aligns with the moral quandry of the probabalistically failing google mapreduce server: if @justinbieber tweets but you're not looking at your timeline, does...?

A similar bit of architectural-influenced thought recently surfaced in a post from tristan harris, [a google design ethicist](https://medium.com/@tristanharris/how-technology-hijacks-peoples-minds-from-a-magician-and-google-s-design-ethicist-56d62ef5edf3#.numxml2vr)

> For example, imagine you’re out with friends on a Tuesday night and want to keep the conversation going. You open Yelp to find nearby recommendations and see a list of bars. The group turns into a huddle of faces staring down at their phones comparing bars. They scrutinize the photos of each, comparing cocktail drinks. Is this menu still relevant to the original desire of the group?

> It’s not that bars aren’t a good choice, it’s that Yelp substituted the group’s original question (“where can we go to keep talking?”) with a different question (“what’s a bar with good photos of cocktails?”) all by shaping the menu.

>Moreover, **the group falls for the illusion that Yelp’s menu represents a complete set of choices for where to go.**

which, emphasis _mine._ and while i feel less morally pigeonholed by my phone (or yelp), and i believe that tristan believes that people ought to be empowered by theirs, i really don't know that i am actually perturbed by yelp's incomplete view of the universe (further, i'm not sure i want yelp _asking me_ why i feel compelled to visit a bar right now (and if we're being honest, i don't know that self-improvement aside, others would either)).

I'm reminded of this [classic 'quote' from magician Teller](http://www.smithsonianmag.com/arts-culture/teller-reveals-his-secrets-100744801/?no-ist=&page=2) about magic:

> If you are given a choice, you believe you have acted freely. This is one of the darkest of all psychological secrets.

and again from tristan

> We don’t miss what we don’t see.

I don't believe that any programmer (or ethicist) at google (and, from the way he writes, those at facebook), would pretend that the behavior of their algorithms remain constant (as we nerds would say, are idempotent) each time they're run. The behavior of a feed or a search result page is the hybrid product of an architectural performance optimization, the whims of the hardware on a given day, solar flares, and hosts of other reasons, some of which are product/business-oriented.

Which, again, i want to return to that first excerpt from zeynep's piece:

> If Google shows you these 11 results instead of those 11, or if a hiring algorithm puts this person’s résumé at the top of a file and not that one, who is to definitively say what is correct, and what is wrong? Without laws of nature to anchor them, algorithms used in such subjective decision making can never be truly neutral, objective or scientific.

> Programmers do not, and often cannot, predict what their complex programs will do.

This is similar to people who trust that digital archives are some kind of panacea but don't realize that digital data (unless archived on [resiliant physical media](http://group47.com/what-is-dots/)) is subject to corruption, bit flips and other sundry damage (although the physical copy has its own problems).

![was this photo... backed up?](https://dl.dropboxusercontent.com/u/406291/Screenshots/jUQA.png)

to claim that a system that gracefully tolerates hardware failure exhibits a bias is 100% true, and certainly there are many other biasing factors at work in any of these systems (which, [see the depressing end of the spectrum](https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing)). It also gives the laws of nature an easy pass—what does it mean to have a law of nature anchor a search result? Do we choose a system that behaves predictably at the expense of convenience? Certainly the decision to "show the truth" vs "show a good approxmation" is an ethical one, but how big of one is it? When does data-center latency become ethically fraught? What sorts of disclaimers do services need to furnish us with? What about our friends?

When you ask yelp for a bar and it suggests a park, what sort of moralistic puritanic editorializing is that? also, how do you know it's _not_? when a hardware failure prevents you from seeing a retweet for a minute (but lets you see the rest of your feed), what _kind_ of bias is that? Why are we so offended (and scandalized!) when we're presented with the equivalent of a white lie? Is it because we don't know the reason behind it? Is it because it exposes the nature of our relationships with these services?

---

Some other unstructured thoughts:

My system design class also introduced another article about the [Therac 25](http://sunnyday.mit.edu/therac-25.html) that left many in the class somewhat scarred. For many of us, the short-term takeaway was "thank god i don't have to write medical firmware," but you see the moral fallout of the therac [if you peek at any code or system](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/) for any appreciable length of time.

I see this argument quite often that engineers have it easy because physics and statics can be modeled in a predictable way. When bridges fall due to hardware failure or poor design (or freak accidents!) _people can die._ When your CRUD application gracefully handles a backend failure and rolls back an optimistic ui update, i don't really know what to tell you. I don't really think they're really on-par, to be honest.

I also think it's strange that the counterpoint to dumb ml-algorithms are suggestions which seem to defeat the purpose of the relevant platform (and often with a very waspy bent!): i want a popular bar (have you tried a park?). I want to see what my friends posted (are you being challenged enough?). I want some search results (who is john galt?).

I'm not going to defend google or facebook, both of whom have had significant issues due to their scale and the tragic effects of systems applied to a heterogeneous world. but it goes without saying that it's problematic to treat their unintended consequences like a therac-25's (which, again, [read this troubling article](https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing)) when they are much more like a highly opinionated video store employee that reads you and then suggests a movie they're not really that into, but think you'd probably like. Even when google and friends get it wrong, we aren't often talking about damage on par with the effects of shoddy bridge (or car) engineering.

Do we need transparency in how google or facebook make decisions about our newsfeed? that's a good question! should we have transparency as to why my server is upselling today's special appetizer? should i ask the record store employee what cultural basis grounds all the recommendations they give me? Or should we regulate that instead? Should a sales person be required to tell me up-front they work on commission?

---

I'll close this out with a thought on google glass. I still believe that google glass' failure wasn't a foregone conclusion, but it _was_ poorly socialized. There were absolutely _no norms_ around it and so it became odd to see people taking it to the extreme as users and other folks assuming the worst when going about their day. It was too many new things at once.

w/r/t services, i am not going to cop-out and say "you don't have to use it," but i mean, that's still true.

For many of us that have used some form of irc/icq/aim/zephyr/jabber/etc for upwards of 20 years, the norms around slack communication feel oddly formal compared to prior systems which felt truly asynchronous (often responding to a message 12 or 24 hours later). The pitch "slack is the email killer" subconsciously migrates social expectations from email (attentiveness, timely replies) to the norms of irc or im (not all messages need an ack). That's also under-selling the issue, but it's definitely part of it. Do workplaces that caveat 'important things need to be emailed' experience the same level of slack-anxiety? most workplaces eventually establish norms around communication, but it feels like slack gets left out, which has caused its own set of problems.

i talk about norms because when we go to a restaurant, _we know_ why our server is upselling us. When our friends tell us to skip the bar, _we understand_ the reason behind the diversion. We have built up norms around these sorts of social situations: servers want to sell specials and perform well (and depending on the establishment, pad out their tip), our friends may no longer be drinking, or maybe their throat hurts from shouting at last night's bar or whatever.

But what are the societal norms around the apps we use? Well, we've been around long enough now to see at least one and a half dot-com busts and we've been witnessing the effect of companies who put off monetization for easily five to ten years now. Still, each time we act offended when we discover that these free apps are also working to earn their investors and employees a buck.

As a field, we designers spend a lot of time talking about how to design with empathy and grace. but i suspect the problem is partly that people expect apps to behave like utilities, idempotent and steely-eyed in their execution, and are discovering there's something strange about our landlord or our electric company talking to (and empathizing with) us like our best friend and then shaking us down for extra money when the conversation takes a turn.

