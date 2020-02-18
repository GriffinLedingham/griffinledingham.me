Training Pokemon with genetic algorithms

</title>

##### February 16, 2020

# Training Pokemon with genetic algorithms

Competitive Pokemon is a game of numbers, and optimizing EV spreads is one of the most challenging aspects of high-level play. In this article, I discuss how optimization algorithms may be used to find new solutions to a problem posed by a 20 year old series for the Nintendo Game Boy.

</summary>

##### February 16, 2020

# Training Pokemon with genetic algorithms

## Optimization Problems

In the field of mathematics and computer science, optimization problems are a common topic of research. Put simply, an optimization involves finding the "best fit" solution to a complex problem based on a provided input. A common example of this can be seen in the [knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem). The knapsack problem is a straightforward concept, given a list of objects with varying value and weight, "maximize the total value of objects that can be put in a knapsack of some fixed capacity." Though this sounds trivial on the surface, it is a complex optimization that can only be approximated by utilizing solutions designed for other similar, less complex problems.

[Metaheuristics](https://en.wikipedia.org/wiki/Metaheuristic) are high-level procedures which help us to find sufficiently good solutions to optimization problems, using the provided input knowledge to abstract the problem into a simpler heuristic. Among the many different styles of metaheuristic, the [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm) is an abstraction which models the problem after biological evolution and natural selection. In this article I will be discussing how genetic algorithms may be applied to the task of creating effort value (EV) combinations for Pokemon, and what pitfalls may arise.

The discussion here is based on my implementation of the problem using genetic algorithms which can be [found here](https://github.com/GriffinLedingham/pikacalc) on my [GitHub](https://github.com/GriffinLedingham).

## Effort Value Spreads

EV's have been a key part of Pokemon's game design complexity since Red and Green in 1996 on the Nintendo Game Boy. Though not displayed to players via the game's user interface, EV's determine the stats of each Pokemon on your team, and what areas they will excel at in combat. Each Pokemon may have a total of 510 EV's, with no more than 252 invested into a single stat (HP, Attack, Defense, Special Atack, Special Defense, Speed). These EV configurations are often represented as a series of 6 numbers, like so: `[100, 100, 100, 150, 50, 10]`

Each point of Effort Value has inherent value, which changes based on external circumstances, and 510 total EV's/252 EV's per stat is the maximum capacity that may be carried. When competing at high-level events, players configure their EV's in such a way that they are getting maximum value out of every point, while remaining within the constraints of the maximums. Using [damage calculators](https://pikalytics.com/calc), players are able to determine exactly how much damage their Pokemon will deal/receive when fighting an opponent equipped with varying EV allocations. For example, comparing Arcanine v.s Excadrill, Excadrill's Earthquake move will one-hit KO Arcanine 100% of the time, but when reserving 252 of Arcanine's EV's in Hit Points, this 100% chance drops to only a 31.3% percent chance. This is a much better outcome, but will Arcanine now fare worse in a different matchup due to this specific allocation?

As you can hopefully see, this problem of optimizing EV allocation runs heavily adjacent to the knapsack problem described above. I will be defining optimizing EV allocation as the main problem being discussed in this article, as I search for a solution using genetic algorithms.

## Applying the Technique

I touched on genetic algorithms briefly up above, now let's circle back to see how we might apply the technique to this problem. A genetic algorithm's purpose is to use the principles of survival of the fittest and natural selection to approximate solutions to problems. At a high level, the goal is to generate a population of parents with varying EV's, and simulate their battle results against many other Pokemon. Based on these simulations, the weakest 50% of the population will be pruned, while the surviving parents will crossover with one-another to produce offspring which resemble a combination of their two EV allocations. These offspring have a random probability to mutate, meaning their EV's will deviate from their parents, to keep the gene pool constantly using trial and error for improvement.

This simulate, cull, reproduce cycle is referred to as an iteration, or generation. The more generations this process continues for, the more heavily the surviving EV allocations will resemble a best fit solution to the optimization problem.

## Building the Simulation

Given the algorithm description above, it's time to actually set this up for use. The population will be defined as 1000 Pokemon, with randomized EV allocations. Some Pokemon may receive 252 EV into one stat, 252 EV into another, and have 6 remaining (510 total EV's), or others may evenly spread their EV's across the board creating more of an all-around hybrid build.

The next step is to begin running the battle simulations to determine each of these Pokemon's fitness scores. To calculate this score, I simulate the chosen Pokemon against the [20 strongest Pokemon](http://pikalytics.com/) in the current competitive game. In each of these simulations, a score is produced based on how hard the Pokemon was able to hit the opponent, how much damage it received, and whether either Pokemon would kill before the other got a chance to attack. This produces a single numeric fitness score for the chosen Pokemon, which we can use to compare the population against one another.

After the simulation stage, each Pokemon in the base population will now randomly compare its fitness score against one other. The winner will move on to the next stage, the loser will be culled from the population. When all of these head-to-heads have completed, the population now consists of the 500 Pokemon whose fitness scores on average were higher than the culled 500. This can be viewed as the "survival of the fittest" stage of the genetic algorithm.

Once culling has completed, the remaining 500 Pokemon must now crossover to produce new offspring based on their combined successes. Pokemon will be randomly coupled with a partner from the population, and they will each produce one son, and one daughter. These two children will each inherit different strengths from their parents, calculating averages of the parents' EV allocations to produce two new and unique EV configurations. As in nature, there is a failure rate in producing offspring, as well as potential for mutations to occur. Failure rate is configured as a decimal value between 0 and 1. Mutation rate is also configured as a decimal between 0 and 1, with mutated offspring receiving EV's allocated in ways their parents did not.

At this point, the base population has been culled in half, and reproduced to generate 500 new offspring. The surviving parents are now carried forward into the next generation, and we see the cycle begin to repeat.

## Finding a Solution

This pattern of simulate, cull, reproduce will now run until it is terminated, or the max iteration count I have set of 4,000 is reached. Every generation, a best fit Pokemon is determined within the population based on fitness score. As the algorithm works through generations, the best fit Pokemon at each step is the current optimal solution to the EV configuration problem. This best fit solution will change heavily as the run progresses, as the population transitions from a randomized group of stat allocated parents, to a highly optimized group of only the fittest offspring.

After 4,000 iterations there will hopefully be a reasonable looking EV configuration presented as the best fit, often focusing on one or two stats more heavily than the others.

## Understanding the Solution

When the genetic algorithm completes, a best fit output has been found and is presented as the optimal solution to the problem. The solution in my implementation looks something like this (using [Gyarados](<https://bulbapedia.bulbagarden.net/wiki/Gyarados_(Pok%C3%A9mon)>) as the selected Pokemon):

```
1000 '11.79' [ 77.86855827,
    205.7229081,
    100.9006039,
    1.492534065,
    3.58812489,
    118.4272708 ]
```

Dissecting this, the first value `1000` is the generation that this solution was found at, or how many cycles of parents and offspring have been completed up to this point. The next value `11.79` is the solution's fitness score, which is centered around 0 in my simulation of the problem. Positive numbers are better than negative numbers, so the goal is to get above 0, or as close to it as possible. The final set of values is the actual EV allocation itself: `[ 77.86855827, 205.7229081, 100.9006039, 1.492534065, 3.58812489, 118.4272708 ]`

This means that the best fit configuration for Gyarados is 78 EV points into HP, 206 into Attack, 101 into Defense, 1 (or 0) points into Special Attack, 4 into Special Defense and 118 into Speed. This brings us to a grand total of 508 EV's, with 2 remaining to assign.

So is that it? Has this algorithm just solved the problem, and found the perfect, best fit Pokemon possible? Well, no, unfortunately that is likely not the case. Effort value allocation is a very challenging problem to solve, requiring comprehension of the meta game and predicting decisions that opponents may make, among many other factors. While the genetic algorithm is able to produce a purely statistically proposed best fit solution, a knowledgeable player is still highly likely to outperform automation at this task until further improvements are made. That said, there is a lot of information to be unpacked from this simple set of numbers.

### HP

Looking through the top Pokemon in competitive play right now, Gyarados may have a difficult time handling opponents carrying Rock Slide, a super effective move which nearly one-hit KO's Gyarados under various circumstances. The popularity of this move in the current landscape likely speaks to the HP and Defense point investment in the best fit spread, allowing Gyarados to healthily survive a Rock Slide and crack back at the opponent with its own attack.

### Attack

Physical attacks are Gyarados' strongest means of offense, so it's no surprise that the algorithm invested heavily into the Attack stat. If Gyarados is able to kill an opponent before it is able to make an attack, the algorithm will consider this a positive defensive strategy since Gyarados received no damage as a result.

### Speed

Similarly, Speed is a very important stat because if the Pokemon moves first, it may kill the opposing Pokemon and prevent all damage it would have received back. The Speed value chosen of `118` allows Gyarados to out-speed one of its major threats in the format, [Tyranitar](<https://bulbapedia.bulbagarden.net/wiki/Tyranitar_(Pok%C3%A9mon)>), even if Tyranitar has allocated 252 EV's into Speed. This could be one of many explanations for the Speed EV investment presented by the genetic algorithm.

### Special Attack

The Special Attack value of `1.49` may as well be rounded down to 0. Gyarados does not use Special Attacks whatsoever, so the remaining `1.49` is just a leftover residual trait which has not yet worked itself out of the gene pool entirely. After a few thousand more generations, this value would likely converge to 0.

### Special Defense

Special Defense is a stat that Gyarados does not often invest heavily in, as the super effective Lightning type attacks which Special Defense would help protect against are not overly popular in the current meta game. Through genetic evolution, the algorithm would have likely determined it wasn't worth even trying to save itself against these attacks, as their low representation in the meta makes it more worthwhile to just concede to them, and focus the stat allocations elsewhere.

An interesting point to note about the 4 point Special Defense investment: when considering the impact effort values have on a Pokemon, the first 4 EV's allocated into a stat are more worthwhile per-point than the next 248, as the initial point allocation is scaled more heavily than all others. Interestingly enough, it seems that the algorithm may have figured this out through simulation, by ending up with exactly 4 points invested. No more, no less!

## Pitfalls and Issues

Though algorithms provide a versatile toolkit to solving problems like EV allocation, I do not believe they are capable of replacing human efforts at this time. Without proper comprehension of the data being handled, the algorithm is not able to make defined choices, past what it understands about the problem set in a purely numerical fashion. Factoring in human traits, error, and complex decision making, a computer is only able to provide its best guess about how a solution to this problem may be approached.

Despite the very interesting outcomes discussed above, the major flaws I have noted in this type of simulation include:

- Simulations are purely head-to-head. Double battles (2v2) increase the problem complexity significantly.
- Not every Pokemon has to fight every other Pokemon. Players use switches to negate bad matchups, a strategy the genetic algorithm is not able to account for.
- Items and Abilities are not currently accounted for. This is another set of variables that would dramatically increase the complexity of the problem set. That said, this may be one of the first areas worth approaching for iteration/improvement.
- Teams have 6 Pokemon for a reason. EV spreads are often designed to specifically support other Pokemon on the team. Producing EV allocations in a vacuum negates a large part of competitive play, but may stand relevant for offensive sweeper Pokemon and walls who maintain a linear strategy on their own.
- Many, many more flaws and inconsistencies...

These points do a good job displaying how much work remains before attempting to rival human ability at EV allocation. Optimization problems have a [wide variety of solving algorithms](https://en.wikipedia.org/wiki/List_of_algorithms#Optimization_algorithms), some of which may be even better suited to EV spreads than genetic algorithms. This leaves a lot of untapped computation potential for the Pokemon community to one day apply to the competitive scene!

## Closing Thoughts

While computers and algorithms are rapidly automating more and more of our world, complex problem sets that exist in video games continue to puzzle even the most advanced supercomputers being put to the task. We are able to augment our knowledge of games by understanding the ways in which computers comprehend our play, and assess the strategies we utilize. While genetic algorithms may not be the perfect solution to generating a Pokemon team, trends and patterns will arise which may not have been picked up by the human eye.

Though Pokemon is not currently at the forefront of this industry, I hope that this discussion has shown what an interesting challenge the game presents for optimization and artificial intelligence applications.

-Griffin
