---
target: work/hiredly-mobile-app.html
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 2
target_identity: "file:/Users/von/Library/Mobile Documents/com~apple~CloudDocs/Projects/vonlau.github.io/work/hiredly-mobile-app.html"
target_fingerprint: "sha256:88b974b1964bf36959c5fcee2e79e6e984d6546d371dda21245d90803146188b"
target_path: /Users/von/Library/Mobile Documents/com~apple~CloudDocs/Projects/vonlau.github.io/work/hiredly-mobile-app.html
timestamp: 2026-09-15T16-26-44Z
slug: work-hiredly-mobile-app-html
---
**Method: dual-agent (Assessment A: design review · Assessment B: detector + browser evidence)**

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Side-nav "active section" indicator is a good idea but its scroll-spy is broken — confirmed independently by both assessments |
| 2 | Match System / Real World | 4 | Plain, conversational copy; real screenshots of the actual old product. Strongest heuristic on the page |
| 3 | User Control and Freedom | 3 | Side nav, prev/next case nav, reversible language toggle all work |
| 4 | Consistency and Standards | 3 | Typographic scale and callout/sticky-note treatments are consistent; docked for the Problem-vs-Outcome completion gap |
| 5 | Error Prevention | 1 | A finished asset (hiredly-mobile-app-old-long-jd.png) sits on disk, unused, while its matching placeholder still says "not yet added" |
| 6 | Recognition Rather Than Recall | 3 | Side nav and clearly labeled sub-headers reduce recall burden well (when the nav is accurate) |
| 7 | Flexibility and Efficiency | n/a | Long-form read-mode page, not a repeat-use tool |
| 8 | Aesthetic and Minimalist Design | 2 | Clean where content exists, but ~11 dashed placeholder boxes read as unfinished, not minimal |
| 9 | Error Recovery | 2 | Placeholders self-label honestly rather than failing silently, but there's no recovery path |
| 10 | Help and Documentation | n/a | Not applicable to a static case-study read |
| **Total** | | **20/32** | **Acceptable (62.5%)** |

## Design Specificity Verdict

Split verdict. The Problem section and the Discover/Ideate process work are genuinely authored for this project: real screenshots with real timestamps, a named competitive audit, physical workshop photos, specific survey numbers (81%, 67%, 400+ responses) and outcome metrics (+40%, +19%) that read as actual data.

The Outcome section — the part the page's own title promises — is the opposite: five consecutive dashed placeholder boxes plus the hero image itself. Placeholder vs. real image count: 11 placeholders vs. 4 real images.

Deterministic scan: CLI detector returned 2 advisory "slop" findings — gpt-thin-border-wide-shadow (.nav-dropdown-menu, 1px border + 40px shadow) and em-dash-overuse. A browser-injected re-scan of the live page found 22 anti-patterns total: the same border/shadow hit, 20 instances of line-length (body paragraphs ~94 chars/line vs an ~80-char target), and em-dash overuse counted at 15 in rendered English text (vs 44-57 in raw source depending on whether hidden zh spans / placeholder captions are counted).

Visual overlays: injection succeeded during Assessment B's pass and rendered live (orange line-length badges, sticky em-dash banner), confirmed via screenshot; the tab was closed afterward as cleanup.

False positives to note: the border/shadow hit is only visible when the header dropdown is opened (not tested interactively); much of the em-dash count sits in temporary "not yet added" placeholder captions rather than finished body copy.

## Overall Impression

The research and reasoning are strong and specific. The problem is the page's entire second half — the actual designed artifact a hiring reader opens the case study to see — isn't there yet. Combined with a side-navigation component that actively misreports the reader's position (confirmed two independent ways), the page undersells work that, where finished, is genuinely good.

## What's Working

1. The Problem section's evidence density — real screenshots with real UI chrome, specific stats tied to specific claims, a pull-quote callout naming the exact user anxiety.
2. Honest scoping — "Product Designer (1 of 4)" preempts the natural "did they actually do this" question before it's asked.
3. The Discover/Ideate process evidence — a named competitive audit and physical workshop photos, not decorative process-diagram filler.

## Priority Issues

**[P0] The Outcome section — the actual redesign — is 100% placeholder**
- Why it matters: This is the section a hiring manager or designer opens the case study specifically to see. A case study titled "Rebuilding..." that never shows the rebuilt experience can't do its job.
- Fix: Either hold publication until at least the Homepage and one detail screen are in, or restructure to end strongly on the Problem/Process work and be explicit that final screens are in progress.
- Suggested command: /impeccable shape

**[P0] Hero image is a placeholder**
- Why it matters: First thing under the H1 — the first three seconds of exposure to this designer's work.
- Fix: Prioritize getting any real composite of final screens into this slot before anything else on the page.
- Suggested command: /impeccable shape

**[P1] Side navigation is unreliable in two independently-confirmed ways**
- Why it matters: Assessment A traced the scroll-spy's IntersectionObserver logic in js/main.js — it only updates on entry, never clears on exit, freezing on stale sections. Assessment B, working blind to A's findings, independently watched this exact symptom live, and separately caught the fixed side-nav overlapping the footer near the bottom of the page.
- Fix: Rework the observer to track the closest heading above the trigger line on every intersection change, and hide/reposition the side nav once the footer enters view.
- Suggested command: /impeccable harden

**[P1] A finished asset already on disk isn't wired in**
- Why it matters: work/img/hiredly-mobile-app-old-long-jd.png is an almost-exact match for the "Thumbnail C" placeholder. A second unreferenced asset, hiredly-app-revamp-discover-survey.webp, was also spotted.
- Fix: Swap the Thumbnail C placeholder for the real image.
- Suggested command: direct fix

**[P2] Body paragraphs are running long for comfortable reading**
- Why it matters: 20 English paragraphs averaging ~94 characters per line vs an ~80-char readability guideline.
- Fix: Narrow the measure for .case-body p (e.g. a max-width in ch units).
- Suggested command: /impeccable typeset

## Persona Red Flags

**Busy hiring manager (30-60s skim)**: Sees a dashed hero placeholder before any real content. Jumps via side nav to Outcome and hits five consecutive "not yet added" boxes. Results stats land with no screen to anchor them to.

**Fellow designer evaluating craft**: Notices literal internal labels ("Thumbnail C," "Thumbnail D") leaking into shipped copy. Catches the unused, exactly-matching asset sitting in /img/ on a quick view-source check.

**Mobile commuter**: Layout reflows correctly at narrow widths in source, but each placeholder's fixed aspect-ratio box eats proportionally more of a smaller screen with less real content to counterbalance it.

## Minor Observations

- EN copy self-contradicts on process rigor: Design section says work was handed off to developers, Next Steps claims "bring developers in early" as a lesson from this project; ZH translation of the Design paragraph disagrees with both.
- Line 283's ZH span reads "Welcome Screen" (歡迎畫面) under an EN heading "New Design Direction" — looks like a copy-paste leftover.
- Em-dash and border/shadow detector findings are low-confidence given the caveats above.
- Mobile-viewport screenshots couldn't be captured this pass — an automation/environment limitation, not a finding about the page.
- All real img elements have specific, well-written alt text. Text contrast (--muted: #545b66) is comfortably AA/AAA throughout.

## Questions to Consider

- If the Outcome section isn't ready to show, is there a version of this page that leads with the Problem/Process work and stops there for now?
- hiredly-mobile-app-old-long-jd.png was already sitting in the repo unused — what else in the "not yet added" list might already exist?
