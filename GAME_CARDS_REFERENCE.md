# Game Cards Reference - Rules to Recreate Cards

This document describes the **exact rules and schemas** for the two card types in this cybersecurity board game. Use it when generating, validating, or editing card data (e.g. as JSON or CSV), or when prompting an LLM to produce cards.

---

## Overview

- **Data cards**: Player-collectible cards with 1–5 **fragments**. Each fragment has an **identifier** and a **suit symbol**. Cards have rarity, value (SYSM 1–50 from suit + fragments + type, scaled), suit, and information type.
- **Location cards**: Hack targets that list **inputs** (2–5 required fragments). Each input is an (identifier, suit_symbol) pair. Locations have fame, card reward range, and a **required_suit_value** (number to match).
- **Market cards**: Rule-breaking, special event, or assist cards for the three market deck slots (Black hat, Grey hat, White hat). Acquired via the market dice spots on the board. Each deck has a distinct theme.

The **data deck** must contain enough fragments so that, for every (identifier, suit) pair required by the location deck, the count of that pair across all data card fragments is at least the count required by location inputs. Use `--report-fragments` and `--location-deck` to check playability.

### Deck sizes and playable game

- **Full playable location deck**: **24** location cards. A standard game uses a deck of 24 location cards.
- **Smaller playable set**: **12** location cards is enough for a shorter game or testing.
- **Playable game (N players)**: You need enough **data cards** so that the data deck's fragment coverage is at least **N×** the required count for each (identifier, suit) pair. Use `--playable-deck` with `--playable-players N` (default 2): the script generates a **data card pool** (default 128), then **24 location cards** (default) whose required fragments are assigned from that pool, then **selects** a subset of data cards (default 110) for the final deck so coverage is guaranteed for N players.

---

## Shared Constants

### Fragment identifiers (must be exactly one of these)

Use **only** these 16 identifiers for fragments (data cards) and inputs (location cards). Any other value is normalized to `SYS` at render time.

| Identifier | Identifier | Identifier | Identifier |
|------------|------------|------------|------------|
| ACC        | KEY        | AUTH       | LOCK       |
| DATA       | INFO       | FILE       | MEM       |
| NET        | PROT       | CONN       | PIPE      |
| SYS        | CORE       | BASE       | ALPHA     |

### Suit symbols

Exactly one of: **HKT**, **CRK**, **BRK**, **BYP**. Stored with brackets in JSON: `[HKT]`, `[CRK]`, `[BRK]`, `[BYP]`.

- HKT = Hack (value 1) - cyan  
- CRK = Crack (value 2) - yellow  
- BRK = Break (value 3) - red  
- BYP = Bypass (value 4) - purple  

### Fragment identifier → display color (for rendering)

- ACC, KEY, AUTH, LOCK → `#cc0000`
- DATA, INFO, FILE, MEM → `#0033aa`
- NET, PROT, CONN, PIPE → `#33ff33`
- SYS, CORE, BASE, ALPHA → `#ff9900`

Unknown identifiers fall back to `#ffffff`.

---

## Data card schema

**Physical:** Poker size 2.5" × 3.5" (64mm × 89mm), portrait.

### Required / normalized fields

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | Card title (e.g. "Encrypted Database File"). |
| `program_name` | string | Fake CLI script, e.g. "decrypt_db_B2C.sh --encrypt". Use `.sh` and optional flags; should be unique per card. |
| `information_type` | string | **Typically** one of: AI Intelligence, Government, Financial, Personal, Market Intelligence. Other values (e.g. Exploitation, Core) are allowed - see *Wild types* below. |
| `value` | integer | SYSM currency. **1–50.** Set by normalization: suit_value (1–4) + fragment_count (1–5) + type_bonus (0–6), scaled to 1–50. Omit when generating; any provided value is overwritten. |
| `rarity` | string | **Exactly one of:** Common, Uncommon, Rare, Epic, Legendary. (Display only; SYSM is no longer tied to rarity.) |
| `suit` | string | One of: Hack, Crack, Break, Bypass. |
| `suit_symbol` | string | Matching code: [HKT], [CRK], [BRK], or [BYP]. |
| `suit_value` | integer | 1 (Hack), 2 (Crack), 3 (Break), 4 (Bypass). |
| `fragments` | array | **1–5** objects. See fragment object below. Do not include `code` when generating; it is derived from card + thematic hex. |
| `flavor_text` | string | One short evocative line. No newlines inside. |
| `description` | string | One sentence. No newlines inside. |
| `uuid` | string | Optional. If missing, generated from card content as full UUID (e.g. UUID-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX). |

**Wild types (gameplay):** Data cards with a non-canonical `information_type` (e.g. Exploitation, Core, or any label not in the canonical list) are **wild** for location requirements. When a location shows e.g. **REQ: Market Intelligence x 3**, a data card with a wild type can satisfy that requirement as if it were that type. Canonical types match only their own REQ; wild types match any REQ.

**SYSM value (1–50):** Normalization sets `value` from **suit value** (1–4) + **fragment count** (1–5) + **type bonus** (0–6 by information type), scaled so the raw sum (3–15) maps to 1–50. Wild/unknown types use bonus 3.

### Fragment object (data card)

- `identifier` (string): Exactly one of the 16 identifiers above (e.g. ACC, DATA, NET).
- `suit_symbol` (string): One of [HKT], [CRK], [BRK], [BYP].
- `code` (string): Optional. If omitted, generated as `[IDENT-HEX]` where HEX is a 6-character thematic hex code (hexspeak) derived from card name, rarity, suit, information_type, fragment index.

### Data card JSON example

```json
{
  "name": "Encrypted Database File",
  "program_name": "decrypt_db_B2C.sh --encrypt",
  "information_type": "AI Intelligence",
  "value": 13,
  "rarity": "Epic",
  "suit": "Bypass",
  "suit_symbol": "[BYP]",
  "suit_value": 4,
  "fragments": [
    {"identifier": "ACC", "suit_symbol": "[HKT]"},
    {"identifier": "DATA", "suit_symbol": "[CRK]"},
    {"identifier": "NET", "suit_symbol": "[BRK]"}
  ],
  "flavor_text": "Fragmented data streams whisper through the void",
  "description": "An AI intelligence card containing encrypted data fragments."
}
```

### Generation notes (data cards)

- Use **unique** `program_name` per card (vary script name and flags).
- For balanced deck coverage, rotate (identifier, suit) pairs across generated cards so the deck can satisfy location requirements (e.g. use `--balanced-fragments` in the generator).

---

## Location card schema

**Physical:** Jumbo horizontal 5.5" × 3.5", landscape.

### Required / normalized fields

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | Location name (e.g. "NEXUS SYSTEMS HQ"). Should be **unique** per card. Vary type: corporate, government, university, healthcare, infrastructure. |
| `program_name` | string | Fake CLI script, e.g. "firewall.sh --defense-intermediate". |
| `fame` | integer | 5–70. |
| `card_range` | string | Optional, legacy. Display is now **fame-based** (see below). |
| `card_reward_die` | string | **Derived from fame** when normalizing. One of **d6**, **d8**, **d10**. Higher fame → better die. Roll this die for number of data cards. Displayed as a die icon on the card. |
| `card_reward_modifier` | integer | **Derived from fame** when normalizing. Modifier added to the die roll (e.g. +2). Higher fame → higher modifier. Shown next to the die icon when > 0. |
| `required_suit_value` | integer | 1–6. **Derived from fame** when normalizing: higher fame → higher value (fame 5→1, fame 70→6). Kept low so targets are achievable. Displayed prominently on the card (target number to match with playing cards). |
| `inputs` | array | **2–5** objects. Each has `identifier` and `suit_symbol` (same rules as data card fragments). Do not use identifiers outside the 16-identifier list. |
| `flavor_text` | string | One short line. |
| `requirements` | string | **Type of data cards** this location requires. Use the **exact same** label as data card `information_type`: "Government", "Market Intelligence", "Personal", "AI Intelligence", "Financial", "Educational", or "Surveillance". Shown as REQ: (type) x (required_suit_value). Normalization maps variants (e.g. "Government Intelligence Cards") to these labels so they match the data card type bar. |
| `uuid` | string | Optional. If missing, derived from location specifics (name, location_type, program_name, fame, required_suit_value, inputs, requirements) so the same card always gets the same UUID. |

### Input object (location card)

- `identifier` (string): Exactly one of the 16 fragment identifiers (ACC, KEY, AUTH, LOCK, DATA, INFO, FILE, MEM, NET, PROT, CONN, PIPE, SYS, CORE, BASE, ALPHA). **Do not use** DNA, LAB, CRK, HKT, etc. as identifiers (CRK/HKT/BRK/BYP are suit symbols, not identifiers).
- `suit_symbol` (string): One of [HKT], [CRK], [BRK], [BYP].
- `code` / `hex`: Optional; can be generated from card + index if omitted.

### Location card JSON example

```json
{
  "name": "NEXUS SYSTEMS HQ",
  "program_name": "firewall.sh --defense-intermediate",
  "fame": 70,
  "card_range": "3-8",
  "required_suit_value": 6,
  "inputs": [
    {"identifier": "ACC", "suit_symbol": "[HKT]"},
    {"identifier": "DATA", "suit_symbol": "[CRK]"}
  ],
  "flavor_text": "Data streams whisper through the void",
  "requirements": "Market Intelligence"
}
```

### Data card reward (die + modifier) from fame

When location cards are normalized, `card_reward_die` and `card_reward_modifier` are **set from fame** (any `card_range` or existing values are overwritten). Higher fame gives a better reward:

| Fame (approx) | Reward (roll for # of data cards) |
|---------------|-----------------------------------|
| 5–17          | 1d6+0 (1–6)                       |
| 18–30         | 1d6+1 (2–7)                       |
| 31–43         | 1d8+1 (2–9)                       |
| 44–56         | 1d8+2 (3–10)                      |
| 57–65         | 1d10+2 (3–12)                     |
| 66–70        | 1d10+3 (4–13)                     |

### required_suit_value from fame

When location cards are normalized, `required_suit_value` is **set from fame** (any existing value is overwritten): fame 5 → 1, fame 70 → 6, with linear scaling in between. Values are kept in the 1–6 range so targets stay achievable. Higher-fame locations always require a higher suit value to hack.

### REQ: type × number (gameplay)

Location cards show **REQ: (type) × (number)** (e.g. **REQ: Government × 5**). This means:

1. **Type** - The data cards you play to attempt this location must be of that **information type** (e.g. Government). Wild-type data cards (non-canonical types like Exploitation or Core) count as any type.
2. **Number** - The **sum of suit values** of the data cards you play must be **≥ that number**. Each data card has a suit value 1–4 (Hack=1, Crack=2, Break=3, Bypass=4). So for **× 5** you need multiple cards whose suit values add up to at least 5 (e.g. Bypass (4) + Hack (1), or Break (3) + Crack (2)).

The number is **not** "how many cards" and **not** SYSM value - it is the **total suit value** from your played stack. You must satisfy both: correct type (or wild) and enough suit value.

### Location importance scale (fame from type and inputs)

You can **rate locations by importance** so fame (and thus `required_suit_value` and card reward) is set from what the location represents:

1. **Location type** – Set `location_type` or `importance_tier` to one of: **residential**, **commercial**, **education**, **healthcare**, **government**, **critical_infrastructure**. Each tier has a fame range (e.g. residential 5–18, government 38–58, critical_infrastructure 48–70).
2. **Number of inputs** – More required fragments = harder target = higher fame. The normalizer adds a small bonus per extra input within the tier range.
3. **Optional minimum difficulty** – Set `min_required_suit_value` (1–6) to force at least that difficulty; fame will be raised so that the derived `required_suit_value` is at least this value.

If you **do not** set `location_type` / `importance_tier`, the generator **infers** a tier from the location **name** using keywords (e.g. "federal", "university", "hospital", "apartment"). If no tier is set or inferred, existing `fame` on the card is used as-is.

**Tier → fame range (approximate):**

| Tier | Fame range | Examples |
|------|------------|----------|
| residential | 5–18 | Apartment, home, small building |
| commercial | 12–28 | Office, retail, corporate HQ |
| education | 20–38 | School, university, research lab |
| healthcare | 28–48 | Clinic, hospital, pharmacy |
| government | 38–58 | Municipal, state, federal |
| critical_infrastructure | 48–70 | Grid, telecom, defense, core network |

**Optional fields for scaling:**

| Field | Type | Effect |
|-------|------|--------|
| `location_type` or `importance_tier` | string | One of the six tiers above. Fame is computed from this + `inputs` length. |
| `min_required_suit_value` | integer | 1–6. If set, fame is at least the value that yields this required_suit_value. |

When a tier is used (explicit or inferred), **fame is overwritten** from the scale; then `required_suit_value` and `card_reward_die` / `card_reward_modifier` are derived from that fame as above.

### Generation notes (location cards)

- Use a **unique** location name every time (no repeating "TECH CORPORATION ALPHA").
- Vary location type: corporate, government, university, healthcare, infrastructure.
- Optional **location context**: card names can be tied to a city/region (e.g. Berlin, or resolved from zipcode/area-code) so names reference that place.

---

## Market card schema (Black hat, Grey hat, White hat)

Three market decks sit on the gameboard (Black hat, Grey hat, White hat). Each deck slot has a dice spot (d8 at setup). Market cards are rule-breaking cards, special events, or assist items that players acquire and play during the game.

**Physical:** Poker size 2.5" × 3.5" (64mm × 89mm), portrait.

### Deck types and themes

| `deck_type` | Theme | Card purpose |
|-------------|-------|--------------|
| `black_hat` | Malicious / rule breaking | Break rules, sabotage opponents, bend or ignore game constraints |
| `grey_hat` | Opportunistic / special events | Global events, twists, situational effects that affect all or multiple players |
| `white_hat` | Defensive / assist | Help the player: bonuses, protection, extra draws, easier hacks |

### Required / normalized fields

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | Card title (e.g. "Zero-Day Exploit", "Market Glitch", "Defensive Patch"). |
| `deck_type` | string | **Exactly one of:** `black_hat`, `grey_hat`, `white_hat`. Determines which deck this card belongs to. |
| `effect` | string | Short mechanical text: what happens when the card is played. Be specific and unambiguous (e.g. "Ignore location requirements for your next Hack attempt", "All players discard 1 card", "Draw 3 extra data cards"). |
| `flavor_text` | string | One short evocative line. No newlines inside. |
| `description` | string | One sentence explaining the card. No newlines inside. |
| `uuid` | string | Optional. If missing, generated from card content. |

### Optional fields

| Field | Type | Rules |
|-------|------|--------|
| `cost` | string | How to acquire/play (e.g. "Pay 5 SYSM", "Discard 1 data card", "Roll ≥ 5 on market die"). Shown on card if present. |
| `play_timing` | string | When the card can be played (e.g. "On your turn", "Any time", "When another player Hacks"). |

### Market card JSON examples

**Black hat:**
```json
{
  "name": "Zero-Day Exploit",
  "deck_type": "black_hat",
  "effect": "Ignore location requirements for your next Hack attempt.",
  "flavor_text": "They never saw it coming.",
  "description": "Use an unpatched vulnerability to bypass target checks."
}
```

**Grey hat:**
```json
{
  "name": "Market Glitch",
  "deck_type": "grey_hat",
  "effect": "All players move one market track of your choice up or down by 2.",
  "flavor_text": "Chaos is a ladder.",
  "description": "A trading anomaly ripples through the data markets."
}
```

**White hat:**
```json
{
  "name": "Defensive Patch",
  "deck_type": "white_hat",
  "effect": "Add +2 to the suit value of your next Hack attempt.",
  "flavor_text": "Fortify before you strike.",
  "description": "Reinforce your stack with extra exploit value."
}
```

### Generation notes (market cards)

- Use **unique** card names; vary theme: exploits, backdoors, scripts (black hat); glitches, disruptions, events (grey hat); tools, patches, safeguards (white hat).
- `effect` must be clear, short, and game-mechanic specific. Avoid vague wording.
- Match `deck_type` to the intended deck when generating (or filter by deck when rendering).

---

## Deck playability

- **Data deck**: All data cards; each card contributes its fragments (identifier, suit_symbol) to a global count.
- **Location deck**: All location cards; each card's `inputs` define **required** (identifier, suit) counts.
- **Playable**: For every (identifier, suit) pair, the data deck's count for that pair must be ≥ the location deck's required count for that pair.
- The generator can report coverage with `--report-fragments` and `--location-deck <path>`.

---

## Output format

- Cards are rendered from **JSON** or **CSV** via Jinja2 templates (`data_card_sheet.html`, `location_card_sheet.html`, `market_card_sheet.html`).
- CSV: use columns for card fields; fragments/inputs can be in columns like `fragment_1`, `fragment_2` or combined (e.g. `HKT:ACC`).
- **UUID**: Rendered as full format `UUID-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` (32 hex chars, dashed). Generated with RFC 4122 UUID version 5 (name-based) and **card type encoded in the first hex digit**: `0` = data, `1` = location, `2` = market. Use `card_normalize.decode_uuid_card_type(uuid_str)` to get `'data'`, `'location'`, or `'market'` from a UUID without a lookup; full card details still require a deck lookup.
- **Fragment display**: Each fragment is shown as identifier + thematic 6-char hex, e.g. `[ACC-B01CE0]`. Suit and identifier use the colors above.

---

## Quick checklist for LLM-generated cards

**Data card**

- [ ] `name`, `program_name` (unique), `information_type`, `value`, `rarity`, `suit`, `suit_symbol`, `suit_value`
- [ ] `fragments`: 1–5 items; each `identifier` in {ACC, KEY, AUTH, LOCK, DATA, INFO, FILE, MEM, NET, PROT, CONN, PIPE, SYS, CORE, BASE, ALPHA}; each `suit_symbol` in {[HKT], [CRK], [BRK], [BYP]}
- [ ] `value` matches `rarity` (Common=20, Uncommon=30, Rare=45, Epic=70, Legendary=120)
- [ ] `flavor_text`, `description` (no newlines inside strings)

**Location card**

- [ ] `name` (unique), `program_name`, `fame` (5–70). `card_reward_die`/`card_reward_modifier` and `required_suit_value` are derived from fame.
- [ ] `inputs`: 2–5 items; each `identifier` in the same 16-identifier set; each `suit_symbol` in {[HKT], [CRK], [BRK], [BYP]}
- [ ] `flavor_text`, `requirements`
- [ ] Do **not** use CRK, HKT, BRK, BYP, DNA, LAB, etc. as identifiers - only as suit symbols where appropriate

**Market card**

- [ ] `name`, `deck_type` (exactly `black_hat`, `grey_hat`, or `white_hat`), `effect`, `flavor_text`, `description`
- [ ] `effect` must be specific and mechanic-oriented (what exactly happens when played)
- [ ] Optional: `cost`, `play_timing`

---

*This file is the single source of rules for recreating or validating game cards in this project.*
