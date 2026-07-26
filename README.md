# Humanitarian Corridors Under Siege: Mariupol 2022

**[Live site](https://ethical-tech-colab.github.io/mariupol-evacuation-model/)** ·
**[Research report](Mariupol-Severity-Model-Paper.md)** (plain-language, non-technical)

**Retrospective decision-support prototype for civilian evacuation under IHL · not operational guidance**

A two-axis evacuation decision matrix combining **Severity** (daily danger from hostilities, deprivation, and infrastructure destruction) and **Feasibility** (satellite-verified building damage, UNOSAT official assessments, and nighttime light loss across evacuation windows) for the siege of Mariupol, 5 March – 20 May 2022.

**Research question.** *How can and should AI tools be used to enhance the protection and evacuation of civilians during armed conflict, and how do they support or challenge obligations under International Humanitarian Law?*

**Central finding.** Modelled severity reaches the level at which evacuation is warranted (Phase 4) from the second week of March 2022; the negotiated evacuation mechanism envisaged by GC IV art. 17 arrived on 30 April — roughly seven and a half weeks later. Whether the binding constraint was consent rather than information is a hypothesis this timing gap raises, not a conclusion the model can establish: the model measures severity only and observes neither what information decision-makers held in real time nor why the mechanism was delayed (see §14.2 and [Peer Review](PEER-REVIEW.md)).

## Quick start

**Live:** https://ethical-tech-colab.github.io/mariupol-evacuation-model/

**Local:** serve the folder (required for JSON data and iframe loading):

```bash
python3 -m http.server
# open http://localhost:8000/
```

Internet is required for base map layers (Leaflet CDN, Esri Wayback Archive imagery, NASA GIBS, OSM).

## What it does

### Axis 1 — Severity

Select any date of the siege and the tool renders: the corridor regime in effect and its route on a schematic front-line map; the observed variables for that date; a six-component severity score with a five-phase classification; and a generated written assessment with legal anchors.

Severity `S` is a generalised power mean (p = 6, weakest-link) of six normalised components — hostility intensity, kinetic proximity, protection risk, cold burden, deprivation clock, infrastructure damage — multiplied by a vulnerability weight (Vw = 1.114). Full definitions: **[docs/METHODOLOGY.md](docs/METHODOLOGY.md)**.

### Axis 2 — Feasibility

Four evacuation windows with:
- **Satellite imagery comparison** — before/after Esri Wayback Archive imagery with opacity slider
- **UNOSAT official damage assessment** — 783 structures (14 Mar 2022) and 5,647 structures (7–12 May 2022) from UNOSAT code CE20220223UKR, overlaid as colour-coded damage markers
- **Nighttime light simulation** — 45,544 building centroids from OSM with deterministic light-survival modelling calibrated to NASA VIIRS Black Marble measurements, visualising infrastructure collapse across siege phases

### Assessment conclusion

A dynamically generated conclusion synthesising severity findings, corridor regime, dominant risk drivers, IHL obligations, and the factual predicate for evacuation — updates with each selected date.

## Repository structure

```
index.html                  combined two-axis decision matrix (main page)
severity.html               Axis 1 — severity model (iframe source)
teresa.html                 Axis 2 — feasibility analysis (iframe source)
severity-standalone.html    original standalone severity page
unosat_mariupol_damage.json UNOSAT damage points (March + May 2022)
mariupol_lights.json        45K building centroids for nighttime light simulation
docs/METHODOLOGY.md         model definitions, formulas, data tables, references
data/                       optional evidence layers (see data/README.md)
imagery/                    optional dated satellite crops (see imagery/README.md)
CITATION.cff                citation metadata
```

## Data sources

| Source | Usage |
|---|---|
| [ACLED](https://acleddata.com) | Armed conflict events, Mariupol raion, Mar–May 2022 |
| [UNOSAT/UNITAR](https://unosat.org) | Satellite-detected building damage (CE20220223UKR) |
| [NASA VIIRS Black Marble](https://blackmarble.gsfc.nasa.gov) | Nighttime light intensity, calibrated against pre-invasion baseline |
| [Planet Labs](https://www.planet.com) | High-cadence satellite imagery for change detection |
| [Esri Wayback Archive](https://livingatlas.arcgis.com/wayback/) | Historical satellite imagery tiles |
| [ERA5 / ECMWF](https://cds.climate.copernicus.eu) | Temperature reanalysis |
| [WorldPop](https://www.worldpop.org) | Gridded population estimates |
| [OpenStreetMap](https://www.openstreetmap.org) | Building footprints (45,544 structures via Overpass API) |

## Honest limits

Retrospective and only partially validated against observed displacement estimates (§F9); event reporting degrades inside a besieged city precisely when severity peaks; normalisation bounds, the p = 6 exponent, and phase thresholds are documented conventions pending re-estimation; district-level demographics in the feasibility axis are author's estimates, not sub-city census data (§F2); the same data fusion that prioritises evacuation could support targeting — movement data is protection-sensitive. Full list in the methodology.

## Citation

See `CITATION.cff`. Front line, controlled areas, and district damage zones are approximate; parties'-conduct summaries are descriptive and attributed (OCHA/ICRC/OHCHR), not adjudicative.

---

## Peer Review

The full independent academic peer review of this report is in [PEER-REVIEW.md](PEER-REVIEW.md) (also available as [Word](peer-review/mariupol-severity-model-Peer-Review.docx) under [`peer-review/`](peer-review/)).

**Recommendation:** Major revisions

**What the review found:**

- The headline claim that "the binding constraint was consent, not information" (S1.6, Foreword) is a causal attribution a severity-only, retrospectively-built model cannot support, contradicting its own S14.2 concession. — **Fixed.**
- The signature "violence never dominates" result (S6.2) is substantially a ceiling artefact (S11.10) and is never tested with a sensitivity analysis. — **Fixed: sensitivity analysis run; the result does not survive.**
- The "daily" framing is undercut by provenance: violence changes only 3 times in 77 days and the cold burden comes from climatology, not 2022 weather (S7.3, S4.5). — **Fixed: ERA5 reanalysis daily mean temperatures now used.**

**Noted strength:** Rare unforced candour (self-flagged citation/data errors), a genuinely original IHL-anchored consent component (S4.4), and fully reproducible arithmetic.


### Revisions applied (peer review, Tier 2)

**The causal headline is demoted to a hypothesis.** "The binding constraint was consent, not information" is no longer presented as a conclusion. This model measures severity only: it observes neither what information decision-makers held in real time nor why the mechanism was delayed, and it is built retrospectively knowing how the siege ended — the wrong instrument for establishing real-time sufficiency of information. S1.6 now splits the claim, keeping prominently the part the model carries (severity reached the warranting level from the second week of March, ~7.5 weeks before the 30 April mechanism) and demoting the causal half to a hypothesis requiring external evidence the model does not contain. The S14.2 caveat is now stated at the same prominence as the finding.

**ERA5 reanalysis temperatures now replace interpolated climatology.** Daily mean temperatures from Open-Meteo Historical Weather API (ERA5, 47.10°N 37.55°E) replace the earlier 10-point interpolated climatology. Notable departures: early March was warmer than assumed (+2.1°C actual vs −1°C), a second cold snap on 17–18 March (−4.6°C) was missed entirely by climatology, and May never reached 18°C. The worked example for 14 March (§3) now shows Protection Risk (R=0.691) as the dominant component rather than Cold (C=0.689 vs the earlier 0.832), with severity dropping from 0.66 to 0.59 — still Phase 4 (High).

**The sensitivity analysis has been run and reported** with ERA5 temperatures (reproduce with `node docs/sensitivity.js`):

| Variant | Violence-dominant days | First day sev ≥ 0.70 |
|---|---|---|
| Published settings (bI=10, bD=60, p=6) | 2 / 77 | 28 Apr |
| bI = 4.8 (observed maximum) | **11 / 77** | 10 Mar |
| bD = 90 | **9 / 77** | never |
| p = 2 | 2 / 77 | never |
| bI = 4.8, bD = 90, p = 6 | **18 / 77** | 10 Mar |

- **Does not survive:** "violence never dominates" — at the published intensity ceiling, protection risk now dominates on 2 days (vs 0 under climatology); with intensity normalised to observed range (bI=4.8), intensity leads on 11 days; combined with bD=90, violence leads on 18 of 77.
- **Does not survive:** the Critical phase. At p=2, p=4, or bD=90 the series never reaches 0.70; at the published settings it peaks at 0.743, barely above the threshold.
- **Does survive:** the deprivation clock leads on 42–56 of 77 days under every variant, and the mid-March timing the headline rests on (severity passes 0.55 on 10 March) is robust.
- **Effect of ERA5 vs climatology:** Protection risk displaces cold as the dominant driver on 14 March (the worked example); cold still dominates 22 days in the baseline. The overall conclusions are robust to the temperature correction.
