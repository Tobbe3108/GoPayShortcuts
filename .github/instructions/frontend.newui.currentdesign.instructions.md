---
applyTo: "docs/NewUI/Plan.md"
---

# GoPay Bad Edition – UI Design Spec

## Overview

This document describes the user interface and user experience as depicted in the provided screenshot (`docs/NewUI/OldUI.png`). The design is focused on weekly food ordering, using a card-based layout for each weekday and clear controls for managing orders per day. The interface supports efficient navigation, order placement, and order management.

## Layout

**Page Structure:**

- Background: Light gray (`bg-slate-50`)
- Container: Full height (`min-h-screen`)
- Content: Centered, responsive layout with appropriate padding

**Header:**

- Top left: GoPay Bad Edition logo
- Top center: Current week number (e.g., "Uge 38") - Text size: 2xl (24px), font weight: bold, Color: slate-800
- Top right: Logout button ("Log ud") - Primary button styling (see Button Styles section)
- Header container: White background, shadow, full width, padding: 1rem (16px)

**Main Content:**

- Five horizontally aligned cards, one for each weekday (Monday–Friday)
- Grid layout: Responsive grid with appropriate gap spacing (gap-4)
- Main content container: Padding top/bottom: 2rem (32px), max-width: 1200px, margin: auto
- Each card displays:
  - Day name (e.g., "Mandag") - Text size: xl (20px), font weight: semibold, Color: slate-800
  - Date (e.g., "15. sep.") - Text size: sm (14px), Color: slate-500
  - Order controls or status for that day

## Card Styling

**Base Card Style:**

- Background: White (`bg-white`)
- Shadow: Large shadow (`shadow-lg`)
- Border: 1px solid slate-200 (`border border-slate-200`)
- Rounded corners: Large (`rounded-lg`)
- Padding: 1rem (16px), md:1.5rem (24px) (`p-4 md:p-6`)
- Layout: Vertical flex with space between elements (`flex flex-col space-y-4`)

**Card States:**

### Past Days with no Orders

- Card is visually muted (`opacity-70 bg-slate-50`)
- Message: "Bestillinger kan ikke placeres for fortidige dage." (Orders cannot be placed for past days)
  - Text styling: italic, text-slate-600, text-center (`italic text-center text-slate-600`)

### Past Days with Orders

- Card is visually muted (`opacity-70 bg-slate-50`)
- Shows order summary in a bordered container:
  - Container: Light gray background, 1px border, rounded corners (`p-3 space-y-3 border border-slate-300 rounded bg-slate-50`)
  - Heading: "Bestillingsoversigt:" - font-semibold, text-slate-700 (`font-semibold text-slate-700 text-md`)
  - Location: "Lokation: [name]" - text-sm, text-slate-600
  - List of ordered items: Flex layout with space between, text-slate-700
  - Total price: text-right, font-medium, text-slate-700, top border (`font-medium text-right text-slate-700 border-t border-slate-200`)
- No action buttons are available; orders for past days cannot be changed or cancelled.

### Current/Upcoming Days with order

- Current day is highlighted with thick border (`border-slate-800 border-2`)
- Shows order summary in a bordered container:
  - Container: Light gray background, 1px border, rounded corners (`p-3 space-y-3 border border-slate-300 rounded bg-slate-50 flex-1 flex flex-col`)
  - Content styling same as "Past Days with Orders"
- Action buttons:
  - Green: "Tilføj ekstra bestilling" (Add extra order)
    - `w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700`
  - Red: "Annuller bestilling" (Cancel order) — is hidden after specific time
    - `w-full px-4 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-700`
  - Gray: "Gem som standard" (Save as default)
    - `w-full px-4 py-2 font-bold text-white bg-slate-600 rounded hover:bg-slate-500`
  - Button container: `flex flex-col pt-2 space-y-2`

### Current/Upcoming Days with no Orders

- Card is active (regular card styling)
- Location selector (dropdown):
  - `w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600`
- For each product type (e.g., "Morgenmad", "Frokost", "Læskedrik"):
  - Container: `flex items-center justify-between`
  - Label: text-slate-700
  - Quantity selector:
    - Minus button: `px-2 py-1 font-bold text-slate-700 bg-slate-200 rounded-l hover:bg-slate-300 disabled:opacity-50`
    - Quantity display: `w-8 text-center text-slate-700`
    - Plus button: `px-2 py-1 font-bold text-slate-700 bg-slate-200 rounded-r hover:bg-slate-300 disabled:opacity-50`
- Action button: "Placér bestilling" (Place order)
  - `w-full px-4 py-2 font-bold text-white bg-slate-800 rounded hover:bg-slate-700 disabled:bg-gray-400`

## Navigation

Below the cards: Three navigation buttons

- "Forrige uge" (Previous week)
  - `px-4 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-l hover:bg-slate-50`
- "Denne uge" (This week)
  - `px-4 py-2 font-medium text-white bg-slate-700 hover:bg-slate-800`
- "Næste uge" (Next week)
  - `px-4 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-r hover:bg-slate-50`
- Button container: `flex justify-center mt-6 space-x-1`

## Button Styles

**Primary Action Button:**

- Full width: `w-full`
- Padding: px-4 py-2
- Font: Bold, white (`font-bold text-white`)
- Background: Dark slate (`bg-slate-800`)
- Hover: Slightly lighter (`hover:bg-slate-700`)
- Disabled: Gray background (`disabled:bg-gray-400`)
- Rounded corners: `rounded`
- Transitions: `transition-opacity duration-150 ease-in-out`

**Positive Action Button:**

- Same as primary but green: `bg-green-600 hover:bg-green-700`

**Negative Action Button:**

- Same as primary but red: `bg-red-600 hover:bg-red-700`

**Secondary Action Button:**

- Same as primary but medium slate: `bg-slate-600 hover:bg-slate-500`

**Quantity Adjustment Buttons:**

- Compact padding: `px-2 py-1`
- Font: Bold, slate text (`font-bold text-slate-700`)
- Background: Light slate (`bg-slate-200`)
- Hover: Slightly darker (`hover:bg-slate-300`)
- Rounded left/right corners: `rounded-l` or `rounded-r`
- Disabled: 50% opacity (`disabled:opacity-50`)

## Visual Style

- Color Palette:
  - Background: Light gray (`bg-slate-50`)
  - Cards: White (`bg-white`)
  - Text: Slate scale from 500 (light) to 800 (dark)
  - Accents: Green for positive, Red for negative, Slate for neutral
  - Disabled: Gray 400 with reduced opacity
- Typography:
  - Headers: xl/2xl, semibold/bold, slate-800
  - Labels: Regular, slate-700
  - Secondary text: sm, slate-600/slate-500
  - Button text: Bold, white
- Elevation:
  - Cards: Large shadow (`shadow-lg`)
  - Nested elements: Border + light background
- Spacing:
  - Vertical rhythm: space-y-4 for major sections
  - Internal padding: p-4 md:p-6 (responsive)
  - Button padding: px-4 py-2
- Responsive Considerations:
  - Desktop-first design
  - Responsive padding: p-4 on mobile, p-6 on larger screens

## Accessibility & Usability

- Clear separation between days and states (past, ordered, upcoming)
- Large, easily clickable buttons
- All actions and information are visible without scrolling
- Color-coded actions for clarity (green = add, red = cancel, blue = place)

## Summary

The UI is optimized for quick weekly food order management, with a focus on clarity, ease of use, and minimal distractions. The design supports efficient navigation between weeks, clear feedback on order status per day, and streamlined order management with cancel and extra order actions.
