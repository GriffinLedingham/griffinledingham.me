Build to scale... then scale

</title>

##### February 27, 2020 · 7 min read

# Build to scale... then scale

Web scaling in our modern era of development presents great power, and even greater responsibility. Where computation resources used to be scarce and sought after, we must now be careful to not abuse scaling with bloated tech stacks and over-complicated solutions.

</summary>

##### February 27, 2020

# Build to scale... then scale

## Planning Ahead

I recently set out to design a scalable server architecture for a realtime game system at work, unlike any other product we currently operate. With this challenge came a unique set of requirements to adhere to, as well scalability needs for future-proofing the design.

The system needed to support large loads of concurrent players, communicating between one another over web sockets through a middle-man game server. The game server would be processing significant business logic calculations, and so web socket traffic should be handled separately from these calculations as to not run into performance troubles for any aspect of the flow. Game servers start and finish independently of one another, and so the system must allow web sockets to communicate freely with any game server, at any given time.

Game instances must record their states, so that in the event of a failure, the game instance may be near-instantly spun back up again with minimal downtime for the player. This means that games should not be tied to any piece of hardware or address in memory, so that rebuilding is possible on the fly.

I began to design the architecture for my maximum capacity, absolute success case (or my "BHAG" - Big Hairy Audacious Goal). What this allowed me to do was conceptualize where the system needed to go if we reached our ultimate goal for the product and became stretched thin on computation. The practice of beginning with this level of scope allows me to visualize what the end-game for a system might look like, and then work backwards from there simplifying until I reach a healthy middle ground.

## My "BHAG" Architecture

[![Build to Scale - BHAG Server Architecture](/images/scale/web-archi-initial.jpg "Build to Scale - BHAG Server Architecture")](/images/scale/web-archi-initial.jpg)

This initial iteration allowed for unlimited horizontal scaling of web socket servers, tucked behind an AWS Elastic Load Balancer/Application Load Balancer. This would allow me to support any amount of concurrent web socket traffic, without worrying about clogging up the event loop of a single Node.js process. The game system involves heavy traffic through every players' web socket, so the event loop can get very busy, very quickly. That said, the popular Node.js web socket library socket.io touts support for thousands of concurrent sockets before serious performance degradation, so this problem is not likely to arise out of the gate.

Next, these web socket servers needed a way to interact with the independent servers processing business logic for the game. My plan for this was to rely on a Redis pub/sub node, due to the blazing fast performance you can achieve on heavy loads. Redis would act as a mediator between web socket servers and game servers, allowing the client to send a message to any given game server and accept messages in return.

As game servers scale in and out, this makes it a breeze for web sockets to interact with each new one that comes online, not worrying about which physical server it is sending and receiving requests with.

If a game instance crashes at any point, a new game server may be scaled in and restored from the most recent snapshot of the game's state and requests will now be directed to this new server for the game instance, allowing players to quickly pick up where they left off.

## The Simple Architecture

[![Build to Scale - Simple Server Architecture](/images/scale/web-archi-simple.png "Build to Scale - Simple Server Architecture")](/images/scale/web-archi-simple.png)

After determining what I would need to run my system at maximum capacity, I began looking at how I could scale this back to minimum capacity, or as simple as possible. As the image demonstrates, this got _real_ simple.

If I'm not worried about maximum capacity, and pushing the limits on the Node.js event loop, I'm no longer tasked with separating the web socket server from the game instances. With all aspects of the system now living in a single box, this removes the use case for Redis as data no longer needs to be accessible cross-server in a horizontally scaled fashion.

At its simplest form, the architecture is now able to accept client web socket data, pass it into the server's business logic, and respond to the client right then and there over the same web socket. This sounds great, but have things now become over-simplified? If a few thousand users unexpectedly connect via web socket, how will a single Node.js process handle this on a single event loop? Though this is the minimum capacity case, I don't want to leave myself with a boat load of tech debt waiting for me if success comes quickly.

Game state recovery becomes tricky in this architecture, as a crash or stability fault compromises the entire Node.js server, and leaves it in a state which is not safe to continue running. The server must fully restart, causing all game instances to be rebuilt on the single Node.js server and disrupting all traffic.

## The In-Between Solution

[![Build to Scale - Final Server Architecture](/images/scale/web-archi-hood.jpg "Build to Scale - Final Server Architecture")](/images/scale/web-archi-hood.jpg)

Above is the solution I finally settled on, and it was easily my favorite of the iterations. Though sticking to a single server for simplicity's sake, I utilized Node.js workers to run multiple event loops across any amount of threads the host hardware would provide me. Though Node.js is commonly discussed as an "async" heavy environment, it's common knowledge that this "async" really just means fancy queuing of synchronous calls. I built the system out into modular components designed for a single-server Master/Worker flow, but which nicely map to my multi-hardware "BHAG" design.

Workers allowed me to break out of Node.js' standard event driven programming style, splitting the architecture over multiple CPU threads to achieve a similar result to my complicated architecture design, without having to manage scaling servers in and out. Node.js' worker API allows you to easily create workers, and communicate between the master thread and worker threads using an notify/listen flow (sounds like a good stand-in for Redis, doesn't it?).

In the latest design, instead of a wall of horizontal web socket servers, the server uses the `UserSocketManager` to keep track of live web socket connections. This `UserSocketManager` can be distributed over workers to allow for more concurrent socket traffic than a single event loop can support.

Game instances now live on horizontally scalable worker threads, meaning each one can utilize its own thread if needed, or share threads with other games (just less of them than an all-in-one solution). Each worker thread has a `GameWorker` which is responsible for sending communication between the game instance, and the master thread via the worker's pub/sub channel. This `GameWorker` is what makes it possible for more than one `Game` to run on a single thread. Messages are dispatched to whichever `Game` instance they are intended for, and then returned via the `GameWorker`.

The `GameManager` works as a routing layer on the master thread for requests from the `UserSocketManager`, instructing requests from the user web sockets which worker they can find their desired game instance on. This request is then passed along into the `Worker` and relayed by that worker's `GameWorker`.

If a game instance stumbles and needs to be restored, a new worker thread may be spawned in, or if an existing worker has room the game instance may be simply restored there. This allows me to simply discard the failed worker thread, and move along.

## Now What?

Ultimately, this system has allowed me to maintain multiple Node.js event loops without having to manage hardware scaling, or any sort of cross-server communication. As far as a product MVP, this solution provided me a robust, scalable, minimum-viable-product, without having to resort to multiple pieces of hardware. This keeps costs low, and fault tolerance significantly simpler!

If traffic reaches the point that the current server's core count can no longer handle the number of required threads, I can either move to a server with a greater core count, or opt to move this modular system across multiple layers of hardware as in my "BHAG" architecture.

The `UserSocketManager` simply becomes the horizontal layer of web socket servers. The worker notify/listen behaviour ports beautifully to a Redis pub/sub node. Lastly, the worker thread `GameWorker`/`Game` pairing can easily be moved to their own hardware servers, which may be horizontally scaled behind Redis for communication with user web sockets.

Before you know it, I'm looking at my original "BHAG" diagram up above, but without having to worry about this complex configuration for launch day of the product. Modular design has allowed me to launch small, and scale up when it becomes a necessary next step.

While I'm over-simplifying how that transition would likely go in reality, it is clear how well the final single-server iteration maps to a multi-hardware setup when traffic demands this post-release. Keeping things minimal to start meant faster iteration and product release, as opposed to over-architecting a system that may never see reasonable return on investment.

"Think big then scale back" is a common practice I utilize in developing game systems. This allows me to maintain time to market and return on investment, while planning ahead to try and minimize technical debt. Web scaling is a frightening venture, but with some iteration and foresight, you can feel confident that you've set your product up for long-term success!

-Griffin
