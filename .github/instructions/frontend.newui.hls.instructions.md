---
applyTo: "docs/NewUI/Plan.md"
---

# 📘 Cantina Ordering App – High-Level Specification

---

## 1. 🧭 Core Concept

The application allows users to manage **weekly meal orders** across multiple **cantina locations**, with the ability to:

- View all days of the workweek at once (desktop) or one day at a time (mobile).
- Place orders for up to three product categories: **Breakfast, Lunch, Soda**.
- Quickly adjust quantities, edit, or cancel orders — with simple and intuitive interactions.
- Handle **locked orders** gracefully, while allowing additional orders when necessary.

---

## 2. 📅 Temporal Scope

- Orders are always tied to a **specific date** (within a single shared workweek).
- The interface defaults to showing the **current week**.
- Navigation between weeks is possible, but only one week is in focus at a time.

---

## 3. 🏢 Spatial Scope

- Users can order from multiple **cantina locations**.
- Each **day column** can include multiple locations.
- A single **location/day combination** may contain multiple orders if some are locked.

---

## 4. 🔒 Order Lifecycle

- **Open Order**: Editable until a certain cutoff time (defined by backend).
- **Locked Order**: Becomes immutable after cutoff; user can only add new orders for the same day/location.
- **Additional Orders**: Users may place more than one order for the same location/day once previous orders are locked.

---

## 5. 🎛️ Interaction Principles

- **Direct manipulation**: Users should feel they are directly adjusting quantities and confirming changes.
- **Minimal friction**: One or two taps/clicks to place or update an order.
- **Explicit saves**: Changes are **local until saved**, preventing accidental updates.
- **Clear states**: Distinguish between editable, saved, locked, and additional orders.

---

## 6. 📦 Data Model Considerations

- **Orders** are defined by: `date`, `kitchenId`, and `orderLines` (product + quantity).
- Backend always expects the **desired full state** of an order per kitchen/day (`PATCH /api/orders`).
- **Deletion** is represented by setting all quantities to zero.
- **Creation** is represented by adding new `desiredOrders`.
- **Editing** is represented by replacing the existing orderLines.

---

## 7. � Example PATCH Payload

```json
{
  "date": "2025-09-23",
  "kitchenId": "cantina-1",
  "orderLines": [
    { "productId": "breakfast-1", "quantity": 1 },
    { "productId": "lunch-2", "quantity": 2 },
    { "productId": "soda-3", "quantity": 0 }
  ]
}
```

---

## 8. 📖 Glossary

- **Locked Order**: An order that cannot be edited after the cutoff time, but allows additional new orders for the same day/location.
- **Additional Order**: A new order placed for a day/location after the original order is locked.
- **OrderLines**: Array of objects, each specifying a product and its quantity for a given order.

---

## 9. 📱 Device Considerations

### Desktop

- **Week view** with days as columns, locations stacked vertically.
- Easy comparison across multiple days/locations.

### Mobile

- **Day view** with swipe or arrow navigation.
- Locations listed vertically within the day.
- Single-day focus prevents horizontal scrolling fatigue.

---

## 10. 🎨 Visual & Interaction Design

- **Card-based interface**: Each order is a card showing location, status, and quantities.
- **Edit mode**: Triggered by pen icon; reveals save/delete controls.
- **Locked orders**: Grayed out with lock indicator; no edit/delete available.
- **Add location**: Always accessible at the bottom of each day.
- **Global menu toggle**: Option to show/hide cantina menus across all relevant cards.

---

## 11. 🌀 Animation & Feedback

- **Edit mode entry**: Smooth expansion and fade-in of controls.
- **Save confirmation**: Subtle green highlight or checkmark animation.
- **Delete order**: Fade-out/shrink transition for removed card.
- **Add location**: Fade-in + slide from below the day column.
- **Day navigation (mobile)**: Horizontal slide transition.

Animations must be **subtle, fast (150–300ms), and consistent**, reinforcing clarity without distracting.

---

## 12. ♿ Accessibility & Usability

- **Touch-friendly controls**: Min 44px tap areas for mobile.
- **Keyboard support**: Tab navigation, Enter to save, Escape to cancel edits.
- **Color & contrast**: Adhere to WCAG AA at minimum.
- **Status messaging**: Clear distinction between editable, locked, and saved states.

---

## 13. 🔐 Constraints & System Rules

- Always one shared week across all users (not user-specific weeks).
- Users can view and manage orders for **all locations they have access to**, no global location selector.
- Orders must be grouped by **day first, then location**.
- Backend API is **opinionated**: only `PATCH /api/orders` is available for all order changes.
- The frontend must **mirror the desired state exactly** when issuing updates.

---

## 14. ⚖️ Key Design Tradeoffs

- **Simplicity vs. flexibility**: Keeping only 3 product rows (Breakfast, Lunch, Soda) simplifies UX but reduces menu complexity.
- **Local vs. immediate save**: Choosing explicit save prevents accidental errors but adds a small extra step.
- **Global vs. per-card menu toggle**: Global toggle avoids clutter and maintains consistency across the week.
- **Locked orders vs. additional orders**: Prevents editing history while still supporting user needs.

---

## 15. 🚀 Success Criteria

- A user can place or update an order in **under 10 seconds**.
- The app must clearly communicate when orders are **editable, saved, or locked**.
- The app must allow **multi-location ordering** per day without confusion.
- Mobile experience must be as seamless as desktop, optimized for quick actions.
