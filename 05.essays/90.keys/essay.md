title: keys
-
metadesc: discovering that vsco keys was abandoned and turning it into a design project
-
content:

## what's going on

In what is likely to be the ultimate yak, i recently discovered that the [vsco keys](https://vsco.github.io/keys/) app was open sourced. I don't think i was ever the app's target demographic, but it's an interesting tool that assigns lightroom actions and presets to keyboard keys so you can speed up your photo editing workflow. It had a webapp that generated keymap configs that you could import back into the main client.

So what? it got open sourced. it was a bigger support drain than it was a profit center, so it's understandable, but when an app goes open, you get to learn all sorts of things about the decisions people made when developing an app. In my case, i have a clear plan: i want to fill the gaps that are currently missing for keys (primarily because it is a fun design challenge) but the process to get there is totally an exercise in archaeology and trying to understand an application i never got to use.

So this is going to be a journal in something like five parts:

1. The config/savefile format
1. The webapp that generates keymaps
1. Designing around my dvorak life
1. The os x application
1. The lightroom plugin

Almost every application that deals with keypresses also just assumes that you're using qwerty and not, say, dvorak or colmak. Few apps are good at dealing with this. Starcraft 2, for instance, can detect your keymap and will remap the 'grid' layout so that the labeled 1-4, q-r, a-f, z-v keys do what you expect them to (but they conveniently label them in the ui with their dvorak equivalents). On mac-os, dota2 for instance, gets confused and will still listen for `qwer` instead of `',.p`, which requires you to remap these keys (or always use qwerty at the expense of typing replies slowly).

Because the whole purpose of vsco keys (presumably) is to give spatial regions of your keyboard functional uses, having to dance around qwerty->dvorak remapping needs to be part of the work.

The project itself is fairly contained, too: figuring out the filetype should be fairly straightforward. Generating the config files will probably be the most time-intensive aspect. With any luck, i won't have to deal with the lightroom plugin (whose source, btw, was not provided). That leaves the osx host application which, as time goes on, strikes me as the most fragile. Thankfully, its source is available and needs to be updated to integrate with whatever webapp i end up making.

## the savefiles

The project provides some pretty minimal guidance for how to create your own configuration: they have a [`sampleLayout.keysjson` file](https://github.com/vsco/keys/blob/master/Layout/sampleLayout.keysjson) and two ancillary files, one a json array with [keycodes and key labels](https://github.com/vsco/keys/blob/master/Layout/keymap.json) and another with what appears to be the name of [every single lightroom command annotated](https://github.com/vsco/keys/blob/master/Layout/toolkitlistlr4.json) with ranges and pretty-printed label. Your goal as end-user is to take the two supplementary files and generate new config files with them, by hand, [like an animal](http://5by5.tv/b2w).

### defaults

When you manage to get the app installed, you notice the following preinstalled presets:

![](http://dl.dropboxusercontent.com/u/406291/Screenshots/hTyC.png)

These seem like they should be good fodder for figuring out how you might develop a full-featured config file, so i started searching for them and found... nothing? eventually, after searching for a while i decided to search for the word `standard` and came across something that looked promising initially

![](http://dl.dropboxusercontent.com/u/406291/Screenshots/X4Gb.png)

but on closer inspection...

    marcos@Dalarna in ~
    ○ hexdump ~/Downloads/VSCOSimple.vkeys
    0000000 ae d2 0b e2 d3 66 00 82 52 c9 54 34 8c 11 05 78
    0000010 67 1d 60 e6 5e e2 44 fa bf 7c df aa cb ae 8a 3d
    0000020 12 c8 96 32 31 20 cb f0 16 28 3c a9 ef e3 0c 5c
    0000030 09 ff dc ad 67 01 59 41 9b f7 8d c0 23 cf 31 d3
    ....

and from here you can see

    marcos@Dalarna in ~
    ○ file ~/Downloads/VSCOSimple.vkeys
    /Users/marcos/Downloads/VSCOSimple.vkeys: data

ok, so it's not, sadly, gzipped json, so my next guess is that maybe i'm just looking at a marshalled NSDictionary. but before i decided to investigate that route, i noticed that the app needed to support two separate extensions: `vkeys` and `keysjson` and thinking ever farther back, the apps are cross-platform (win/mac), so whatever the format is, it's probably not just a raw NSData dump, it's probably something at least easy to port between platforms.

the next trick was searching for `vkeys` and seeing what came up and, lo and behold

![a list of #define consts](http://dl.dropboxusercontent.com/u/406291/Screenshots/EtVo.png)

But... and here's the funny one, you'll notice the `KEYFILE_AES_KEY` const just hanging out there, but my initial guess was that it was used to verify licenses or valid keyfiles. instead, i find the `- (void) importKeyFile` method that seems to call `- (NSMutableDictionary) decryptAndParseKeyfile` that [calls](https://github.com/vsco/keys/blob/ae007d227536814ba380af73ed5446fb9e37daad/VSCOKeys/VSCOKeys/KeyControl.m#L693), effectively, `[[NSData dataWithContentsOfFile:filePath] decrypt]`. Also, this may not be obvious, but `- (NSData *) decrypt` is _not standard_.

The code for it looks like this, though

    NSUInteger dataLength = [self length];
    uint8_t *unencryptedData = malloc(dataLength + kCCKeySizeAES128);
    size_t unencryptedLength;

    CCCryptorStatus status = CCCrypt(
      kCCDecrypt,
      kCCAlgorithmAES128,
      kCCOptionPKCS7Padding,
      KEYFILE_AES_KEY,
      kCCKeySizeAES128,
      NULL,
      [self bytes],
      dataLength,
      unencryptedData,
      dataLength,
      &unencryptedLength);

    return [NSData dataWithBytes:unencryptedData
                          length:unencryptedLength];

and if you look close, you realize that `KEYFILE_AES_KEY` is showing what its purpose actually is.

***
An aside here: as a kid i always though binary file formats were magic until i realized (much later) that they were often just often just spewed out representations of lists and dictionaries. When i learned that some of them were simply marshalled datatypes i felt like i had just pulled back a curtain.

***

anyhow, a quick trip to google reveals that this CommonCrypto incantation is a stock AES 128[^aes128] incantation, which means that even though you could could reuse that code to make a cli application[^cli_disclosure], you could also (probably) just feed a `vkeys` file to openssl and decrypt it there successfully.

[^ae128 which kind of aes, we'll discuss later]

this makes sense, too, if you stop and think about the app being cross-platform: if the key files are generated via webapp, that means that the webapp has to be able to output some format that can easily be parsed by c# in windows and objective c on the mac, so the webapp is unlikely to be spewing forth the result of `[internalRepresentation writeToUrl: foo atomically: YES]`

An aside though: why encrypt the `vkeys` files? I can sorta understand the copy-protection angle, but from my perspective, being able to view the exported data doesn't help you much (especially given how user-hostile json is for most people, even devs, to edit.)

The other thing to note is that if the app is going to be backwards compatible for older users, when they open source it, they need to disclose that key in order to retain compatibility for users with legitimately generated keymaps. I think they could actually have gotten pretty good mileage out of gzip in this case with a changed the extension assuming that their application would always intercept the file when opening.

[^cli_disclosure]: which, if we're being honest, this is what i did initially just to peek at a more complete file, but i think the openssl approach is more interesting.

Anyhow, so we have these keyfiles, how do we decrypt them? A cursory glance on the internet reveals that the openssl command to decrypt files looks roughly like

    openssl enc <cypher> -d -in VSCOSimple.vkeys -out VSCOSimple.keysjson -K <encryption key>

looking back at the CommonCrypto incantation, you see that it's AES 128 (and peeking at the commoncrypto docs, you find that the default is AES 128 CBC and that the command to decrypt it specifices a `NULL` initialization vector (`iv`).) This is good to know, because the options for cyphers are

    Cipher commands (see the `enc' command for more details)
    aes-128-cbc    aes-128-ecb    aes-192-cbc    aes-192-ecb    aes-256-cbc
    aes-256-ecb    base64         bf             bf-cbc         bf-cfb
    bf-ecb         bf-ofb         cast           cast-cbc       cast5-cbc
    ...

So we can update the command to

    openssl enc -aes-128-cbc -d -in VSCOSimple.vkeys -out VSCOSimple.keysjson -K <encryption key> -iv 0

Now, if you investigate the arguments to `openssl enc` you find

    -K/-iv         key/iv in hex is the next argument

which means that you **need** to convert the _string_ key value in the app source code to a hex value. You can do this in _ye olde python_ with this command (it prints the hex of each character in the original key)

    python -c "print ''.join(['%x' % ord(x) for x in '4Nfurb94B6iW64QD'])"
    344e6675726239344236695736345144

armed with this, you can now fix the incantation

    openssl enc -aes-128-cbc -d -in VSCOSimple.vkeys -out VSCOSimple.keysjson -K 344e6675726239344236695736345144 -iv 0

and easy-peasy-lemon-squeezy, you get

![](http://dl.dropboxusercontent.com/u/406291/Screenshots/5h52.png)

With that, i proceeded to [upload them](https://github.com/nsfmc/keys/commit/a63e9bbb4fa35ac74777dfc83cc1b52a72ea618b) to [my fork](https://github.com/nsfmc/keys) of the keys project.

That's all for now, but i'll keep updating this when i have time to hack on the project.
