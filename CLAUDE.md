# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"Ціна популізму"** (The Price of Populism) — a single-file React interactive calculator (Ukrainian language) that converts the cost of Ukrainian government populist/inefficient programs into military equipment equivalents (drones, shells, vehicles). Built for social media sharing and public awareness.

**Author:** Валентин Гацко, KSE Center for Sociological Research

## Architecture

- **Single `.jsx` file** — the entire app lives in one React component file
- **`const DATA = {...}`** at the top of the file contains all programs, equipment, exchange rates, and metadata as a JSON object
- **Tailwind CSS** for styling (utility classes only)
- **No backend, no localStorage** — state managed entirely via `useState`
- All text is in Ukrainian; numbers formatted with space as thousands separator (Ukrainian convention)

## Data Model

- `DATA.programs[]` — government spending programs with `annualCostUAH`, sources, and notes
- `DATA.equipment[]` — military items with `unitCostUSD`
- `DATA.exchangeRate.usdToUah` — NBU official rate
- `DATA.context` — defense spending gap (~400B UAH) and total programs cost
- **Conversion formula:** `annualCostUAH ÷ exchangeRate ÷ unitCostUSD = quantity`

## Adding a New Program

1. Add object to `DATA.programs` with: `id`, `name`, `description`, `annualCostUAH`, `year`, `sourceLabel`, `sourceUrl`, `notes`
2. Update `DATA.context.totalProgramsCostUAH`
3. Update `DATA.meta.lastUpdated`

## Key UI Features

- **Live counter** in hero block: ticks UAH spent in real-time since page load (`requestAnimationFrame` / `setInterval` at 100ms), resets on program change
- **Count-up animation** on equipment quantities when switching programs
- **Share button** copies formatted text with program name, cost, and drone equivalent
- Mobile-first design (375px primary breakpoint), dark theme with yellow/gold accent
- Fonts: Unbounded (headings) + Montserrat (body) via Google Fonts

## Design Spec

The full specification including data, UI/UX requirements, and checklist is in `prompt-populism-vs-defense.md`.

---

## Agent Workflow Rules

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards
