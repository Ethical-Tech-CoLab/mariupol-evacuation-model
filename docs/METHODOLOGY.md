# Methodology — Mariupol 2022 Corridor Severity Model

**Retrospective decision-support prototype · severity module of a three-axis evacuation decision matrix · not operational guidance**

An interactive, single-file research tool that computes a daily civilian-protection **severity index** for the siege of Mariupol (5 March – 20 May 2022) from open data, links it to the humanitarian-corridor record, and generates a written situation assessment with legal anchors for any selected date.

**Research question.** *How can and should artificial intelligence tools be used to enhance the protection and evacuation of civilians during armed conflict, and in what ways do they support or challenge the implementation of existing obligations under International Humanitarian Law?*

The tool demonstrates one answer empirically: publicly available data streams (ACLED events, ERA5 climate, WorldPop demographics, UNOSAT damage assessments, the documented corridor record) can be fused into a transparent, auditable daily severity signal — establishing *when* the factual conditions that trigger IHL obligations were met. Its central finding is a timing gap: modelled severity crosses critical thresholds in mid-March 2022, while the negotiated evacuation mechanism that GC IV art. 17 envisages arrived on 30 April, roughly eight weeks after the modelled peak.

---

## 1. The model

### 1.1 Components

Six components, each min–max normalised to `x ∈ [0, 1]` against documented bounds (OECD/JRC 2008, Step 5). Inputs are raw observables; all rates are derived inside the tool.

| # | Component | Definition | Normalisation | Primary source |
|---|-----------|------------|---------------|----------------|
| I | Hostility intensity | ACLED violent events per day inside the city (battles; shelling/air/drone strikes; explosions/remote violence) | `I = ev_per_day / 10` | ACLED [1] |
| P | Kinetic proximity | Armed activity ≤5 km + 0.5 × armed activity ≤15 km, per day (distance-decay weighting) | `P = (imm + 0.5·near) / 6` | ACLED [1] |
| R | Protection risk (retaliation) | Unweighted mean of four sub-indicators — see §1.2 | each sub-indicator ∈ [0, 1] | ACLED [1] · corridor record [10] |
| C | Cold burden | Shortfall of mean daily temperature below the 18 °C healthy indoor minimum (WHO [17]); with district heating, power and water destroyed from ~2 March, outdoor temperature proxies indoor conditions | `C = (18 − T) / 28`, floor −10 °C | ERA5 [7, 16] |
| D | Deprivation clock | Days under encirclement (from 2 March), less a 3-day relief credit per aid convoy reaching the city (Mariupol proper: zero) | `D = (siege_days − 3·convoys) / 60` | Siege timeline · OCHA [10] |
| H | Infrastructure damage | Cumulative share of structures visibly damaged or destroyed, satellite-derived | interpolated between UNOSAT assessment anchors — see §1.3 | UNOSAT [12] · Copernicus EMS [13] |

All values are clamped to [0, 1]. A component at its ceiling is flagged (▲) as saturated; an asymptotic alternative `x = 1 − e^(−t/τ)` avoids exact saturation and is a candidate refinement.

### 1.2 Protection risk sub-indicators

`R = ( CT + L + V + K ) / 4`, where:

- **CT — civilian-targeting share**: civilian-targeting events ÷ all violent events in the window.
- **L — lethality**: fatalities per event, scaled by ceiling 15: `L = min(fatalities/events, 15) / 15`.
- **V — corridor violation history**: share of previously announced corridors on the route that were shelled or blocked. On 8 March 2022 this equals 1.0 (both prior attempts collapsed).
- **K — consent / filtration exposure**, ordinal: negotiated with third-party escort 0.25 · negotiated bilaterally 0.40 · unilateral announcement 0.50 · no ceasefire in effect 0.75 · adversary screening en route (filtration) 0.90. Selecting an adversary-controlled destination raises effective K to ≥ 0.90.

Sub-indicators V and K operationalise the consent conditions attached to evacuation and relief passage under GC IV arts. 17 & 23 and AP I art. 70 [9].

### 1.3 Infrastructure damage anchors (UNOSAT-calibrated)

H is interpolated between published UNOSAT assessment values (code CE20220223UKR) [12] and is a **lower bound** (UNOSAT counts only damage visible in imagery):

| Day index (from 5 Mar) | Date | H | Basis |
|---|---|---|---|
| 0 | 5 Mar | 0.02 | pre-assessment baseline |
| 9 | 14 Mar | 0.04 | 773 of 17,594 structures damaged (~4%), Livoberezhnyi/Zhovtnevyi AOI |
| 21 | 26 Mar | 0.14 | rapid assessment: 16% of 500 m cells damaged (different unit; used qualitatively) |
| 63 | 7 May | 0.32 | 5,647 structures damaged (~32%), imagery 7–12 May |
| 76 | 20 May | 0.33 | end of window |

Azovstal-specific: 220 of 294 structures (~75%) damaged as of 25 April (plant AOI only).

### 1.4 Aggregation — generalised power mean, p = 6

```
S = [ (I⁶ + P⁶ + R⁶ + C⁶ + D⁶ + H⁶) / 6 ] ^ (1/6)
```

A power mean always lies **between the arithmetic mean of the components and their maximum**; the exponent sets where. p = 6 places the composite close to the worst condition — the humanitarian *weakest-link* principle: a population safe from shelling but freezing without water is not "medium severity". A linear average (p = 1) would score the post-March kinetic lull as recovery; the daily series shows why it was not. Limited-compensability aggregation follows the INFORM Severity lineage (ACAPS/JRC) [4] with the compensability parameter made explicit and testable (Decancq & Lugo 2013 [3]; OECD/JRC 2008 [2]).

The sixth powers are an internal weighting device; they are **not shares of causation**.

### 1.5 Severity classification (5 phases)

Presentation follows the INFORM Severity / IPC five-category convention [4]; thresholds are model conventions pending expert-elicitation validation.

| Phase | Range | Label | Indicated posture |
|---|---|---|---|
| 1 | S < 0.20 | Minimal | routine monitoring |
| 2 | 0.20–0.40 | Concern | contingency planning; register vulnerable groups |
| 3 | 0.40–0.55 | Serious | evacuation planning; negotiate access |
| 4 | 0.55–0.70 | High | evacuation warranted |
| 5 | ≥ 0.70 | Critical | immediate protective action |

### 1.6 Vulnerability weighting and priority

Vulnerability multiplies **exposure**, not severity (mirroring the INFORM Severity separation of threat and affected-population measures):

```
Vw = 1 + 0.3·(children + elderly)/N + 0.3·disabled/N
   = 1 + 0.3·(32,926 + 73,723)/343,598 + 0.3·(24,288/343,598)
   = 1.114
Priority = S × Vw
```

Demographics: WorldPop 2022 constrained estimates and age–sex structures [8] within GADM 4.1 boundaries [14]; disability share 7.07% per Ministry of Social Policy / pension-system statistics as reported by the World Bank [15]. The World Bank notes true prevalence is likely closer to the WHO international rate (~16%), so **Vw = 1.114 is conservative**. The 0.3 increments mirror GC IV special-protection categories and CRPD art. 11 and are placeholders for calibration; the elderly/disabled overlap should be corrected where joint distributions exist. Priority is the quantity the full decision matrix ranks against the Feasibility and Destination-viability axes (not yet implemented).

---

## 2. Observed inputs — Mariupol reference case

### 2.1 ACLED-derived kinetic phases (author's extraction, Mariupol raion)

| Phase | Window | Events | Civilian-targeting | Fatalities | ev/day | CT share | Lethality | ≤5 km /day | ≤15 km /day |
|---|---|---|---|---|---|---|---|---|---|
| I | 24 Feb – 9 Mar (14 d) | 54 | 10 | 52 | 3.9 | 0.185 | 0.96 | 1.36 | 1.86 |
| II | 10 – 15 Mar (6 d) | 29 | 14 | 375 | 4.8 | 0.483 | 12.9 | 2.17 | 2.33 |
| III | 16 Mar – 5 May (51 d) | 100 | 10 | 139 | 1.96 | 0.100 | 1.39 | 1.35 | 1.39 |
| IV | post-5 May (extrapolated) | — | — | — | 1.2 | 0.08 | 1.0 | 1.00 | 1.00 |

Phase II is the retaliation window (maternity hospital struck 9 Mar; drama theatre 16 Mar): lethality 12.9 per event and civilian-targeting share 0.483 are its empirical signature.

### 2.2 Corridor regimes

| Regime | Window | V (violation) | K (consent) | Notes |
|---|---|---|---|---|
| Announced corridors — failed | 5–13 Mar | 1.00 | 0.50 | 5–7 Mar corridors collapsed under renewed shelling; Moscow's 7 Mar proposal routed to Russia/Belarus, rejected by Kyiv |
| Self-evacuation | 14 Mar – 29 Apr | 0.67 | 0.75 | private cars via Manhush–Berdiansk to Zaporizhzhia, no ceasefire; parallel eastbound movement via Bezimenne continued |
| Organized humanitarian (UN/ICRC) | 30 Apr – 7 May | 0.60 | 0.25 | agreed after UN Secretary-General's 26 Apr Moscow meetings; convoys to Zaporizhzhia via Bezimenne screening; some evacuees to Russian-controlled territory |
| No organized corridor | 8–20 May | 0.70 | 0.90 | movement subject to filtration; Azovstal surrender completed 16–20 May |

The macro front line in the Zaporizhzhia sector was **static** throughout (W–E: Dnipro/Enerhodar → north of Vasylivka → south of Orikhiv → south of Huliaipole → toward Velyka Novosilka/Vuhledar). Corridor insecurity was a consent problem across stable Russian-held territory, not a shifting-battlefield problem.

### 2.3 Environment and deprivation

Temperature: **ERA5 reanalysis daily mean** (Open-Meteo Historical Weather API, 47.10°N 37.55°E, 2022-03-05 to 2022-05-20) [7, 16]. The 77-day series replaces the earlier interpolated climatology; notable departures from climatological norms include a warmer-than-normal early March (+2.1 °C on 5 Mar vs −1 °C assumed), a second cold snap on 17–18 March (−4.6 °C, −3.4 °C) that climatology missed entirely, and a cooler-than-normal May (never reaching 18 °C). The coldest recorded day was 12 March at −4.0 °C (vs −6 °C assumed at the equivalent climatological anchor). Utilities (heating, power, water) destroyed from ~2 March, so outdoor temperature proxies indoor conditions against the WHO 18 °C healthy indoor minimum [17]. Siege day count starts 2 March. Aid convoys that reached the city: zero (ICRC convoy repeatedly blocked at Berdiansk).

---

## 3. Worked example — 14 March 2022 (day 9)

```
I  = 4.8/10                                   = 0.480
P  = (2.17 + 0.5·2.33)/6                      = 0.556
R  = (0.483 + 12.9/15 + 0.67 + 0.75)/4        = 0.691
C  = (18 − (−1.3))/28                         = 0.689   (ERA5 daily mean)
D  = 12/60                                    = 0.200
H  = 0.040   (UNOSAT 14 Mar assessment)

sixth powers: 0.0122 + 0.0295 + 0.1086 + 0.1072 + 0.0001 + 0.0000 = 0.258
S  = (0.258/6)^(1/6) = 0.59   →  Phase 4 of 5 — High: evacuation warranted
Priority = 0.59 × 1.114 = 0.66
```

Reading: on the day the first cars got out, the gravest threat was **protection risk** (R = 0.691: civilian-targeting share 0.48, lethality 12.9/event, corridor violations at 0.67) — closely followed by cold (−1.3 °C ERA5, day 12 without heating, C = 0.689). Under the earlier interpolated climatology the cold component dominated at 0.832; ERA5 reanalysis shows 14 March was warmer than assumed (−1.3 °C vs −5.3 °C), shifting dominance to protection risk. The composite score drops from 0.66 to 0.59 but remains firmly in Phase 4 (High). Simple average of the six components = 0.44; worst = 0.691; the p = 6 composite (0.59) sits between them, closer to the worst.

---

## 4. IHL framework

The model operationalises obligations rather than replacing legal judgment: GC IV art. 17 (evacuation agreements for besieged areas), GC IV art. 23 & AP I art. 70 (consent and passage of relief), AP I arts. 51 & 57 (protection of civilians; precautions in attack), AP I art. 58 (precautions against the effects of attacks), GC IV art. 49 (forced transfers — engaged by documented filtration transfers), and CIHL Rules 15, 24, 53–55. Severity quantifies the factual predicate — imminent danger, denial of objects indispensable to survival — on which these obligations turn; the corridor-violation and consent indicators measure the gap between announced and honoured commitments.

---

## Axis 2 — Feasibility (Evacuation Route Analysis)

The feasibility axis answers a different question from severity: not *how dangerous is it to stay* but *can people actually leave*. It combines UNOSAT satellite-verified building damage, VIIRS nighttime light survival, and estimated district-level demographics to identify emergency zones, rank them by urgency, and compute least-damage evacuation routes.

### F1. Spatial grid

The analysis area covers the urban core of Mariupol (47.065°N–47.140°N, 37.480°E–37.650°E) divided into a grid of ~250 m cells (0.00225° lat × 0.00335° lon). Each cell aggregates: building count from OSM centroids (45,544 total), UNOSAT damage points, and nighttime light survival state.

### F2. District-level demographics

Population is estimated from building count × district occupancy rate. The city is divided into three districts by longitude:

| District | Lon range | Occupancy (persons/bldg) | Children % | Elderly % | Disabled % | Basis |
|---|---|---|---|---|---|---|
| East / Azovstal | >37.58°E | 8 | 13% | 18% | 4% | Industrial zone, lower-density worker housing |
| Central | 37.52–37.58°E | 14 | 16% | 22% | 5% | Dense Soviet-era apartment blocks |
| West / Prymorskyi | <37.52°E | 11 | 18% | 15% | 3% | Mixed newer residential |

**Source and limitations.** City-level population (~431,000 pre-invasion) from WorldPop 2022 constrained estimates [8]; age structure from WorldPop age-sex pyramids for Donetsk Oblast. **District-level occupancy rates and the three-district split are author's estimates** based on building-type proxies (industrial vs Soviet apartment vs mixed residential), not from a sub-city census. The child/elderly/disabled percentages are plausible given the Donetsk Oblast age profile (older-skewing, post-industrial) but should be treated as illustrative pending district-level demographic data. Disability rate 3–5% is conservative relative to the Ministry of Social Policy figure (7.07% nationally) [15].

### F3. Vulnerability weight

Same formulation as severity (§1.6):

```
Vw = 1 + 0.3·(children + elderly) / pop + 0.3·disabled / pop
```

Applied per grid cell using district-level demographic rates. The 0.3 increments mirror GC IV special-protection categories (art. 17: children, maternity cases, sick/infirm; art. 49: protected persons).

### F4. Urgency formula

Each grid cell with buildings receives an urgency score:

```
urgency = vulnPop × Vw × (dmgRate + darkRatio × 0.5) × (1 + destrRate)
```

Where:
- `vulnPop` = children + elderly + disabled in the cell
- `Vw` = vulnerability weight (§F3)
- `dmgRate` = UNOSAT damaged buildings / total buildings in cell
- `darkRatio` = 1 − (lights surviving / total buildings), calibrated to VIIRS Black Marble
- `destrRate` = (destroyed + severely damaged) / total buildings
- The 0.5 coefficient on `darkRatio` reflects that light loss is a proxy for infrastructure damage, not a direct measure of physical danger — it is given half the weight of satellite-verified structural damage
- The `(1 + destrRate)` multiplier gives additional priority to cells where damage is not merely moderate but includes destroyed structures

**Limitation.** The weights (0.5 on darkness, 1.0 on damage) and the multiplicative structure are documented conventions chosen for face validity, not calibrated against observed evacuation outcomes. No sensitivity analysis has been run on these parameters.

### F5. Emergency zones

The top-urgency cells are selected as zone centres, with a minimum separation of 500 m (to avoid clustering). Each zone aggregates all cells within 400 m. Up to 5 zones are identified per window. Zones are ranked by urgency score.

### F6. Route computation (Dijkstra pathfinding)

Least-cost routes from each emergency zone to the western city exit (47.072°N, 37.482°E — toward Manhush–Berdyansk–Zaporizhzhia) are computed on the 250 m grid using Dijkstra's algorithm with the following cost model:

| Condition | Cost |
|---|---|
| Clear cell (base) | 1.0 (or 1.414 diagonal) |
| Damaged cell | +8 × (damaged / buildings) |
| Dark cell (<30% lights) | +3 |
| Impassable (>40% damaged or >25% destroyed) | +50 |

Routes are scored by counting UNOSAT damage points within a 200 m buffer of the path.

**Limitation.** The grid resolution (250 m), passability thresholds, and cost weights are reasonable approximations but are not validated against actual road conditions or observed movement patterns. The pathfinding does not account for rubble, unexploded ordnance, or active fighting along routes.

### F7. Corridor regimes

Each of four evacuation windows is tagged with the corridor regime in effect:

| Window | Dates | Status | IHL basis | Source |
|---|---|---|---|---|
| W1 | 5–9 Mar 2022 | FAILED | GC IV art. 17 corridor envisaged; consent withdrawn in practice | OCHA SitReps 3–6 [18]; ICRC press release 5 Mar [19] |
| W2 | 14–16 Mar | SELF-EVAC ONLY | No art. 17 mechanism; civilians depart at own risk | OCHA SitRep 11 [18]; OHCHR [11] |
| W3 | Late Mar–Apr | SELF-EVAC / DISPUTED | Russia proposes eastward corridor to Bezimenne; Ukraine rejects under GC IV art. 49 (forced transfer) | OCHA SitRep 14 [18]; ICRC 21 Mar, 25 Mar [19] |
| W4 | 30 Apr–7 May | ORGANIZED (UN/ICRC) | GC IV art. 17 operational; ~500 civilians extracted from Azovstal | UNSG Moscow 26 Apr [20]; OCHA [18] |

Route rendering reflects corridor status: dashed lines when corridor is failed or self-evacuation only (W1–W3); solid lines when organized evacuation is operational (W4).

### F8. Russian-proposed eastward route

During W3, Russia proposed evacuation corridors from Mariupol eastward to Bezimenne and Dokuchaievsk (Russian-controlled territory). Ukraine rejected these as constituting forced transfer under GC IV art. 49. The route is rendered on the map as a dashed line with X marks and "REJECTED" label, showing only during W3. Source: OCHA SitReps [18]; Ukraine government statements reported in OHCHR monitoring reports [11].

### F9. Partial validation against observed outcomes

UNHCR and IOM reception-centre data from Zaporizhzhia provide partial validation:
- By late March 2022, an estimated 100,000–150,000 civilians had left Mariupol, primarily via self-evacuation (private vehicles through Manhush–Berdyansk). Source: OCHA SitReps, UNHCR Flash Updates.
- The UN/ICRC Azovstal operation (30 Apr–7 May) extracted approximately 500 civilians from the steelworks complex. Source: UN OSCE, ICRC statements.
- Total displacement from Mariupol by mid-May estimated at 200,000–250,000 of the pre-invasion ~431,000 population. Source: OCHA, Mariupol city council statements.

The model's zone rankings have not been validated against where casualties or departures were concentrated. The feasibility axis remains a retrospective prototype, not a validated predictive tool.

---

## 5. Limitations

1. **Data degrades when needed most** — event reporting inside a besieged city collapses precisely at peak severity.
2. **Retrospective** — built with knowledge of how the siege ended; a real-time deployment faces uncertainty this prototype does not.
3. **Partially validated** — UNHCR/IOM displacement estimates are consistent with the model's timing (§F9), but zone-level rankings have not been tested against observed departure flows or casualty distributions.
4. **Judgment inside the numbers** — normalisation ceilings, the p = 6 exponent, ordinal consent values, the 0.3 vulnerability increments, and phase thresholds are documented conventions, defensible but adjustable; bounds should be re-estimated as distribution percentiles for publication.
5. **One axis of three** — severity measures how dangerous it is to stay; Feasibility and Destination viability (including filtration exposure) are separate, partly legal-political axes.
6. **Dual use** — the same data fusion that prioritises evacuation could support targeting or screening; movement data is protection-sensitive.
7. **H is a lower bound** and, until the UNOSAT geodata is supplied, per-building damage display is illustrative; kinetic rates are held constant within phases; front line and controlled areas are approximate.
8. **District demographics are illustrative** — the three-district split and occupancy/age rates (§F2) are author's estimates based on building-type proxies, not sub-city census data.
9. **Urgency weights are unvalidated** — the 0.5 coefficient on darkness and the multiplicative structure of the urgency formula (§F4) are conventions chosen for face validity; no sensitivity analysis has been run on these parameters.
10. **Route costs are approximate** — the Dijkstra pathfinding (§F6) does not account for rubble, UXO, active fighting, or road conditions; cost weights are not calibrated against observed movement.

## 6. References

1. Raleigh, C., Linke, A., Hegre, H. & Karlsen, J. (2010). Introducing ACLED: An Armed Conflict Location and Event Dataset. *Journal of Peace Research* 47(5), 651–660. Data: acleddata.com.
2. OECD & EC Joint Research Centre (2008). *Handbook on Constructing Composite Indicators: Methodology and User Guide*. OECD Publishing.
3. Decancq, K. & Lugo, M. A. (2013). Weights in Multidimensional Indices of Wellbeing: An Overview. *Econometric Reviews* 32(1), 7–34.
4. ACAPS & EC Joint Research Centre (2020). *INFORM Severity Index: Methodology Note*.
5. Sphere Association (2018). *The Sphere Handbook: Humanitarian Charter and Minimum Standards in Humanitarian Response*, 4th ed.
6. ICRC (2018). *Professional Standards for Protection Work*, 3rd ed.
7. Hersbach, H. et al. (2020). The ERA5 Global Reanalysis. *Quarterly Journal of the Royal Meteorological Society* 146, 1999–2049.
8. Bondarenko, M. et al. (2020). Census/projection-disaggregated gridded population datasets. WorldPop, University of Southampton. Age–sex structures: hub.worldpop.org/geodata/summary?id=75852.
9. Geneva Convention IV (1949), arts. 17, 23, 49; Additional Protocol I (1977), arts. 51, 57, 58, 70; ICRC Customary IHL Study, Rules 15, 24, 53–55.
10. UN OCHA (2022). *Ukraine: Humanitarian Impact Situation Reports*, March–May 2022.
11. UN OHCHR / Human Rights Monitoring Mission in Ukraine (2022). Reports on the treatment of civilians and forced transfers, Ukraine.
12. UNITAR/UNOSAT (2022). Damage assessments, Mariupol, Donetsk Oblast, Ukraine (code CE20220223UKR). Geodata via data.humdata.org.
13. Copernicus Emergency Management Service (2022). Rapid Mapping activations, Ukraine.
14. GADM (2022). Database of Global Administrative Areas, v4.1. gadm.org/download_country.html.
15. World Bank (2024). *Ukraine Human Development Update — In Focus: Disability and Inclusion*, February 2024 (reporting Ministry of Social Policy / pension-system disability statistics). documents.worldbank.org, doc. 099032824073057091.
16. Open-Meteo (2024). Historical Weather API, based on ERA5 reanalysis data from Copernicus Climate Change Service (C3S). open-meteo.com/en/docs/historical-weather-api.
17. World Health Organization (2018). *WHO Housing and Health Guidelines*. WHO, Geneva. The 18 °C healthy indoor minimum is from this source, not the Sphere Handbook (correcting the earlier mis-attribution noted in §12.1 of the research report).
18. UN OCHA (2022). *Ukraine — Humanitarian Impact Situation Report*, No. 3 (5 Mar), No. 4 (6 Mar), No. 5 (7 Mar), No. 6 (9 Mar), No. 7 (12 Mar), No. 11 (16 Mar), No. 14 (25 Mar). reliefweb.int.
19. ICRC (2022). Press releases: "Ukraine: ICRC calls for immediate implementation of agreements to allow aid into Mariupol" (5 Mar); "Ukraine: Mariupol — days of shelling leave trail of death and destruction" (21 Mar); "ICRC statement on humanitarian convoy to Mariupol" (25 Mar). icrc.org.
20. UN Secretary-General (2022). Press encounter, Moscow, 26 April 2022. un.org/sg/en/content/sg/press-encounter/.
21. UN OSCE Special Monitoring Mission (2022). Daily reports, March–May 2022. Reports on corridor violations and civilian targeting.

---

*Author: Christine — research prototype accompanying work on AI, civilian protection, and IHL. Front line, controlled areas, and district damage zones are approximate; parties'-conduct summaries are descriptive and attributed, not adjudicative. Not operational guidance.*
