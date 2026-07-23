# Mariupol 2022 — Corridor Severity Model

**[Live site](https://ethical-tech-colab.github.io/mariupol-evacuation-model/)** ·
**[Research report](Mariupol-Severity-Model-Paper.md)** (plain-language, non-technical)

**Retrospective decision-support prototype for civilian evacuation under IHL · not operational guidance**

An interactive, single-file research tool that computes a daily civilian-protection **severity index** for the siege of Mariupol (5 March – 20 May 2022) from open data — ACLED events, ERA5-referenced temperature, WorldPop demographics, UNOSAT damage assessments, and the documented humanitarian-corridor record — and generates a dated situation assessment with legal anchors.

**Research question.** *How can and should AI tools be used to enhance the protection and evacuation of civilians during armed conflict, and how do they support or challenge obligations under International Humanitarian Law?*

**Central finding.** Modelled severity crosses critical thresholds in mid-March 2022; the negotiated evacuation mechanism envisaged by GC IV art. 17 arrived on 30 April — roughly eight weeks after the modelled peak. The binding constraint was not information but consent.

## Quick start

**Live:** enable GitHub Pages on this repository (Settings → Pages → main branch) and open the site — `index.html` is the entire tool.

**Local:** the optional data layers require HTTP, so serve the folder rather than double-clicking:

```bash
python3 -m http.server
# open http://localhost:8000/
```

Internet is required for the base map layers (Leaflet CDN, Esri imagery, NASA GIBS, OSM).

## What it does

Select any date of the siege (timeline, day arrows, event navigation, or corridor-phase buttons) and the tool renders: the corridor regime in effect and its route on a schematic front-line map; a satellite view (dated MODIS regional / interactive city mosaic / OSM building footprints with date-filtered damage colouring); the observed variables for that date; a six-component severity score with a five-phase classification and a plain-language driver sentence; and a generated written assessment with numbered references.

Severity `S` is a generalised power mean (p = 6, weakest-link) of six normalised components — hostility intensity, kinetic proximity, protection risk, cold burden, deprivation clock, infrastructure damage — multiplied by a vulnerability weight (Vw = 1.114) into a priority index. Full definitions, bounds, observed data tables, and a worked example: **[docs/METHODOLOGY.md](docs/METHODOLOGY.md)**.

## Repository structure

```
index.html            the tool (single file)
docs/METHODOLOGY.md   model definitions, formulas, data tables, worked example, references
data/                 optional evidence layers (see data/README.md)
imagery/              optional dated satellite crops per corridor phase (see imagery/README.md)
CITATION.cff          citation metadata
LICENSE               MIT (code); data sources retain their own terms
```

## Data layers (optional, recommended)

| File | Source | Effect |
|---|---|---|
| `data/unosat_mariupol.geojson` | UNOSAT via [HDX](https://data.humdata.org), code CE20220223UKR | replaces illustrative damage layers with real per-building assessments, date-filtered |
| `data/osm_buildings.json` | Overpass API (command in `data/README.md`) | offline, instant building-footprint mode |
| `imagery/{failed,self,human,none}.jpg` | e.g. Sentinel-2 exports, [Copernicus Browser](https://dataspace.copernicus.eu) | dated high-resolution crops per corridor phase |

Until the UNOSAT file is supplied, per-building damage colouring is assigned from a district-level chronology and is labelled **illustrative** throughout the interface.

## Honest limits

Retrospective and not validated against observed departure flows; event reporting degrades inside a besieged city precisely when severity peaks; normalisation bounds, the p = 6 exponent, and phase thresholds are documented conventions pending re-estimation; severity is one axis of a three-axis decision matrix (Feasibility and Destination viability are not implemented); the same data fusion that prioritises evacuation could support targeting — movement data is protection-sensitive. Full list in the methodology.

## Citation

See `CITATION.cff`. Front line, controlled areas, and district damage zones are approximate; parties'-conduct summaries are descriptive and attributed (OCHA/ICRC/OHCHR), not adjudicative.

---

## Peer Review

The full independent academic peer review of this report is in [PEER-REVIEW.md](PEER-REVIEW.md) (also available as [Word](peer-review/mariupol-severity-model-Peer-Review.docx) under [`peer-review/`](peer-review/)).

**Recommendation:** Major revisions

**What the review found:**

- The headline claim that "the binding constraint was consent, not information" (S1.6, Foreword) is a causal attribution a severity-only, retrospectively-built model cannot support, contradicting its own S14.2 concession. — **Fixed.**
- The signature "violence never dominates" result (S6.2) is substantially a ceiling artefact (S11.10) and is never tested with a sensitivity analysis. — **Fixed: sensitivity analysis run; the result does not survive.**
- The "daily" framing is undercut by provenance: violence changes only 3 times in 77 days and the cold burden comes from climatology, not 2022 weather (S7.3, S4.5).

**Noted strength:** Rare unforced candour (self-flagged citation/data errors), a genuinely original IHL-anchored consent component (S4.4), and fully reproducible arithmetic.


### Revisions applied (peer review, Tier 2)

**The causal headline is demoted to a hypothesis.** "The binding constraint was consent, not information" is no longer presented as a conclusion. This model measures severity only: it observes neither what information decision-makers held in real time nor why the mechanism was delayed, and it is built retrospectively knowing how the siege ended — the wrong instrument for establishing real-time sufficiency of information. S1.6 now splits the claim, keeping prominently the part the model carries (severity reached the warranting level from the second week of March, ~7.5 weeks before the 30 April mechanism) and demoting the causal half to a hypothesis requiring external evidence the model does not contain. The S14.2 caveat is now stated at the same prominence as the finding.

**The sensitivity analysis has been run and reported** (new S11.13; reproduce with `node docs/sensitivity.js`). It settles the "violence never dominates" question against the substantive reading:

| Variant | Violence-dominant days | First day sev ≥ 0.70 |
|---|---|---|
| Published settings (bI=10, bD=60, p=6) | 0 / 77 | 28 Apr |
| bI = 4.8 (observed maximum) | **11 / 77** | 10 Mar |
| bD = 90 | **9 / 77** | never |
| p = 2 | 0 / 77 | never |
| bI = 4.8, bD = 90, p = 6 | **20 / 77** | 10 Mar |

- **Does not survive:** "violence never dominates" — it holds only at the published intensity ceiling, which caps that component at 0.48 by dividing by 10 against an observed maximum of 4.8. Normalised to its observed range, intensity leads on 11 days; with the deprivation ceiling relaxed too, violence leads on 20 of 77.
- **Does not survive:** the Critical phase. At p=2, p=4, or bD=90 the series never reaches 0.70 at all; at the published settings it peaks at 0.743, barely above the threshold.
- **Does survive:** the deprivation clock leads on 43–58 of 77 days under every variant, and the mid-March timing the headline rests on (severity passes 0.55 on 9 March) is robust.
