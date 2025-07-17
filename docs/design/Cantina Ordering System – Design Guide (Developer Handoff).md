# 🧾 Cantina Ordering System – Design Guide (Developer Handoff)

---

## 🎯 Purpose

A weekly order interface for users to quickly and intuitively place/edit orders for different locations (cantinas), showing one shared week across all locations.

---

## 🧱 Layout

### Desktop Layout

* **Header**: App title and profile controls.
* **Main Grid**:

  * **Columns** = Days (Mon–Fri)
  * **Rows (per column)** = Orders (one row per location per day)
  * **Cards** inside rows = Order cards per location.
  * **Menu Toggle**: Optionally shows menu inline on each card.

### Mobile Layout

* **Day Navigation** becomes swipeable/tabbed (Mon–Fri).
* Location cards stack vertically within each selected day.

---

## 📦 Order Card Structure

Each **order card** represents:

* A unique **kitchenId**
* A **specific date**
* A **single editable block** (breakfast/lunch/soda)

### Default State

* Shows product quantities as text.
* `Edit (✏️)` button top right.

### Edit Mode

Activated by tapping the ✏️ button:

* Quantity pickers (`+`/`-` buttons for each product).
* `Save (💾)` and `Trash (🗑)` icons appear.
* Exits edit mode on Save or Cancel.

---

## 🔐 Locked Orders

* Visually marked with a lock 🔒.
* Cannot be edited or deleted.
* You may **place an additional order** for the same day & kitchen (i.e., a second card).

---

## ➕ Add Location

* At the bottom of each **day column**, a "➕ Add Location" button.
* Opens a small popover with location options not already used that day.
* Adds a new editable card for that location.

---

## 🧾 Menu Display

* Global toggle in top nav: “Show Menus”
* When active, menus for each location (if available) are shown within that card (collapsed or inline).

---

## 🌀 Animations (High-Level Spec)

### 1. **Edit Mode Entry**

* Duration: 200ms
* Transition: ease-in-out
* Actions:

  * Card slightly expands in height.
  * `+`/`-` quantity controls fade/slide in.
  * Save/Trash icons fade in from opacity 0 → 1.

### 2. **Save Confirmation**

* Duration: 400ms
* Visual feedback: checkmark flashes briefly ✅ or card border glows green.
* Save icon may morph into checkmark briefly (optional).

### 3. **Delete Card**

* Duration: 300ms
* Animation: fade out + scale down.
* After transition, card is removed from DOM.

### 4. **Add Location**

* New card fades in and slides up from below the column.
* Slight bounce easing preferred.

### 5. **Mobile Day Navigation**

* Swipe gesture or segmented control tap.
* Horizontal transition of the day view with slide animation.

---

## 🧩 Interaction Patterns

| Action       | Trigger             | Animation          | API Interaction                       |
| ------------ | ------------------- | ------------------ | ------------------------------------- |
| Edit order   | Tap ✏️ on card      | Slide in controls  | None (until save)                     |
| Save order   | Tap 💾              | Confirm feedback   | `PATCH /api/orders`                   |
| Delete order | Tap 🗑              | Fade out card      | `PATCH /api/orders` with quantity 0   |
| Add location | Tap ➕ on day        | Fade-in + slide up | No API until order is saved           |
| Locked state | Visual lock overlay | None               | Backend-driven, based on order status |

---

## 📡 API Integration Model

**Use only** `PATCH /api/orders` for all state updates:

```ts
{
  kitchenId: number;
  date: "YYYY-MM-DD";
  desiredOrders: [
    { productId: number, quantity: number },
    ...
  ];
}
```

| Use Case         | desiredOrders Example                     |
| ---------------- | ----------------------------------------- |
| Save New Order   | `[ { productId: 1, quantity: 2 }, ... ]`  |
| Edit Order       | `[ { productId: 2, quantity: 3 }, ... ]`  |
| Delete Order     | `[]` or all quantities = `0`              |
| Additional Order | Patch a second card for same kitchen/date |

---

## 🎨 Style & Theme (Inspired by Reference Image)

* **Tailwind CSS tokens**

  * Font: `font-sans` (medium and bold weights)
  * Spacing: use multiples of `2` (`p-2`, `gap-4`, etc.)
  * Color:

    * Primary: `bg-neutral-100`, `text-neutral-800`
    * Accent: `bg-green-500`, `text-white`, `hover:bg-green-600`
    * Destructive: `bg-red-100`, `text-red-600`, `hover:bg-red-600`

* **Card Design**

  * Rounded corners (`rounded-xl`)
  * Slight drop shadow (`shadow-md`)
  * Subtle hover on editable cards (`hover:ring-1 hover:ring-neutral-300`)

---

## ✅ Summary for Developers

| Task               | Tooling                                       |
| ------------------ | --------------------------------------------- |
| UI framework       | Svelte                                        |
| Styling            | Tailwind CSS                                  |
| Animation          | Tailwind + transitions or `svelte:transition` |
| Auth               | `POST /api/request-otp`, `POST /api/login`    |
| Order management   | Single endpoint: `PATCH /api/orders`          |
| Locked order logic | Handled via `status` in orders API response   |

---

Would you like this exported as a Figma annotation sheet, Notion page, or PDF?
