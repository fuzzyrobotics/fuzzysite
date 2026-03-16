# PTSD: Terminal 01 - Game Rules

A cybersecurity-themed board game for 2–6 players. Hack locations, collect data cards, move market tracks, and score **fame** plus **end-game data value** to win.

---

## Components

- **Gameboard** - Markets (6 tracks, 1–10), market dice spots (Black / Grey / White hat), network scan (1–6), data card deck area.
- **Data cards** - Deck of data cards (see [GAME_CARDS.md](GAME_CARDS.md)). Each card has fragments, suit, SYSM value, and information type (AI Intel, Government, Financial, Personal, Market Intel, Wildcard).
- **Location cards** - Use 3 cards for 2 players, 6 cards for 3–4 players, and 9 cards for 5–6 players; one is turned face up at start. Every two rounds of play, reveal one new location at random until the max number of locations is revealed. Each location lists required fragments, fame reward, and data card reward.
- **Dice** - One d6 per dice spot (market dice + network scan). Roll at setup and mark with cubes.
- **Cubes / tokens** - Mark market and scan values (1–6 or 1–10), control on locations, and player identity if needed.
- **Turn order cards (player aids)** - One per player (Player 1–6); each lists the six turn actions. Jumbo size 3.5" × 5.5" so all actions (including Blockchain) fit.

---

## Setup

1. **Separate all decks**, shuffle them, and place each on its gameboard space. Place the data card deck off to the side of the board.
2. **Roll the dice:** Roll 1d6 for each dice spot (market dice and network scan). Mark each value (1–6) with a cube.
3. **Deal 5 data cards** to each player.
4. **Location cards:** Shuffle the location cards (3 for 2 players, 6 for 3–4 players, 9 for 5–6 players) and place them in the center face down. Turn one at random face up. During play, every two rounds reveal one new location at random until the max number of locations is revealed.
5. **Free program:** Place one free data card from the general supply into one of each player’s three memory stacks (one card per player, in a stack of that player’s choice; each stack holds max 10 cards).

---

## Turn order

Players take turns in order (Player 1, 2, …). On your turn you may perform **one** of the following actions:

---

## On your turn - available actions

1. **Scan.** Draw a number of data cards equal to the value shown on the **network scan** dice spot (1–6).
2. **Disrupt.** Play data cards and use their **suit values** to move any **market track** (1–10) or the **network scan** (1–6) up or down - **one step per suit point**. Played cards go to the general data card discard pile.
3. **Program.** Play a single data card into **one of your three memory stacks** (max 10 cards per stack).
4. **Hack.** Play **one of your memory stacks** against a **location card**. If successful, place **one control cube** on that location. You gain **fame** and **data cards** as shown on the location (e.g. current network scan value + modifier for number of cards - no roll).
5. **Harden** (increase location influence). Discard one data card to the discard pile and add **one of your cubes** to any location card.
6. **Blockchain.** Place **one data card** from your hand into your **personal blockchain pile**. Cards are played **face up** and may be reviewed by any player at any time (public blockchain). At game end, market track values are compared against your blockchain pile: for each market type, multiply that track’s value (1–10) by the total SYSM of that type in your blockchain pile (see Victory).

---

## Board reference

### Markets (data information - end-game multiplier 1–10)

- **Six tracks:** AI Intel, Government, Financial, Personal, Market Intel, Wildcard.
- Each track has a value **1–10**, marked with a cube. Use the **Disrupt** action to move tracks (or the network scan) by playing data cards (suit value = steps).
- At **game end**, each track’s value is compared against your **blockchain pile**: for each data type, multiply that track’s value (1–10) by the **total SYSM** of that type in your blockchain pile (cards you placed there using the **Blockchain** action); sum for all types and add to your fame (see Victory).

### Location cards (reveal during play)

- Start with **one location** face up. **Every two rounds of play**, reveal **one new location** at random (from the face-down pile) until the max number of locations (3, 6, or 9 by player count) is revealed.

### Market dice and deck slots

- **Black hat**, **Grey hat**, **White hat** - each has a **dice spot** (roll d6 at setup, value 1–6) and a **deck slot** (for the data deck or other decks as specified).

### Network scan

- One **dice spot** (d6 at setup, value 1–6). This value is how many data cards you draw when you take the **Scan** action.

---

## Hacking locations

- A **location card** shows: required **program stack** (inputs: fragment identifiers + suit symbols), **required suit value**, **fame** reward, and **data card reward** (e.g. current network scan value + modifier for number of cards - no roll).
- To **Hack**, play one of your **memory stacks** (the cards you’ve programmed there) against the location. If your stack **matches** the location’s required inputs and meets the **required suit value**, the hack succeeds: place **one control cube** on that location, gain the **fame** shown, and draw **data cards** (current network scan value + location modifier - no roll).
- Location **requirements** (e.g. “Market Intelligence”) refer to data card **information type**; see [GAME_CARDS.md](GAME_CARDS.md) for types and wildcards.

---

## End of game - victory and conditions

### End game trigger

The **final round** begins when:

- **All locations have been hacked** and each has at least one player token (control cube) on it.

Complete the current round so everyone has the same number of turns, then score.

### Victory

The player with the **highest total score** wins.

**Score = fame + end-game modifier (blockchain pile)**

- **Fame:** Sum of all fame you gained from successful hacks.
- **End-game modifier:** For each **market type** (AI Intel, Government, Financial, Personal, Market Intel, Wildcard), multiply that **market track’s value** (1–10) by the total SYSM of that type in your **blockchain pile** (cards you placed there using the Blockchain action). Add these products for all six types. Market values are compared against your blockchain pile only - cards in hand do not count for this modifier.

Example: Market Intel track is 8; you have 12 total SYSM in Market Intel cards in your blockchain pile → 8 × 12 = 96 points from that type, divide that by 10 and add that to your fame total. Do the same for the other five types and add everything to your fame.

---

## Quick reference

| Action       | What you do |
|--------------|-------------|
| **Scan**     | Draw data cards = network scan value (1–6). |
| **Disrupt**  | Play cards to move a market track or network scan; 1 step per suit point. Discard played cards. |
| **Program**  | Play one data card into one of your three memory stacks (max 10 per stack). |
| **Hack**     | Play a memory stack vs a location; success → 1 control cube, fame, and data card reward. |
| **Harden**   | Discard one data card to add one of your cubes to a location. |
| **Blockchain** | Place one data card from your hand into your personal blockchain pile (face up; any player may review at any time - public blockchain). Used for end-game market comparison. |

---

For **card schemas**, fragment identifiers, suits, and deck-building (e.g. playable deck, coverage), see **[GAME_CARDS.md](GAME_CARDS.md)**.
