---
applyTo: "docs/NewUI/Plan.md"
---

# 📄 Product Requirements Document (PRD)

---

## 1. One-liner

A **weekly meal-ordering app** for multiple cantina locations, designed to make placing, editing, and managing daily orders simple, clear, and fast—while respecting order lock-in rules and supporting both desktop (week view) and mobile (day view).

---

## 2. Problem Statement

Employees order meals from multiple cantina locations during the work week, but existing tools are slow, confusing, and error-prone. Users need a **fast, reliable, and low-friction way to place, edit, and review orders** while ensuring business rules (e.g., lock-in cutoffs, multi-location visibility) are respected.

---

## 3. Users & Personas

- **Primary User (Employee):**

  - Needs to place daily or weekly food orders.
  - Wants a fast, minimal interaction flow.
  - Often on mobile, but also reviews weekly plans on desktop.

- **Secondary User (Admin/Backoffice):**

  - May review orders for reconciliation.
  - Needs clear visibility into locked vs. editable orders.

---

## 4. Goals

1. Enable employees to **quickly place and review orders** for the work week.
2. Support **multiple cantina locations** with clear per-day visibility.
3. Provide a **seamless editing flow** with explicit entry into edit mode.
4. Enforce **lock-in rules** (orders cannot be changed after cutoff, but new ones can be added).
5. Optimize for **speed of interaction** (minimal clicks, inline editing).
6. Adapt layout for **desktop (week view)** and **mobile (day-by-day navigation)**.

---

## 5. Non-Goals

- No payment handling (delegated to backend/payment system).
- No advanced customization (fixed three items: Breakfast, Lunch, Soda).
- No bulk reorder, auto-schedule, or recurring orders.

---

## 6. Core Concepts

- **Week View (desktop):**

  - Days laid out horizontally.
  - Cantinas displayed vertically under each day.
  - Each order represented as a **card** with 3 fixed rows (Breakfast, Lunch, Soda).

- **Day View (mobile):**

  - Single day navigation with stacked cantina order cards.

- **Order Card:**

  - Shows item quantities at-a-glance.
  - Locked orders clearly marked.
  - New orders can always be added.
  - Edit mode:

    - Triggered by ✏️ Pen icon.
    - Reveals inline controls (➕ ➖, ✅ Save, 🗑️ Delete).

- **Menu Toggle (per cantina):**

  - Global toggle to show/hide menus for that cantina.
  - When active, all order cards for that cantina (across the week) show menus.

---

## 7. Constraints

- **API usage:**

  - Always use `PATCH /api/orders`.
  - One endpoint handles create, update, and delete.
  - Frontend must send the **full desired state** for a given `date` + `kitchenId`.

- **Lock-in rule:**

  - Once locked, orders are immutable.
  - Users can only add _new_ orders for that location/day.

- **Fixed product categories:**

  - Breakfast, Lunch, Soda always shown.

---

## 8. User Flows

1. **Placing an Order:**

   - User navigates to day → clicks **Add Location** → new card appears → enters edit mode → sets quantities → ✅ Save.

2. **Editing an Order:**

   - User clicks ✏️ → quantities become editable → ✅ Save applies patch.

3. **Deleting an Order:**

   - User clicks ✏️ → 🗑️ Delete → confirmation → sends patch with empty desiredOrders.

4. **Handling Locked Orders:**

   - User sees "Locked" state.
   - Can still click **Add Location** for an additional order.

5. **Viewing Menus:**

   - User toggles cantina menu (global per cantina).
   - All cards for that cantina show its menu inline.

---

## 9. UX & UI Considerations

- **Desktop:** Week grid for overview + inline edits.
- **Mobile:** Day-by-day scroll with navigation bar.
- **Interaction Model:**

  - Explicit edit mode to prevent accidental changes.
  - Save is **per-card**, never global.

- **Visual Indicators:**

  - Locked = greyed out, no edit controls.
  - Editable = ✏️ icon available.

- **Animations:**

  - Smooth slide/fade when entering edit mode.
  - Subtle highlight when saving/deleting.
  - Menus fade-expand when toggled.

---

## 10. Success Metrics

- 🕒 **Speed:** Reduced time to place weekly orders vs. current tool.
- ✅ **Accuracy:** Fewer accidental edits/deletions.
- 📊 **Adoption:** Employees consistently use mobile for daily updates.
- 🔒 **Reliability:** No order state mismatches between frontend and backend.

---

## 11. Risks & Mitigations

- **Risk:** Users may forget to hit Save after editing.

  - _Mitigation:_ Autosave reminder or highlight unsaved changes.

- **Risk:** Lock-in rules confuse users.

  - _Mitigation:_ Clear visual indicator with tooltip explaining lock-in.

- **Risk:** Menu toggle clutter.

  - _Mitigation:_ Keep toggle minimal, default hidden unless expanded.
