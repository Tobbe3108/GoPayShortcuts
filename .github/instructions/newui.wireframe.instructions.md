---
applyTo: "docs/NewUI/Plan.md"
---

# Weekly Meal Ordering UI – Design Specification

## Overview

This document describes the current user interface and user experience as depicted in the provided screenshot (`docs/NewUI/wireframe.png`). This interface allows users to quickly order meals (Breakfast, Lunch, Soda) for multiple canteen locations across a work week. The design is optimized for speed, clarity, and repeat ordering, supporting both mobile and desktop use.

## Layout

- **Header:**
  - Displays the current week and date range (e.g., "Jul 7-11, 2025").
  - Left/right arrows allow navigation between weeks.
- **Grid:**
  - Columns represent days of the week (Monday–Friday).
  - Rows represent orders placed at canteen locations (e.g., Cantina A, Cantina B, Cantina C).
  - Each cell is a card for a order placed on a specific canteen on a specific day.

## Canteen Card (per day)

- **Canteen Name:** Bold, top-left.
- **Remove Icon:** Top-right, allows removing the canteen from that day.
- **Meal Inputs:**
  - X amount of lines fetched from the API (e.g. Breakfast, Lunch, Soda).
  - Each line shows the meal name, a quantity input (default [0]), a plus (+) and minus (-) button to increment/decrement and a delete button.
- **Save Button:**
  - Saves the current meal selections for that canteen and day.

## Add Location

- **Add Location Button:**
  - Appears below the last canteen for each day.
  - Allows users to add another canteen to that day's order list.
    - Opens a selector to add a new canteen for that day.

## Responsiveness

- The grid adapts to screen size:
  - On desktop, all days and canteens are visible in a grid.
  - On mobile, the layout stacks vertically and may use horizontal scrolling for days.

## Visual Style

- Clean, minimal, and modern.
- Clear separation between days and canteens (cards and grid lines).
- Consistent use of buttons and input fields.
- Emphasis on quick, error-free entry.

## Error Handling

- Invalid or missing input is highlighted.
- Save button is disabled if no changes are made.

## Notes

- The design supports adding/removing canteens per day, not globally.
- The interface is optimized for repeated, fast entry across multiple days and locations.
