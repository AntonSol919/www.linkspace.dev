# Digital Communications and Platforms

In a podcast Yuval Noah Harari observed that he kept asking social media tech executives "to explain what is happening" but they never seemed to answer.

I'll give it a shot.
but be warned< there"s no path back to ignorance"

Much of it stems from a slight of hand.
Few people realize it and consequently fail to account for it when thinking of problems and solutions.
To properly explain that slight of hand isn't easy either.
A lot of fundamental terminology has been co-opted, so i'll do it in terms of linkspace.

Linkspace is software library build with developers in mind.
But I hope this introduction is within people's ability to understand.
Its gone require focus, but by the end I hope you'll see the larger picture and why the executives rather not explain.

Social platforms are build on a 'stack' of ideas.
The core ideas are 'invented' and implemented countless times in different forms, creating different arrangements on this stack of ideas.
The ideas mix and match, but usually one stack order and set of implementations wins out over others by fulfilling 3 requirements:
Solve a immediate problem, functions 'well enough' that other people can build on top of it, and be lucky.

We've fallen in the trap of taking too much of the lower stack for granted.
It warps how philosophers, lawmakers and even computer scientists talks and thinks about these platforms.

Linkspace is a software library that implements the "linking by cryptographic hash" [fn::Supernet] idea. 
Simiarlly to software like Git (and github), Bitcoin, Torrents, etc.
But with my personal idiosyncrasies and a focus on speed and adaptability.

Its an experiment to reorder (parts) of the stack of ideas and see how far down I could take it, and the interplay between them when doing so.
The library is available in Rust, Python, javascript, and a CLI. Its designed to be adaptable so anyone can easily build into a specific niche like git, bitcoin, or other usecase[#links-tools].

However as a first introduction I'll be more ambitious and walk through
what the current stack of ideas looks like from the perspective of linkspace.
From TCP/IP up to a platforms like MySpace, Twitter, TikTok, Uber, AirBNB, Reddit, etc.

The first section is a short overview of the current stack of ideas we are using.
The second section defines the linkspace protocol.
The third section uses the linkspace protocol to describe go over the stack again from the first section.
Finally i'll come back to the platforms and expose the slight of hand you've been missing.

Hopefully by the end, even if you're not a developer, you have picked up a broader way to reason and talk about how we organize our digital space. 

You and everyone you know spends hours each day of their whole life interacting with the digital networks.
Take a moment to sit down and learn about the basics.

## A stack of ideas

Lets talk through the stack of ideas as if we're rebuilding the internet from scratch.

To start we'll take for granted: some hardware that is capable of sending packets of data between two points, storage
to save data, and cryptography that allows public keys to securely sign messages data.

I'm giving a very high level view of some of the ideas and leaving out others for brevity.
The implementation listed in brackets are just one example of the idea in action you could look up.
Each implementation is build of code that implement (parts of) the other ideas in its own quirky way.
That is just how systems naturally develop. Perfectly clean abstractions are the ideal - not reality.

#### Order Packets (TCP)
Packets do not always arrive in the order they are sent.
Errors can pop up during transmission and packets have to be re-transmitted.
A sender can add a number to each packet. The receiver just has to put them in the right order before handing them over to the
program that wants ordered packets.

#### Routing Packets (IP)

Adding new hardware between every two endpoints is expensive.
Instead of driving from the factory right to your home, we can simplify by adding a distribution center.
By giving every destination a number, we can reuse channels.
A router checks which connection will put the packet closer to that destination number.
No matter how many stops are along the way, a packet gets closer to its destination until it arrives.

##### Security (BGP)

You might fool a router by pretending all destinations are close to you and then get all the packets meant for somebody else.
By agreeing how destination numbers are assigned, you can set policy that a numbers starting with A01235 should go to Country A and not C. Finally you set policy to associate the physical connection to Country A with their public key, so they can prove the end point is still connected to Country A.

Nowadays this design is consider wholly inadequate (and in naming i'll describe the solution), but it worked well enough. Most of the time [https://en.wikipedia.org/wiki/BGP_hijacking#Public_incidents].

#### Naming destinations (DNS)

A target destination can move.
If they'd keep the destination number _everyone_ would have to update their routing system.
Even if they've never routed a packet to that destination. Just in case the someday do.

As a solution we associate a name with a destination number.
Then we use the name for the destination, and before transmitting lookup the current associated destination number.
Now instead of bothering everyone by pushing the update, they can pulled on request.

##### Security (TLS)

The routing security described a system that did 'well enough' by planning out physical connections, destination numbers, and setting policy. 
Naming should be valid beyond direct neighbors.
The whole world has to (mostly) agree while everybody is constantly moving.
The speed of light (and consequently the CAP theorem) limits what is possible.

We can't communicate with a single destination to get the associated number.
That would be too slow when dealing with a million lookups per second.

A solution is to delagate to sub providers.
When you then ask for the association, the sub-provider gives two messages.
The first was signed by the root provider giving them the authority to be a delegate,
and the second was a signed message by them on the current name & number association.

There are additional complications do not worry if the cause and effect go over your head on first (or 100th) reading. This is decades of insight compressed into two sentences for completeness sake.

- When a sub-provider's public key is stolen the thief can fake messages: Most systems just accept the initial risk in favor of speed and throw an error a little while later if the 'root' provider publishes a retraction of that public key's authority.
- The 'root' provider is less time sensitive and needs more security: instead of a single key a bunch of separately secured systems create a graph of signed declarations about delegation's and each other so that they can kick out compromised keys.

#### Address per application (IP Ports)

Packets are arriving, but at each destination there is more than one application that wants to send and receive packets.
By adding a tag to each packet, different applications can use the same network and talk in their own language to similar applications. Completely separate for different applications that don't speak the language.

#### Address within applications (HTTP)
As a user interacting with an application there is a bunch of possible actions to take or information to reference.
We might organize those in a structure that looks like "/post/1/comment/12".
This idea achieves two things:

- Together with an application name people can share the reference elsewhere
- The application doesn't open what isn't requested. i.e. it can avoid opening /post/99/comment/1

### A note on encryption

I'm leaving encryption out of scope because it is straightforward and mostly orthogonal to the story.

Any two endpoints, at any time, can choose their preferred method to encrypting messages.
Its also trivially to double up on. You can encrypt messages before sending them over an encrypted channel.

The majority of data leaks to worry about are not somebody decrypting data being transmitted,
but wether it should be send to the destination in the first place.

That is part of naming and routing security and the policies in place.


### The Platform

We've covered the basics of the internet and I could start explaining what is happening on a social media platform.
The problem is, many people have tried before and self evidently failed.

Whenever the actions of a platform is put into question, they're not asking for accountability.
Instead the question can practically always be prefaced with the words "Do i understand correctly that ....?".

That is a problem.

My working thesis is that the order we've developed the network ideas (and the limits of their implementation) is at fault.
Without a fundamental understanding and studying the consequences of the way they are stacked, explaining and thus understanding what is happening is too difficult to be agree on.
Especially having cartographic signatures as an appendage to secure other ideas makes the story a mess.

Give me a chapter to describe linkspace, and a chapter to walk through the ideas again.
I think It will be easier to graph the slight of hand you've missed.

## Linkspace point format

In the previous section I gave a brief rundown of ideas at the core of our communication networks, but tripped over just before the end.
This section describes the linkspace point. The unit of data i'll reason about.
After that i'll describes the functionality of the previous ideas in terms of linkspace packets to build up your intuition, and finally i'll explain what social media companies are doing.

A linkspace point contains:

- upto 2^16 - 520 bytes of data
- 32 byte cryptographic hash of the fields - it uniquely identifies the point.

Optionally it holds:

- 16 byte Domain
- 32 byte GroupID 
- upto 250 bytes path name
- 8 byte time stamp
- a list of links (16 byte Tags, 32 byte point hash) (Secure ordering)
- publickey (32byte) and signature(64byte) (Cryptographic identity).

In development there is a technical distinction between 3 kinds of points:

- datapoints: are only data and hash
- linkpoints also holds: a domain, a group, a pathname, a list of links
- keypoints also holds: a public key and signature

When describing a system i'll use the 'linkpoint' as a general term and occasionally 'signed linkpoint' when I want to emphasize the cryptographic signature inherent in the message.

Now we can talk about data and people _before_ talking at servers.

That might be too abstract and the consequences too vague.
So lets first describe the ideas so far in terms of linkspace points.

## The stack in terms of linkspace

Lets walk through the same stack of ideas again.
The goal is to familiarizes you with thinking in terms of linkpoints.
As an added benefit it demonstrates that anything designed for our current stack could also work using linkpoints.

That is not to say its always a good or efficient idea to do so.
Conversely, there are a lot of designs and rituals that are over-complicated or even entirely superfluous when you do.

I'll also discuss some properties you might have not thought about yet.
Specifically a lot of them become 'transative'.
i.e. Not just usable at one place at one time, but also when for whoever subsequently receives a copy of a linkpoint.

#### Ordering Packets

Ordering is done by the stamp field.
By having a signature it is valid for any subsequent receiver, not just the first.
By using the current time (by default) the ordering is maintained between sessions.

Ordering of linkpoints between multiple destinations is also possible.
Because a hash is unique to each linkpoint, 
by adding a link with the hash of a previous linkpoint it is shown that it came before.

#### Routing Packets

The GroupID indicates the intended set of receivers.
By convention using Your key XOR their key is the GroupID used for linkpoints meant for just these two.

(We'll come back to membership in larger groups later.)

##### Security
Routing is still a case of policy and cryptography.
To ensure a channel is the intended destination for a linkpoint in a group, send them a newly signed linkpoint by you and
ask them to reply with a signed linkpoint referencing your message.
If they can do you know they are the right destination.

#### Naming destinations


##### Security

#### Address per application
The domain field indicates the 'language' being spoken. When building an application that talks with linkpoints you'd pick a name and use that.

#### Address within applications

The path name field allows an application to structure and reference data (even when its changed).
This idea is usually implemented in the context of a indexing of a centralized service.

Linkspace is strictly more powerful than that, but to simply emulate this centralized behavior it is enough to only read
linkpoints signed by a specific public key.

## The Platform (Retry)

Lets me now tell you what happens when we engange with a typical platform;
The steps taken to providing you a timeline of you and your friends, or to quote you their price to buy another user's stuff. 

But instead of telling it through the the tech listed in chapter 2, ill sketch out an equivelant exchane with the language of linkspace.

There will be 4 absurd steps - denoted with (???) - in the exchange.
The first seems like a technical detail but it justifies the subsequent idiocy.  
Read it twice to connect the dots.

We'll take some of the setup for granted and assume your browser/app has found the companies publickey and can send and receive data.


---

You wake up and open a browser or phone app. 

- You've pay an internet bill to so messages reach their destination.
- The app has its name embedded, or you enter it in the browser and starts a lookup of their public key.
- You create a new public key identity. 

Unlike their publickey that identifies them to the world, yours will have no relation to anything else and you will never use again (???).

- You use it to send them a keypoint 'hello'.
- They respond with a keypoint referencin your point to prve youre talking to the right people.
- With some math you set up a secure connection to exchange points for the rest of the session.

Developers should take note of the following: By sending over a encrypted connection we have the ingredients of a keypoint.
ie a digitally signed message and publickey. As with a keypoint, I could tcpdump a HTTPS session and show it to another to prove what whas exchanged. This conceptual equivalance is important for what follows. 

- The company sends a bunch of keypoints that instruct you browser what to draw.
- As instructed, you enter and send a keypoint containing your plain text username and password for the company to verify.
- They return you a completly meaningless random number they generated when you first joined. 

So next tomorrow - when we restart at the top - you don't have to enter a password (???)

- You decide to publish a post. You send a keypoint (still holding that random number they associate with you.).
- The company strips your signature, and adds yours number they assigned before saving.
- You request an  update of the world.
- The company has aggregated recent posts and sends you a point linking to other points. 

These are links are ofcourse to their version of the linkpoints send by users with their numbers (???)

Repeat tomorrow. 

---

I feel the need to repeat that. The take your signed contribution, strip it for parts, and add their mark and we celibrate thats all we have to pay 
for them to make the process smooth and look nice,.

This is the essence of "online community" nowadays.
A very narrow set of rules to obey under - what i like to call - host-administrators. 
Judge , jury, decorator, and executuner of their demesne. Because that is what we sign up for.

- Dictates the graphical interface
- Defines who is part of the users - including random bots to pad the numbers -
- Publishes their signed linkpoint to set the current 'popular' posts.
- Removes the user's signature from posts and republishes them as unsigned linkpoints

Competition is lacking in every aspect of this setup - sans exodus and abandoment. 
Te first three are somewhat understood by people paying attention, but i see too few recognize the slight of hand of the forth.
By removing the original signature it moves the ownership from the creator to the platform entirely.
It is called 9/10th of the law for a reason.
When the goals of a host-administrator diverges from its suckers who agreed to the free bargain, and the trust between them is breached ever so gradually, the host-administrator retains control over every aspect and a member has none.
No link can show they existed, no recourse to move and continue the community with different rules, no possibility to publish their own 'popular list' driven for ideals beyond hostile businesses or governments.

# Conclusion

bu there is a lot of accidental complexity , as oppose to essential compkexity to awnser it.
Harari likely had a broader context in mind when he asked "what is happening" - but I think without understanding the basics and the slight of hand it becomes difficult to answer.


A bunch of basic ideas, impelmented and stacked on top of eacother give developers the abililty to build platforms, where they 
reign supreme as host-administrators. 
They provide multiple services in a single package. By welding them together are able to dictate and control their users and effectivly steal the user's posts and contributions while holding the community hostage.

Laid out as such its almost incredulous that slight of hand underpins some of the most valuable companies on the planet that actively shape society.

The awnser to the question: "What is happening?" is is not easy. 
But what is undoubtily missing is a language so people need a langugue so theiy're no longer need to apreface "if i understand it correctly ..." for every critical question.

I've got a creeping sense people fear something in society is bound to give out. 
But something already did 2 decades ago. 
The ability for young people to control how they organize. 

The solution requires a bit of tech, and a bit of thought. 
I think we can figure it out. 


