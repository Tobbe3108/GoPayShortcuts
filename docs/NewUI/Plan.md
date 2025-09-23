# GoPay Shortcuts UI Implementation Plan

**Related Documents:**
- [Wireframe (PNG)](./wireframe.png)
- [Product Requirements Document (PRD)](./PRD.md)
- [Old UI Screenshot](./OldUI.png)

This document outlines a step-by-step implementation plan for the new UI based on the designs in the wireframes, high-level specifications, and product requirements.

## Implementation Steps

### 1. Set up base atomic components - DONE

**Where to find information:**

- Check the current design instructions in `docs/NewUI/CurrentDesign.md`
- Review existing atomic components in `frontend/src/lib/components/atoms/`
- Look at the Tailwind CSS classes used in current components
- See [Wireframe](./wireframe.png) and [PRD](./PRD.md) for visual and product requirements

**Key considerations:**

- Maintain consistent styling across components
- Create variants for different states (normal, disabled, active, etc.)
- Ensure accessibility with proper ARIA attributes

**Components needed:**

- Button (primary, secondary, danger variants)
- Card (normal and muted variants for locked orders)
- Input (numeric input with validation)
- Icons (edit, delete, lock, etc.)
- Selector: Dropdown for selecting cantina locations  

---

### 2. Create molecule components - DONE

**Where to find information:**

- Look at the [wireframes](./wireframe.png)
- Check the high-level spec in HLS (sections 5 and 8)
- Reference [PRD](./PRD.md) for user flows and requirements

**Key considerations:**

- Keep components focused on a single responsibility
- Make components configurable through props
- Handle edit mode transitions

**Components needed:**

- ProductQuantitySelector: Component with +/- buttons and quantity display  
- OrderSummary: Display order details (items, quantities, prices)  
- EditModeControls: Save/cancel/delete action buttons for edit mode  

---

### 3. Develop organism components

**Where to find information:**

- Review [PRD](./PRD.md) for Order Card specifications
- Check the HLS.md document for detailed interaction patterns
- See [Wireframe](./wireframe.png) for layout

**Key considerations:**

- Implement edit mode toggle
- Handle locked vs. editable states
- Support quantity adjustments and validation

**Components needed:**

- OrderCard: The main card component for each order, with edit/view modes
- DayHeader: Date and day name for each column
- AddLocationCard: Card with location selector to add a new order
- WeekNavigator: Previous/current/next week navigation controls

---

### 4. Build template components

**Where to find information:**

- Review the layout specs in HLS.md (section 7)
- Look at the current MainLayout.svelte implementation
- Check [Wireframe](./wireframe.png) and [PRD](./PRD.md) for grid layout specifications

**Key considerations:**

- Create separate templates for desktop and mobile views
- Implement responsive breakpoints
- Ensure consistent layout across all pages

**Components needed:**

- WeekGridTemplate: Desktop week view with days as columns
- DayViewTemplate: Mobile-optimized single day view
- MainLayoutTemplate: Update the main layout with week navigation

---

### 5. Implement order state management

**Where to find information:**

- Look at the existing API in `frontend/src/lib/services/apiClient.ts`
- Check `frontend/src/lib/services/ordersService.ts` for current implementation
- Review the data model in HLS.md (section 6)
- Reference [PRD](./PRD.md) for order state rules

**Key considerations:**

- Create a week-based order store
- Implement optimistic UI updates for better UX
- Handle API interactions and error states

**Implementation:**

- Create or update orderStore.ts to handle week-based order management
- Implement logic for locked vs. editable orders
- Add optimistic UI updates for better UX
- Handle order creation, updates, and deletion through the API

---

### 6. Implement order card edit mode

**Where to find information:**

- See [PRD](./PRD.md) for edit mode specifications
- Review user flows in [PRD](./PRD.md) (section 8)
- Check HLS.md for interaction principles

**Key considerations:**

- Make edit mode intuitive with clear visual indication
- Implement save/cancel/delete actions
- Handle validation and error states

**Implementation:**

- Toggle between view and edit modes
- Implement quantity adjustments with validation
- Add save/cancel/delete actions
- Implement visual feedback for successful actions

---

### 7. Develop week navigation

**Where to find information:**

- Look at the current implementation in `frontend/src/routes/+page.svelte`
- Check the [wireframe](./wireframe.png) for week navigation UI
- Review the temporal scope in docs/NewUI/HLS.md (section 2)

**Key considerations:**

- Show current week by default
- Allow navigation to previous and next weeks
- Display week number and date range

**Implementation:**

- Previous/current/next week buttons
- Week date range display
- Load orders for the selected week
- Handle week transitions with loading states

---

### 8. Build responsive layout

**Where to find information:**

- See device considerations in docs/NewUI/HLS.md (section 7)
- Review the current responsive implementation
- Check [Wireframe](./wireframe.png) for desktop and mobile layouts

**Key considerations:**

- Implement different views for desktop and mobile
- Use Tailwind CSS breakpoints for responsive design
- Test on various screen sizes

**Implementation:**

- Desktop: Full week grid with all days visible
- Tablet: Scrollable week view with responsive cards
- Mobile: Day-by-day navigation with stacked cards
- Create CSS breakpoints and responsive component variants

---

### 9. Add multi-location support

**Where to find information:**

- Review the spatial scope in docs/NewUI/HLS.md (section 3)
- Look at the existing LocationSelector.svelte component
- Check how locations are handled in the current implementation
- See [PRD](./PRD.md) for multi-location requirements

**Key considerations:**

- Allow adding multiple locations per day
- Support removing locations
- Handle location-specific data

**Implementation:**

- Add location selector in order cards
- Allow adding multiple locations per day
- Handle location-specific menus
- Support removing locations

---

### 10. Implement animations and transitions

**Where to find information:**

- Check the animation specs in docs/NewUI/HLS.md (section 9)
- Look at current animation implementations (if any)
- Reference [PRD](./PRD.md) for animation guidelines

**Key considerations:**

- Keep animations subtle and fast (150-300ms)
- Use CSS transitions or Svelte transitions
- Ensure animations work on all devices

**Implementation:**

- Edit mode entry/exit transitions
- Save confirmation animations
- Delete/remove fade-out animations
- Week navigation transitions
- Add location card animations

---

### 11. Add error handling and validations

**Where to find information:**

- Review current error handling in the apiClient.ts
- Check the notifications component for displaying messages
- See how validation is currently implemented
- Reference [PRD](./PRD.md) for error handling requirements

**Key considerations:**

- Handle API errors gracefully
- Validate user input before submission
- Display user-friendly error messages

**Implementation:**

- Form validation for quantities
- API error handling with user-friendly messages
- Retry logic for failed requests
- Visual indicators for validation errors

---

### 12. Add accessibility features

**Where to find information:**

- Review accessibility requirements in HLS.md (section 10)
- Check current accessibility implementations
- See [PRD](./PRD.md) for accessibility goals

**Key considerations:**

- Support keyboard navigation
- Add proper ARIA attributes
- Ensure sufficient color contrast

**Implementation:**

- Keyboard navigation support
- ARIA attributes for interactive elements
- Sufficient color contrast
- Focus management for modals and edit modes
- Screen reader-friendly content

---

### 13. Implement unit and integration tests

**Where to find information:**

- Look for existing tests in the project
- Check Svelte testing documentation
- Reference [PRD](./PRD.md) for testable user flows

**Key considerations:**

- Test key functionality like ordering, editing, canceling
- Test responsive behavior
- Ensure accessibility compliance

**Implementation:**

- Unit tests for atomic components
- Integration tests for order flows
- Test responsive behavior
- Test accessibility compliance

---

### 14. Final polish and optimization

**Where to find information:**

- All previous documentation and implementation

**Key considerations:**

- Optimize performance
- Refactor code for clarity and maintainability
- Add documentation
- Make final visual adjustments

**Implementation:**

- Performance optimizations
- Code cleanup and refactoring
- Documentation updates
- Final visual design adjustments

---

## Implementation Notes

1. **Start small and build incrementally**. Begin with the atomic components and build up to larger composite components.

2. **Use the existing API client and services**. The backend is already implemented, so you can leverage the existing API client in `apiClient.ts`.

3. **Follow the atomic design methodology**. Keep components organized in atoms, molecules, organisms, and templates folders.

4. **Keep state management simple**. Use Svelte stores for shared state like orders and authentication.

5. **Test regularly**. Make sure each component works as expected before moving on to the next one.
