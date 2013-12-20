title: private use
-
content:

this isn't an essay, it's more like a journal. i'm putting things in here that i find interesting and i try to string them together. i will probably update this over time, it will change as i learn more but i will try to keep the learning-spirit of it present.

> the Private Use Areas are three ranges of code points (U+E000–U+F8FF in the BMP, and planes 15 and 16)

-- [Private Use Area (unicode)](puawiki)

I did the math and realized that's 137,469 possible glyphs. That's a lot of glyph.

Here [at work](http://www.khanacademy.org/), I'd been trying to rationalize our use of various icons and so forth. But how? It's challenging because we have icons that are ka-specific but we also like having things like [fontawesome](http://fontawesome.io) around.

A while back, I made the decision to fork fontawesome so we could add in a few superfluous glyphs. [Lots of peolpe do this actually](https://github.com/FortAwesome/Font-Awesome/network) but, maybe i'm missing something because I don't hear very much about it or their experiences forking an open source icon font.

## what's the big deal?

The main challenges, as far as i'm concerned, at least as far as this all goes, is that when you're forking a stable project, you're creating some cognitive dissonance for your team who are already used to using the upstream version. Second, you're making a conscious decision to ignore or absorb upstream changes. Third, you may be trying to find a way to keep your project merging safely with the upstream project's.

Iconfonts are a strange beast because (unlike most text faces) they have the capacity to be [incredibly modular](http://icnfnt.com/), but the tooling around them does not encourage it. And you basically have four options: fontlab, fontforge, glyphs, and robofont (to say nothing of fontographer and type tool), all of which natively use a different file format.

## and why, again?

At the time i had two goals: add extra glyphs to the font and change fontawesome's `[class="icon-*"]` selector so that it cost us less per-page-load. It turns out the selector change landed in 4.0, so at least i didn't spend too much time on that. But the issue of adding new glyphs remained legitimate.

The secondary benefit, which i hadn't considered at first, but which now seems quite legitimate, is reducing the glyph count. Of my earliest experiments when beginning this process, was seeing how many font-awesome glyphs we used. Here's some handy shell incantation you can use to figure this out for yourself

    ack -ho "(?:[\" ])(icon-[a-z\-]+)" --html | \
    sed 's/.\(.*\)/\1/' | \
    sort | \
    uniq

if you have looked at fontawesome recently, you will find upwards of 350 glyphs in use. do you need all those? clearly services like the (mostly) disemvoweled [icnfnt](http://icnfnt.com/) are aware of this disconnect, but naturally a question is how to generate a version of the font with the above information without having to bother with clickity clicking a website.

## generating a font

by far the easiest way of going about this is by running the Generate Font action that every font editor has available.

## the pua

in case it's not obvious, it's quite common to work with the pua, the good folks at [SIL](http://scripts.sil.org/cms/scripts/page.php?cat_id=UnicodePUA) document their use of it (mostly so others can understand how they've assigned ideographs and symbols)



[puawiki]: http://en.wikipedia.org/wiki/Private_Use_(Unicode)
