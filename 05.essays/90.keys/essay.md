title: keys
-
metadesc: discovering that vsco keys was abandoned and turning it into a design project
-
content:

## what's going on

In what is likely to be the ultimate yak, i recently discovered that the [vsco keys](https://vsco.github.io/keys/) app was open sourced. I don't think i was ever the app's target demographic, but it's an interesting tool that assigns lightroom actions and presets to keyboard keys so you can speed up your photo editing workflow. It had a webapp that generated keymap configs that you could import back into the main client.

So what? it got open sourced. it was a bigger support drain than it was a profit center, so it's understandable, but when an app goes open, you get to learn all sorts of things about the decisions people made when developing an app. In my case, i have a clear plan: i want to fill the gaps that are currently missing for keys (primarily because it is a fun design challenge) but the process to get there is totally an exercise in archaeology and trying to understand an application i never got to use.

## the exposed api

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
An aside here: as a kid i always though binary file formats were magic until i realized that they were often just often very efficient representations of lists and dictionaries.

***

anyhow, a quick trip to google reveals that this is a stock AES-128-CBC incantation, which means that even though you could could reuse that code te make a cli application, you could also (probably) just feed a `keysjson` file to openssl and decrypt it there successfully.
