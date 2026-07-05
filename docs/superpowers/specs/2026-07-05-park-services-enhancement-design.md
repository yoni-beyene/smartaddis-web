# Park Services Section Enhancement — Design Spec

**Date:** July 5, 2026  
**Goal:** Transform the park details page services section from a static, minimal display into an interactive, explorable accordion-style component that groups services by type and allows users to expand individual services to see full details.

---

## Overview

Currently, services on the park detail page are displayed as a simple 2-column grid with only emoji and name. This enhancement makes services **interactive and explorable** by:
- Grouping services by category (Dining, Facilities, Shopping, First Aid, Parking)
- Implementing accordion-style expand/collapse for categories
- Allowing users to click individual services to see full details (name, description)
- Maintaining a clean sidebar layout while providing rich information on demand

**User Goal:** Users should be able to click/explore to learn more details about each service.

---

## Visual Structure & Layout

### Services Section Container
- Located in the sidebar (right column, `lg:col-span-1`)
- White background with rounded-2xl border and subtle shadow
- Padding: 20px (p-5)
- Heading: "Services" with standard section styling (font-display, text-lg, text-forest-ink)

### Category Headers
- Font: Bold, medium size (16-18px / text-base)
- Layout: Flex row with chevron icon on the right
- Icon: Rotating chevron (0° closed, 180° open)
- Hover state: Light background tint, pointer cursor
- Spacing: 12px vertical margin between categories (mb-3)
- Animation: Smooth transitions (duration-300)
- Example display: "🍽️ Dining" (emoji + category name)

### Collapsed Service Pills
- Layout: Horizontal flex layout (emoji + name)
- Container: Grid with responsive columns (1-2 columns depending on sidebar space)
- Individual pill styling:
  - Background: Light tinted (category-specific or neutral gray-50)
  - Border: 1px solid gray-200
  - Padding: 8px vertical, 12px horizontal (py-2 px-3)
  - Border radius: rounded-lg
  - Emoji: 16-18px, text size
  - Name: Truncated to fit, text-sm, gray-600 text color
  - Hover state: Background slightly darker, subtle scale effect (hover:scale-105)
- Gap between pills: 8px (gap-2)
- Smooth transitions on all hover states

### Expanded Service Card
- Full-width within sidebar
- Background: White with border
- Border: 1.5px solid (color matches category, e.g., green-200 for dining)
- Padding: 16px (p-4)
- Border radius: rounded-xl
- Layout: Vertical flex
  - Top row: Emoji (24px) + name (font-semibold, text-forest-ink) + close button (X, absolute top-right)
  - Second row: Description (text-sm, text-gray-600, leading-relaxed)
- Shadow: Subtle (shadow-sm)
- Animation: Smooth expand/collapse with height and opacity transitions

### Category Color Coding
Services are organized by type with visual distinction:
- **Dining** (RESTAURANT, CAFETERIA): Green-tinted backgrounds
- **Facilities** (TOILET, PARKING): Blue-tinted backgrounds
- **Health & Safety** (FIRST_AID): Red-tinted backgrounds
- **Shopping** (SHOP): Purple-tinted backgrounds

---

## Data Structure & Display

### Service Data
Each service contains:
- `id`: Unique identifier
- `type`: Service category (RESTAURANT, CAFETERIA, TOILET, PARKING, FIRST_AID, SHOP)
- `name`: Display name of the service
- `description`: Optional detailed description (shown when expanded)

### Service Emoji Map
Existing emoji mapping:
```
RESTAURANT: '🍽️'
CAFETERIA: '☕'
TOILET: '🚻'
PARKING: '🅿️'
FIRST_AID: '🏥'
SHOP: '🛍️'
```

### Category Grouping
Services grouped by type and displayed with friendly names:
- Dining: RESTAURANT, CAFETERIA
- Facilities: TOILET, PARKING
- Health & Safety: FIRST_AID
- Shopping: SHOP

---

## Interaction Patterns

### Expand/Collapse Behavior
1. **Category toggle:** Click category header → smoothly opens/closes category
   - Chevron rotates 180°
   - Services appear/disappear with fade animation
   - Duration: 300ms

2. **Service expand:** Click a service pill → expands to full card
   - Shows full name and description
   - Card grows with smooth height transition
   - Description fades in
   - Only one service expanded per category at a time
   - Duration: 300ms

3. **Service collapse:** Click the X button or click the same service again → collapses back to pill
   - Card shrinks with smooth height transition
   - Description fades out

### Multi-category Independence
- Each category maintains its own expanded state
- One category can have a service expanded while others are collapsed
- Expanding a service in one category doesn't affect others

### Animation Timings
- All transitions: 300ms ease-in-out
- Chevron rotation: 300ms
- Card height changes: 300ms
- Description fade: 300ms

---

## Empty States & Edge Cases

1. **No services in park:** Hide entire services section (no rendering)
2. **Service with no description:** Display "No additional information" placeholder
3. **Long service names:** Truncate in pill view, display full in expanded view
4. **Long descriptions:** Use line-clamp on pills, full text on expanded card (with leading-relaxed)

---

## Component Structure

### New Components
- **`ServiceCard.tsx`:** Individual service renderer (pill or expanded card)
  - Props: `service`, `isExpanded`, `onToggle`, `emoji`, `categoryColor`
  - Handles internal state for visual rendering
  - Manages click handlers for expand/collapse

### Updated Components
- **`ParkDetail.tsx`:** Refactor services section
  - Extract services into a `<ServicesSection>` component (inline or separate file)
  - Group services by type
  - Manage `expandedServiceByCategory` state: `Record<string, string | null>`
  - Render category headers with chevrons
  - Pass services to ServiceCard components

### State Management
- Local state in services section component: `expandedServiceByCategory`
- Track which service ID is expanded per category type
- Update state on toggle, reset when clicking another service in same category

---

## Responsive Design

- **Desktop (lg+):** Services stay in sidebar as designed
- **Tablet/Mobile (md-lg):** Services may reflow; pills may stack to 1 column if needed
- **Mobile (sm):** Services section may move to main content or remain in sidebar with adjusted spacing

---

## Accessibility & UX

- **Keyboard navigation:** Category headers and service pills should be keyboard-focusable (tabindex)
- **ARIA labels:** Use `aria-expanded` on category headers, `role="button"` on pills
- **Focus states:** Clear visual focus indicator on all interactive elements
- **Color contrast:** All text meets WCAG AA contrast requirements
- **Semantic HTML:** Use `<button>` elements for interactive triggers

---

## Success Criteria

✅ Services grouped by category with clear visual separation  
✅ Accordion-style expand/collapse for categories  
✅ Individual service expansion shows full details (name + description)  
✅ Only one service expanded per category  
✅ Smooth, non-jarring animations  
✅ Maintains sidebar layout constraint  
✅ Fully responsive on mobile/tablet/desktop  
✅ Accessible keyboard navigation and screen readers  

---

## Future Enhancements (Out of Scope)

- Service ratings or reviews
- Operating hours per service
- Pricing per service
- Service availability indicators
- Photos/images for services
- Booking/reservation flows
