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
