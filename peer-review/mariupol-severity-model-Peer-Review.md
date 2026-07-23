# Peer Review — The Mariupol Corridor Severity Model: A Research Report on a Daily Measure of Civilian Danger During the Siege of Mariupol, March to May 2022

**Reviewed as:** External referee, interdisciplinary humanitarian-technology / IHL venue (e.g. a *Journal of International Humanitarian Action* or *Big Data & Society* audience). Assumed bar: strong specialist journal. The submission is a version 0.9 working paper reporting on a research prototype and I have reviewed it at the altitude of framing, contribution, methodological validity, and evidentiary honesty.

**Recommendation:** Major revisions

**Date:** 22 July 2026

---

## Summary of the submission

The paper documents a composite severity model for the siege of Mariupol (5 March – 20 May 2022) that outputs, for each day, a single number *S* between 0 and 1 describing how dangerous it was for civilians to remain in the city. Six components feed the score: three "fast" harms (hostility intensity, kinetic proximity, protection risk) and three "slow" harms (cold burden, a deprivation clock, infrastructure damage) (§§4.2–4.7). The components are combined not by a plain average but by a generalised power mean with exponent 6 — a "weakest-link" rule that pulls the composite toward the single worst component and deliberately limits compensability (§4.8). The score is binned into five INFORM/IPC-style phases (§4.9) and multiplied by a vulnerability weight of 1.114 to yield a priority index (§4.10).

The genuine contributions are three. First, a *conceptual* one: the model insists that the slow harms of a siege be given equal analytical standing to shelling, so that a lull in attacks cannot lower the assessment (§3.2) — and it demonstrates arithmetically that on no day of the siege is a violence component the worst driver (§6.2). Second, an *original component*: the protection-risk term scores corridor-violation history and a consent/filtration ladder (§4.4), operationalising the gap between corridors *announced* and corridors *honoured* — a variable normally handled in prose, here made numeric and tied to specific IHL provisions (§9.4). Third, an *evidentiary* stance of unusual candour: the paper devotes two full sections (§§11–12) to its own limitations and to citation/data points a reviewer should check, and it recomputes the series to correct its own README (§6.2). The IHL grounding is careful and correctly modest — the model claims to measure the factual predicate for obligations, not to adjudicate them (§9.1). The arithmetic is internally consistent and fully reproducible: I re-derived the worked example (§5), the saturation floor of ≈0.742 (§4.8), and the 1.114 weight (§4.10), and all reproduce exactly.

This is serious, honest, well-documented work. The revisions below concern the gap between what the model *measures* and what the paper *claims*, not the integrity of the underlying craft.

---

## Major issues

### 1. The headline causal claim — "the binding constraint was consent, not information" — is not supported by the model, and the paper's own construction argues against it.

**Location:** Foreword; §1.6; §14.2 (and the title's framing).

**The problem.** The paper's central, most-quoted finding is that public information was sufficient "well before the end of March" to establish that IHL obligations were factually engaged, and that because the evacuation mechanism did not arrive until 30 April, "the binding constraint was not information but consent" (§1.6). But the model measures *severity* only. It contains no evidence about (a) what information decision-makers actually held in real time, or (b) why the mechanism was delayed — whether by consent, logistics, political will, or negotiation failure. The consent claim is a causal attribution about a decision process the model never observes. Worse, the model is built *retrospectively, knowing how the siege ended* (§10.4, §11.2), which is precisely the wrong instrument for proving that real-time information *was sufficient* — hindsight-fitted ceilings and phase boundaries cannot demonstrate what a contemporaneous observer could have known. The paper concedes exactly this in one buried sentence — "That conclusion does not follow from the arithmetic alone, and it should not be presented as though it does" (§14.2) — yet the same claim is given top billing in the Foreword, the Executive Summary (§1.6), and the framing of the whole exercise.

**Why it matters.** This is the paper's thesis. An internal contradiction between the prominent framing and the §14.2 disclaimer is the first thing a demanding referee will seize on, and it exposes the strongest part of the work (a defensible severity signal) to being discredited by its weakest (an unearned causal conclusion).

**Path forward.** Split the claim in two and let the model carry only the half it can support. Keep, prominently: *"On the model's own scale, severity had plainly reached the level at which evacuation is warranted from the second week of March, roughly seven and a half weeks before the mechanism arrived"* (this survives recomputation, §6.2). Demote and reframe the causal half: present "consent, not information, was the binding constraint" as a *hypothesis the timing gap raises*, explicitly requiring external evidence — contemporaneous situation reports, negotiation records, OCHA/ICRC access logs — that the model does not provide. Move the §14.2 caveat up into the Executive Summary so the framing and the disclaimer agree.

### 2. The signature empirical result — "violence never dominates" — is substantially a scaling artefact, and no sensitivity analysis is offered to separate finding from construction.

**Location:** §4.2 (intensity ceiling of 10 vs observed max 4.8); §6.2; §11.10.

**The problem.** The paper's most striking result is that on no day is a violence component the worst driver; the dominant component is always cold (23 days) or the deprivation clock (54 days) (§6.2). But under a weakest-link rule, *the component with the most generous ceiling relative to its observed range wins almost by construction*. Intensity is divided by 10 when the observed maximum is 4.8, capping it at 0.48 (§4.2); the deprivation clock is divided by 60 days in a siege that ran longer than 60 days, so it *necessarily* saturates (§4.6, §11.10). The paper states this honestly (§11.10 — "partly a substantive finding and partly a consequence of the scaling") but then does not do the one thing that would resolve it: vary the ceilings and the exponent and show what survives. Because a single saturated component pins the composite at ≥0.742 and the Critical threshold is 0.70 (§4.8), from 1 May onward "the number is reporting the passage of time and nothing more" (§11.9) — the entire Critical phase for the last three weeks is an artefact of the 60-day ceiling choice.

**Why it matters.** Without a sensitivity analysis, a reader cannot tell whether "violence never dominates" is a discovery about Mariupol or an accounting consequence of where the author set the divisors. That distinction is the difference between a finding and a tautology, and the paper currently asks the reader to hold both readings simultaneously (§6.2) without giving them the means to weigh them.

**Path forward.** Add a sensitivity table (this is the single highest-value addition to the paper). Re-run the series with intensity normalised to its *observed* maximum rather than 10; with the deprivation ceiling at, say, 45, 60, and 90 days; and with the power-mean exponent at 2, 4, and 6. Report which qualitative conclusions are stable across these and which flip. If "violence never dominates" survives normalising intensity to its observed range, that is a much stronger claim; if it does not, the paper should say so plainly. As the paper itself notes the author intends (§4.1, §11.4), re-estimate ceilings as percentiles of the observed distribution and report the effect.

### 3. Data provenance undercuts the "daily" framing, and the second-most-dominant component is computed from climatology rather than actual 2022 weather.

**Location:** §7 (esp. §7.2, §7.3, §7.5); §4.5.

**The problem.** The word "daily" is in the title, the subtitle, and §1.1, but §7 makes clear the resolution is nominal. The violence inputs change on only three occasions across 77 days (four constant windows, §7.2); infrastructure is a five-point linear interpolation (§4.7); and the temperature series is "an interpolated climatology, a smooth curve drawn through ten anchor temperatures" (§7.3) — *not* an ERA5 extraction of the actual weather of March–May 2022. This last point is more than a disclosure issue. Cold burden is the dominant driver on 23 days (§4.5) and the second most influential component overall, yet it is derived from *average* seasonal weather, not the temperatures Mariupol actually experienced during the siege. If the spring of 2022 departed from climatological norm on any stretch, the cold component — and therefore the composite on those days — is simply wrong, not merely coarse. The paper is admirably explicit about the interpolation (§7.5: "the word daily describes the resolution of the output, not the resolution of the evidence") but does not confront the validity consequence for a component that does real work.

**Why it matters.** A daily severity model whose daily movement comes almost entirely from a ticking counter, a linear damage ramp, and a *climatological* (not observed) temperature curve is, functionally, a four-phase model with smooth interpolation between phases. Marketing it as daily invites a non-technical policy reader — the stated audience (§13.2) — to over-read day-to-day structure that reflects no day-specific evidence.

**Path forward.** Either (a) complete the ERA5 extraction the paper already names as intended (§7.3) so that cold burden reflects actual 2022 temperatures — this is the highest-priority data fix — or (b) reframe the deliverable as a *phase* model with interpolated presentation, and reserve "daily" for the output resolution with a one-line caveat wherever the word appears. Until (a) is done, add an explicit validity caveat to §4.5 (not only the provenance note in §7.3) stating that the dominant cold values are climatological and may diverge from realised conditions.

### 4. Genre and independence: a self-review written in an independent-referee voice needs its authorship relationship to the model stated up front.

**Location:** §1.8; §4.4 and §9.4 ("this reviewer"); Attribution.

**The problem.** The report is written in the third person about "the repository" and "the author," and it adopts an evaluative referee voice — "This report finds the model's reasoning clear and unusually well documented, and its candour about its own weaknesses genuine" (§1.8); "seems to this reviewer correct" (§9.4). Yet the Attribution identifies a single author and sole repository contributor, and the document does not state whether the person who *wrote this review* is independent of the person who *built the model*. If they are the same, then §1.8 is self-assessment presented in the grammar of external peer review, and phrases like "this reviewer" borrow an authority the text has not earned. If they are independent, the paper should say so, because the entire evidentiary weight of the favourable findings depends on it.

**Why it matters.** This is a research-integrity and transparency issue, not a stylistic one. Readers calibrate praise by its source; a self-review that reads as an external one is misleading even when every individual sentence is defensible. For a contested, recent event where credibility is the coin of the realm, the framing must be unambiguous.

**Path forward.** State the relationship explicitly in a one-line author's note near the top: either "This is a self-authored methodological report; evaluative statements are the author's own assessment" (and then convert the referee-voice sentences to first-person methods claims — "I judge the reasoning to be…"), or "This review was conducted by [independent party]" with the reviewer named. Do not leave the reader to infer independence from an ambiguous third-person voice.

---

## Minor issues

- **m1 — Sphere Handbook mis-attribution (§4.5, §12.1).** The 18°C threshold is attributed to the Sphere Handbook, which on the paper's own full-text check does not contain it; the WHO *Housing and Health Guidelines* 18°C healthy-indoor minimum is the correct anchor. The author has already flagged this in §12.1 — it now simply needs *executing* in §4.5, not merely noting. Well caught; fix it rather than leaving it as a standing caveat. **[Verification Required]** on the exact WHO figure and edition.

- **m2 — UNOSAT March anchor discrepancy (§12.2).** The 14 March damage anchor (773/17,594 ≈ 4%) does not match the published Livoberezhnyi assessment (433/9,279 ≈ 5%) the paper cites; the May figure matches exactly. Self-flagged; trace the March anchor to its specific product before publication. **[Verification Required]** against the primary UNOSAT product.

- **m3 — README/chart inconsistency (§6.2, §12.3).** The README's "critical thresholds in mid-March" describes Phase 4 (High), not Phase 5 (Critical), which is not reached until 28 April. Self-flagged; the summary wording and the chart should be reconciled.

- **m4 — Priority index is inert within this case but featured as if informative (§1.5, §5, §4.10, §11.11).** The vulnerability weight is a single constant across all 77 days and "carries no additional information" here (§11.11), yet it appears in the Executive Summary (§1.5) and the worked example (§5) alongside the substantive outputs. Add a one-line label at each appearance noting it changes no within-case ordering and exists for cross-case comparison in the unbuilt framework.

- **m5 — Consent ladder appears inconsistently applied to the organised-evacuation regime (§4.4 rule vs §8).** §4.4 states that "choosing a destination controlled by the adversary raises the effective value to 0.90 or above," yet the organised humanitarian evacuation is scored at the ladder's *best* value, 0.25 (neutral third-party escort), despite the paper's own record that evacuees exited through a Russian-controlled screening point at Bezimenne with some onward transfer to Russian-controlled territory (§8). Either the escort status governs and the destination rule is overridden, or the two conflict — the paper should state the tie-break rule explicitly and justify why 0.25 rather than an elevated value applies here.

- **m6 — The relief-credit term is untested (§4.6, §11.12).** The three-days-per-convoy credit never operates because zero convoys reached the city. This is disclosed (§11.12) but the mechanism (why 3 days? why linear?) is undefended; either justify the parameter or mark the whole term as illustrative pending a case where it fires.

- **m7 — "raion" (§7.2) is unglossed** in a report that otherwise defines every technical term for a non-coding audience (§1.3, §4.1). Add a three-word gloss ("raion, a district").

- **m8 — Date-range/dash house style (§12.5)** is trivial and can be handled at copyedit; noted only because the author raised it.

---

## Things the report gets right

- **Radical, unforced candour (§§11–12).** Sections 11 and 12 are the paper's moral centre. The author lists seven substantive limitations, adds five more from the recomputation, and volunteers a checklist of their *own* likely citation and data errors before any reviewer could find them. This is rare and it is the single best reason to trust the rest of the document.

- **The weakest-link justification is substantively, not just technically, argued (§4.8, §10.1).** The paper grounds the exponent-6 choice in a real claim about sieges — "a population safe from shelling but freezing without water is not in medium severity" — and correctly locates it in the compensability literature (OECD/JRC), while flagging the exponent's magnitude as an adjustable convention. This is exactly how a defensible design decision should be presented.

- **The consent/corridor component is a genuine conceptual contribution (§4.4, §9.4).** Turning "was safe passage promised, and was the promise kept?" into an ordered, IHL-anchored quantity — with the correct direction of travel, so that a paper-only corridor *raises* severity — is the paper's most original move and is well motivated.

- **IHL grounding is careful and correctly modest (§9.1, §9.3).** The insistence that the model measures a factual predicate rather than adjudicating (§9.1), and the accurate framing that a siege is not per se unlawful but is governed by starvation/indispensable-objects/arbitrary-refusal rules onto which the six components map (§9.3), show real legal literacy and restraint.

- **Reproducibility and self-correction (§5, §6.2).** The worked example is fully checkable (I reproduced it), the arithmetic is exposed behind a toggle for sceptical readers (§6.1), and the author recomputes the series to *correct their own summary* (§6.2). That is the scientific temperament the field needs.

- **Dual-use ethics raised unprompted (§11.6).** The recognition that the same data fusion could serve targeting or filtration screening, and that civilian-movement data is protection-sensitive by nature, is the correct and serious ethical flag, and it is volunteered rather than extracted.

---

## Verdict

**Major revisions.** This is honest, careful, legally literate work whose craft I do not doubt — the arithmetic is sound, the limitations are disclosed with rare integrity, and the consent component is a real contribution. What holds it back from acceptance is a systematic gap between what the model *measures* (a coarse but defensible severity signal) and what the paper *claims* (a causal conclusion about consent, a daily resolution the evidence does not support, and a headline result partly manufactured by ceiling choices). None of these is fatal; all are fixable by reframing claims and adding one analysis.

**The single highest-value revision:** run and report a **sensitivity analysis over the ceilings and the power-mean exponent** (Major issue 2). It is the one change that does the most work at once — it tests whether "violence never dominates" is a finding or an artefact, it disciplines the "daily/critical" framing, and it forces the causal claim back to the modest form the model can actually defend. Pair it with completing the ERA5 temperature extraction (Major issue 3) so the second-most-dominant component reflects the weather that actually occurred, and the paper will be close to publishable.

---

## References

Numbered inline citations are not used in this review; python-docx cannot emit true Word footnotes, so the standards the review points the author toward are listed here in MLA form. Page-level pinpoints are left to the author to confirm against the primary texts (see **[Verification Required]** tags in the Minor issues).

1. OECD and European Commission Joint Research Centre. *Handbook on Constructing Composite Indicators: Methodology and User Guide.* OECD Publishing, 2008.
2. Sphere Association. *The Sphere Handbook: Humanitarian Charter and Minimum Standards in Humanitarian Response.* 4th ed., Sphere Association, 2018.
3. World Health Organization. *WHO Housing and Health Guidelines.* World Health Organization, 2018.
4. UN High Commissioner for Refugees. *UNHCR Emergency Handbook.* UNHCR, 2015–, emergency.unhcr.org.
5. ACAPS and European Commission Joint Research Centre. *INFORM Severity Index: Methodology.* ACAPS/JRC, 2019–.
6. Henckaerts, Jean-Marie, and Louise Doswald-Beck, eds. *Customary International Humanitarian Law.* International Committee of the Red Cross / Cambridge UP, 2005.
7. Geneva Convention (IV) Relative to the Protection of Civilian Persons in Time of War. 1949, Arts. 17, 23, 49; and Protocol Additional (I), 1977, Arts. 51, 57, 58, 70.
