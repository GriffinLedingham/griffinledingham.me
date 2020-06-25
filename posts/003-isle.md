Uncovering early metagame trends in Pokemon Isle of Armor

</title>

#####  June 25, 2020 · 12 min read

# Uncovering early metagame trends in Pokemon Isle of Armor

Metagaming plays a large part in the Pokemon Video Game Championship series, requiring players to stay ahead of the curve when deciding what Pokemon to bring to battle. When new content releases, it's my job to keep players ahead of the curve by producing fresh and up-to-date aggregate statistics for Pikalytics.

</summary>

##### June 25, 2020 · 12 min read

# Uncovering early metagame trends in Pokemon Isle of Armor

## Usage Statistics

In competitive games with finite sets of decisions, researching the field is one of the most meaningful ways that a player can prepare for competitive play. If six out of ten players at a Rock, Paper, Scissors tournament intend to choose scissors for every round, picking rock is the optimal decision. In a sample size of ten players, any of those six scissors players could change their mind before the event. If any one of them decides on paper or rock instead, this means a potential +/- 10% swing to your success rate. Using this logic, a sample size of 1,000,000 players means that a single player changing their mind equates to a 0.0001% deviation in your success rate. If trends can be predicited at a larger scale, decisions made by individual opponents become less important and research becomes more impactful on success rate.

Competitive Pokemon is an environment that behaves a lot like this example, but with significantly more complexity thrown into the mix. Usage statistics allow Pokemon players to prepare for a lot of the variables they will face off against at tournaments and online ladder games. Knowing many of the decisions your opponents may make before the game starts can help you react and maneuver through the complicated turns of a Pokemon battle.

Since I started [Pikalytics](https://www.pikalytics.com) in 2016, competitive players have frequented the site to stay on top of metagame trends while team building. Pikalytics provides access to two major data aggregations: monthly [Pokemon Showdown](https://play.pokemonshowdown.com]) battle results (1+ million battles per month), and daily Pokemon Home results from Battle Stadium on Pokemon Sword & Shield for the Nintendo Switch (previously I acquired this data from the Pokemon Global Link. RIP). Between these two sources, players get massive sample sizes from the Pokemon Showdown monthly data, and up to date, smaller sample sizes from daily Pokemon Home updates.

## Keeping Up With Content

When new content is released, usage and trends change dramatically in a pinch. Pokemon Sword & Shield's first DLC release, Isle of Armor, dropped on June 17, which introduced a large pool of new Pokemon into the mix. Players began team building and battling in no time, but without metagame trends to review they went into their team building flying blind.

In recent years, I've worked hard to keep Pikalytics coverage on top of season starts for the [VGC 2019](https://twitter.com/Pikalytics/status/1034973028805836801), [Let's Go](https://twitter.com/Pikalytics/status/1063106158867566592), [VGC 2020](https://twitter.com/Pikalytics/status/1197748603558617088), and now [Isle of Armor](https://twitter.com/Pikalytics/status/1273720882150535168) competitive formats. When Isle of Armor released, Pokemon Showdown iterated quickly and began allowing players to battle with the new Pokemon immediately. Though battles began taking place, Showdown's monthly data schedule meant that Pikalytics' regular aggregation schedule would have to wait until July 1st to begin displaying trends.

To cover these new formats before the regular release interval, I built a replay parser to aggregate Showdown battles in near realtime. The first format that I built this realtime coverage for was the Let's Go Pikachu & Eevee launch. Battles began taking place a week before the game's launch on [https://nexus.psim.us](https://nexus.psim.us), so I set the parser to process every public battle that took place over the week leading up to the game's release. I was able to utilize this to immediately get aggregate data up on Pikalytics, and by the time of the Let's Go launch, Pikalytics already had a full rundown of the format's usage based on a full week of battles.

Starting last week, this replay parser was used to cover the beginning of the [Isle of Armor VGC competitive format on Pikalytics](https://pikalytics.com/pokedex/isle) since Showdown began supporting the format. This has been a wildly popular data set, and I've received a number of inquiries into where it's coming from, so I thought I'd bring that to light for everyone to better understand what they're seeing.

## Gathering the Battles

My replay parser processes each public battle that takes place on Pokemon Showdown (for the desired format), and dumps the result into an anonymized battle log for Pikalytics processing. I intentionally do not retain any individual information in these battle logs to keep this data set from ever being used negatively for scouting players. The output data from each replay processed by my parser data looks as such:

```json
{
  "winner": "player2",
  "turns": 13,
  "p1team": [
    {
      "name": "Weezing-Galar",
      "species": "Weezing-Galar",
      "moves": [],
      "nature": "",
      "level": 50
    },
    {
      "name": "Duraludon",
      "species": "Duraludon",
      "moves": ["darkpulse"],
      "level": 50
    },
    {
      "name": "Porygon-Z",
      "species": "Porygon-Z",
      "item": "Life Orb",
      "moves": ["maxstrike", "icebeam"],
      "level": 50
    },
    {
      "name": "Clefairy",
      "species": "Clefairy",
      "moves": [],
      "level": 50
    },
    {
      "name": "Urshifu-Rapid-Strike",
      "species": "Urshifu-Rapid-Strike",
      "moves": [],
      "level": 50
    },
    {
      "name": "Whimsicott",
      "species": "Whimsicott",
      "item": "Focus Sash",
      "moves": ["tailwind", "energyball"],
      "level": 50
    }
  ],
  "p2team": [
    ...
  ]
}
```

These crawled battle logs contain a few important fields that I'll go over. Most notably, every log contains all 6 Pokemon on each players' team, whether they chose them as their 4 or not. These team rosters allow me to accurately generate team usage, displaying the percent of teams that include a Pokemon over the course of all processed battles. As well, these precisely accurate usage percentages allow me to generate equally accurate teammate usage statistics, displaying the frequency that two Pokemon appear together on a team.

Replays of Pokemon Showdown battles allow me to keep track of every move used by each Pokemon during a battle. Full move sets are not able to be gathered via replays, as Pokemon Showdown keeps these moves hidden to respect the privacy of the team builder. What this means is that I'm able to generate a pseudo move-usage metric, but it doesn't produce nearly as meaningful results as the monthly Showdown aggregation, or the Pokemon Home Battle Stadium Doubles usage. For this reason, I have removed usage percents entirely from the Isle of Armor preview move stats, and instead opted for a simple "rank". Ranking them in this way allows me to still display which moves are used with the most frequency, but without having to display a usage percentage that would be fairly meaningless due to these constraints. Unfortunately, this means that the usage aggregate will miss out on moves that players brought, but never used... but those moves likely aren't great anyhow if they've never been played.

One pitfall that was brought forward to me by [@komvgc](https://www.twitter.com/komvgc) was Hatterene reporting Spore as one of its top moves, due to reflecting this move so frequently with Magic Bounce. Other cases like this exist with Copycat Pokemon like Liepard reporting Trick Room usage, and many more. My likely solution to this issue will be to filter move usage based on each Pokemon's learnset as part of my data processing pipeline.

Similar to Moves, Items and Abilities work much the same and can only be observed when they are triggered. This leaves out many items and abilities which provide passive bonuses that will never trigger and cause a mention of them in the replay. For this reason, I made the decision to completely remove items and abilities from the Isle of Armor usage stats. Along with Items and Abilities, Spreads and Natures are also very difficult to process out of these replays. While I could attempt some voodoo magic to assume EV's, and guess Natures based on if X species moved before Y species, etc., I determined this would be WAY more effort than it would be worth, and it would likely never come to fruition anyhow.

To fill in these blanks I've utilized past formats to lean on, where I saw their data points relevant for Items/Abilities/Spreads/Natures. This solution doesn't come without its issues of course, as [@EmbC](https://twitter.com/MeninoJardim) on Twitter noticed that Porygon-2's most popular spread included 60 EV investment into Attack. This EV spread popped up here due to the fact that Porygon-2's data was pulled from VGC 2017 where it utilized Return and Frustration, which are no longer legal moves in its learn set. I solved this problem by adjusting the order that formats are ranked for relevance to Isle of Armor VGC 2020. VGC 2015 has a number of similar Pokemon with Isle of Armor VGC 2020, so this was the top priority format chosen in response to this issue.

## Crunching the Results

At this point, I have now collected all Isle of Armor public replays over a time period, and dumped them into nice formatted JSON as displayed above. From here is where the job becomes a bit trickier, and computationally intensive. I previously had built a [Pokemon Showdown Parser](https://github.com/GriffinLedingham/showdown-parser) during past formats such as VGC 2019 where I worked with Zarel of Pokemon Showdown to produce rather [large data mining projects](https://twitter.com/Pikalytics/status/951490111635521536) off of the raw Pokemon Showdown battle logs. When I built the previously mentioned replay parser, I designed the data output in such a way that it mirrored the format of the battle logs I had worked with previously, so that I could dust off my Showdown Parser and use it once again.

While my Showdown Parser is a rather complicated project, the premise of it is quite simple: process tens/hundreds of thousands or millions of battles and aggregate all of their data into summed up stats and percentages/rankings. Ultimately, this is all the tool really does, but the size of the data set being processed means that this becomes a multi-threading/memory management task more than anything. I won't get into details around that, as its not the intention of this article, but please feel free to check out the Github repository above if you're interested in learning more.

For my Isle of Armor preview usage on Pikalytics, this data sample size is in the tens of thousands of battles, and not quite yet into the hundreds of thousands. Regardless, tens of thousands of battles provide a great sample size for usage statistics, so this data felt meaningful enough for me to share with the public.

As I hand crafted this Showdown Parser for the intention of use on Pikalytics, it very conveniently bundles all of the aggregate data up into a data set that looks like this:

```json
[
    {
        "name": "Rillaboom",
        "isRank": true,
        "types": ["grass"],
        "stats": {
            "hp": 100,
            "atk": 125,
            "def": 90,
            "spa": 60,
            "spd": 70,
            "spe": 85
        },
        "abilities": [
            { "ability": "Grassy Surge", "percent": 1 },
            { "ability": "Overgrow", "percent": 2 }
        ],
        "raw_count": "5",
        "percent": 30,
        "ranking": 1,
        "viability": "F",
        "items": [
            { "item": "Assault Vest", "item_us": "Assault_Vest", "percent": 1 },
            { "item": "Life Orb", "item_us": "Life_Orb", "percent": 2 },
            { "item": "Grassy Seed", "item_us": "Grassy_Seed", "percent": 3 },
            { "item": "Leftovers", "item_us": "Leftovers", "percent": 4 },
            { "item": "Coba Berry", "item_us": "Coba_Berry", "percent": 5 },
            { "item": "Choice Band", "item_us": "Choice_Band", "percent": 6 },
            { "item": "Sitrus Berry", "item_us": "Sitrus_Berry", "percent": 7 },
            { "item": "Miracle Seed", "item_us": "Miracle_Seed", "percent": 8 },
            {
                "item": "Weakness Policy",
                "item_us": "Weakness_Policy",
                "percent": 9
            },
            { "item": "Choice Scarf", "item_us": "Choice_Scarf", "percent": 10 }
        ],
        "spreads": [
            { "nature": "Careful", "ev": "252/0/60/0/196/0", "percent": 1 },
            { "nature": "Adamant", "ev": "180/140/52/0/100/36", "percent": 2 },
            { "nature": "Jolly", "ev": "20/244/4/0/20/220", "percent": 3 },
            { "nature": "Adamant", "ev": "252/116/4/0/132/4", "percent": 4 },
            { "nature": "Impish", "ev": "244/4/180/0/4/76", "percent": 5 },
            { "nature": "Impish", "ev": "140/68/100/0/196/4", "percent": 6 },
            { "nature": "Adamant", "ev": "244/252/4/0/4/4", "percent": 7 },
            { "nature": "Adamant", "ev": "158/252/4/0/76/20", "percent": 8 },
            { "nature": "Adamant", "ev": "252/252/0/0/4/0", "percent": 9 },
            { "nature": "Jolly", "ev": "252/52/4/0/100/100", "percent": 10 },
            { "nature": "Impish", "ev": "252/4/172/0/44/36", "percent": 11 },
            { "nature": "Adamant", "ev": "212/180/44/0/68/0", "percent": 12 },
            { "nature": "Adamant", "ev": "252/188/68/0/0/0", "percent": 13 },
            { "nature": "Impish", "ev": "252/4/140/0/36/76", "percent": 14 },
            { "nature": "Adamant", "ev": "244/192/0/0/44/28", "percent": 15 },
            { "nature": "Adamant", "ev": "252/164/4/0/84/4", "percent": 16 },
            { "nature": "Adamant", "ev": "252/124/12/0/52/68", "percent": 17 },
            { "nature": "Jolly", "ev": "36/252/0/0/0/220", "percent": 18 },
            { "nature": "Adamant", "ev": "252/0/196/0/0/60", "percent": 19 },
            { "nature": "Careful", "ev": "244/4/84/0/172/4", "percent": 20 }
        ],
        "moves": [
            { "move": "Grassy Glide", "percent": 1, "type": "grass" },
            { "move": "Fake Out", "percent": 2, "type": "normal" },
            { "move": "Knock Off", "percent": 3, "type": "dark" },
            { "move": "Wood Hammer", "percent": 4, "type": "grass" },
            { "move": "U-turn", "percent": 5, "type": "bug" },
            { "move": "High Horsepower", "percent": 6, "type": "ground" },
            { "move": "Protect", "percent": 7, "type": "normal" },
            { "move": "Drum Beating", "percent": 8, "type": "grass" },
            { "move": "Drain Punch", "percent": 9, "type": "fighting" },
            { "move": "Superpower", "percent": 10, "type": "fighting" }
        ],
        "team": [
            {
                "pokemon": "Togekiss",
                "percent": "37.797",
                "types": ["fairy", "flying"]
            },
            { "pokemon": "Politoed", "percent": "26.518", "types": ["water"] },
            {
                "pokemon": "Kingdra",
                "percent": "23.400",
                "types": ["water", "dragon"]
            },
            { "pokemon": "Cinderace", "percent": "22.826", "types": ["fire"] },
            { "pokemon": "Porygon2", "percent": "17.884", "types": ["normal"] },
            {
                "pokemon": "Primarina",
                "percent": "17.248",
                "types": ["water", "fairy"]
            },
            {
                "pokemon": "Marowak-Alola",
                "percent": "15.710",
                "types": ["fire", "ghost"]
            },
            {
                "pokemon": "Duraludon",
                "percent": "13.966",
                "types": ["steel", "dragon"]
            },
            {
                "pokemon": "Magnezone",
                "percent": "7.281",
                "types": ["electric", "steel"]
            },
            {
                "pokemon": "Bisharp",
                "percent": "5.107",
                "types": ["dark", "steel"]
            },
            { "pokemon": "Comfey", "percent": "2.933", "types": ["fairy"] }
        ]
    },
    ...
]
```

## Updating the Game Data

With new Pokemon content, comes new game data that isn't yet supported by Pikalytics. Thankfully, Pokemon Showdown has a fantastic open-source community that jumps on this task in a heartbeat once anything new hits the game. [@KrisXV](https://github.com/smogon/pokemon-showdown/pull/6841) put in a huge amount of work at the launch of Isle of Armor to get the Pokemon Showdown dataset fully updated as the data began coming out from the new release. Once the data is all up to date on the main Pokemon Showdown Github repository, [@pkmn/dex](https://github.com/pkmn/ps/blob/master/dex) is a Node.js package maintained to make this data easily accessible to other projects which I utilized to process the new Pokemon, moves, and abilities in the Showdown Parser.

## Sending It Live

At this point, all of the pieces to the puzzle were together, and the Isle of Armor data set was ready to publish on Pikalytics. This is a pretty simple process, that uses a custom deploy pipeline I've built that keeps Pikalytics running through the full deploy until the new data content finishes processing.

Moving forward from initial release, I have continued crawling replays daily to keep Pikalytics up to date as the new format continues to evolve. Last week, Pokemon announced the official ruleset for ranked series 5 which included Terrakion, Cobalion and Verizion, unknown to the community before this announcement. Pokemon Showdown got this format change implemented within a few days, at which point I scrapped the existing Isle of Armor data I had and started fresh to make sure that format is accurate following Terrakion's inclusion.

## Moving Past Isle Launch

Carrying forward, I will continue publishing up to date Isle of Armor usage daily until July 1st when the Pokemon Showdown monthly aggregate will be ready to go. July 1st also brings the start of ranked season 5 on Pokemon Sword & Shield Battle Stadium, allowing me to begin parsing this second data source as well for Pikalytics.

Once July hits, I'll be able to breath again, as Pikalytics will return to the standard data cycle of monthly Pokemon Showdown data updates and 3-4 updates per week of the latest console Battle Stadium data for Isle of Armor.

Early format usage gathering is always a fun and exciting challenge I dive into when a new format begins. Every new season poses fresh challenges and new requirements to develop tools for, so I look forward to the launch of Crown Tundra to start this scramble up again! If you'd like to know anything more about the topics discussed here, I can be reached via my personal Twitter [@gcledingham](https://twitter.com/gcledingham) or via the official [@Pikalytics](https://twitter.com/pikalytics) Twitter where I share frequent updates, and interesting data projects like what I've discussed here.

Until next time.

-Griffin