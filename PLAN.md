# Plan: Fix TodaysMenu Initial State Issue

## Objective
Improve the user experience of the TodaysMenu component by showing a consistent card layout during the loading state, preventing sudden UI changes when menu data loads.

## Success Criteria
- TodaysMenu card is visible immediately when component mounts
- Loading spinner displays inside the card while fetching menu data
- Card content smoothly transitions from loading to menu items or "none available" message
- No sudden appearance/disappearance of the card

## Implementation Phase

### Changes Required
1. **Import LoadingSpinner component** in `frontend/src/lib/features/menu/molecules/TodaysMenu.svelte`
2. **Modify the card rendering logic** to always show the Card component
3. **Add loading state display** inside the card when `loading` is true
4. **Keep existing logic** for displaying menu items or "none available" when loading is false

### Specific File Changes
- **frontend/src/lib/features/menu/molecules/TodaysMenu.svelte**:
  - Add import: `import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';`
  - Move `<Card className="p-3">` outside the `{#if !loading}` block
  - Inside the card, add `{#if loading}` block with `<LoadingSpinner />`
  - Keep the existing `{#if !menuItems}` and menu display logic inside `{#if !loading}`

## Verification Steps
1. **Manual Testing**:
   - Load a page with TodaysMenu component
   - Verify card appears immediately with loading spinner
   - Verify spinner disappears and menu items appear after data loads
   - Test with date that has menu items
   - Test with date that has no menu items (should show "none available")
   - Test date changes to ensure smooth transitions

2. **Visual Regression**:
   - Ensure no layout shifts during loading
   - Verify loading spinner is properly centered in the card

3. **Code Review**:
   - Confirm LoadingSpinner import is correct
   - Verify conditional logic maintains existing functionality
   - Check that loading state properly hides/shows content

## Dependencies
None - this is a self-contained UI improvement.

## Notes
This change improves perceived performance by providing immediate visual feedback that menu data is loading, rather than having the card appear suddenly after loading completes.