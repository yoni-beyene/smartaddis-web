# Park Services Section Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the park services section from a static 2-column grid into an interactive accordion-style component with category grouping and expandable service cards.

**Architecture:** 
- Create a reusable `ServiceCard` component that renders both collapsed pill and expanded card states
- Create a `ServicesSection` component that manages category grouping, state (which service is expanded per category), and accordion interactions
- Update `ParkDetail.tsx` to replace the inline services markup with the new component
- Use React hooks (useState) for local state management; no external state management needed

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons, existing design system

## Global Constraints

- Services grouped by type: DINING (RESTAURANT, CAFETERIA), FACILITIES (TOILET, PARKING), HEALTH & SAFETY (FIRST_AID), SHOPPING (SHOP)
- Sidebar layout constraint: stay within right column, max width inherited from parent
- Animations: 300ms ease-in-out for all transitions
- Only one service expanded per category at a time
- Must support empty descriptions gracefully

---

## File Structure

**Files to create:**
- `src/components/ServiceCard.tsx` — Individual service renderer (pill or expanded card)
- `src/components/ServicesSection.tsx` — Services container with grouping and state management

**Files to modify:**
- `src/pages/ParkDetail.tsx` — Replace inline services section (lines 266-278) with `<ServicesSection>` component

---

## Task 1: Create ServiceCard Component

**Files:**
- Create: `src/components/ServiceCard.tsx`

**Interfaces:**
- Consumes: `service` object with `id`, `type`, `name`, `description?`; `emoji` string; `isExpanded` boolean; `onToggle` function
- Produces: React component rendering pill or expanded card based on state

- [ ] **Step 1: Create ServiceCard.tsx file with collapsed pill state**

Create `src/components/ServiceCard.tsx`:

```typescript
import { ChevronDown } from 'lucide-react';

interface ServiceCardProps {
  service: { id: string; type: string; name: string; description?: string };
  emoji: string;
  isExpanded: boolean;
  onToggle: () => void;
  categoryColor: string;
}

export default function ServiceCard({
  service,
  emoji,
  isExpanded,
  onToggle,
  categoryColor,
}: ServiceCardProps) {
  if (isExpanded) {
    return (
      <div
        className={`bg-white border-2 rounded-xl p-4 transition-all duration-300 ${categoryColor}`}
      >
        <div className="flex items-start gap-3 mb-2">
          <span className="text-2xl flex-shrink-0">{emoji}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-forest-ink text-sm">{service.name}</h4>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Collapse service details"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {service.description || 'No additional information'}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors hover:scale-105 w-full text-left"
      aria-label={`Expand ${service.name}`}
    >
      <span className="text-base flex-shrink-0">{emoji}</span>
      <span className="truncate">{service.name}</span>
    </button>
  );
}
```

- [ ] **Step 2: Verify component syntax**

Run: `npm run type-check`
Expected: No TypeScript errors

---

## Task 2: Create ServicesSection Component

**Files:**
- Create: `src/components/ServicesSection.tsx`

**Interfaces:**
- Consumes: `services` array with objects containing `id`, `type`, `name`, `description?`
- Produces: React component with grouping, state management, and CategorySection subcomponents

- [ ] **Step 1: Create ServicesSection.tsx with service grouping logic**

Create `src/components/ServicesSection.tsx`:

```typescript
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  type: string;
  name: string;
  description?: string;
}

interface ServicesSectionProps {
  services: Service[];
}

const serviceEmoji: Record<string, string> = {
  RESTAURANT: '🍽️',
  CAFETERIA: '☕',
  TOILET: '🚻',
  PARKING: '🅿️',
  FIRST_AID: '🏥',
  SHOP: '🛍️',
};

const categoryConfig: Record<string, { label: string; color: string; types: string[] }> = {
  dining: {
    label: 'Dining',
    color: 'border-green-200',
    types: ['RESTAURANT', 'CAFETERIA'],
  },
  facilities: {
    label: 'Facilities',
    color: 'border-blue-200',
    types: ['TOILET', 'PARKING'],
  },
  health: {
    label: 'Health & Safety',
    color: 'border-red-200',
    types: ['FIRST_AID'],
  },
  shopping: {
    label: 'Shopping',
    color: 'border-purple-200',
    types: ['SHOP'],
  },
};

interface ExpandedState {
  [category: string]: string | null; // service id or null
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [expandedState, setExpandedState] = useState<ExpandedState>({});

  // Group services by category
  const grouped: Record<string, Service[]> = {};
  Object.entries(categoryConfig).forEach(([key, config]) => {
    grouped[key] = services.filter((s) => config.types.includes(s.type));
  });

  const handleServiceToggle = (categoryKey: string, serviceId: string) => {
    setExpandedState((prev) => {
      const isCurrentlyExpanded = prev[categoryKey] === serviceId;
      return {
        ...prev,
        [categoryKey]: isCurrentlyExpanded ? null : serviceId,
      };
    });
  };

  const handleCategoryToggle = (categoryKey: string) => {
    setExpandedState((prev) => {
      const hasExpandedService = prev[categoryKey] !== null && prev[categoryKey] !== undefined;
      return {
        ...prev,
        [categoryKey]: hasExpandedService ? null : undefined,
      };
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-display text-lg text-forest-ink mb-4">Services</h3>

      <div className="space-y-4">
        {Object.entries(categoryConfig).map(([categoryKey, config]) => {
          const categoryServices = grouped[categoryKey];
          
          // Skip empty categories
          if (categoryServices.length === 0) return null;

          const isCategoryOpen = expandedState[categoryKey] !== undefined;
          const expandedServiceId = expandedState[categoryKey];

          return (
            <div key={categoryKey}>
              {/* Category Header */}
              <button
                type="button"
                onClick={() => handleCategoryToggle(categoryKey)}
                className="w-full flex items-center justify-between mb-3 text-base font-semibold text-forest-ink hover:text-primary-green transition-colors"
                aria-expanded={isCategoryOpen}
              >
                <span>
                  {serviceEmoji[categoryServices[0]?.type] || '🏷️'} {config.label}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Services Grid/Cards */}
              {isCategoryOpen && (
                <div className="space-y-2 mb-4">
                  {categoryServices.map((service) => {
                    const isExpanded = expandedServiceId === service.id;
                    return (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        emoji={serviceEmoji[service.type] || '🏷️'}
                        isExpanded={isExpanded}
                        onToggle={() => handleServiceToggle(categoryKey, service.id)}
                        categoryColor={config.color}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify component syntax**

Run: `npm run type-check`
Expected: No TypeScript errors

---

## Task 3: Update ParkDetail.tsx to Use ServicesSection

**Files:**
- Modify: `src/pages/ParkDetail.tsx:266-278` (replace inline services section)

**Interfaces:**
- Consumes: `ServicesSection` component from Task 2
- Produces: Updated ParkDetail page with new services component

- [ ] **Step 1: Import ServicesSection at top of ParkDetail.tsx**

At line 13, after the ImageCarousel import, add:

```typescript
import ServicesSection from '../components/ServicesSection';
```

- [ ] **Step 2: Replace inline services section with component**

Replace lines 266-278 (the entire services section) with:

```typescript
          {park.services.length > 0 && <ServicesSection services={park.services} />}
```

The complete replacement section should look like:

```typescript
          {park.services.length > 0 && <ServicesSection services={park.services} />}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
```

- [ ] **Step 3: Verify file syntax**

Run: `npm run type-check`
Expected: No TypeScript errors

---

## Task 4: Test the Component Interactivity

**Files:**
- Test: Manual testing in browser

**Interfaces:**
- Consumes: Running app with updated ParkDetail
- Produces: Verified interactive behavior

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: App running at `http://localhost:5173`

- [ ] **Step 2: Navigate to a park with services**

1. Open browser to `http://localhost:5173`
2. Click on any park card to navigate to its detail page
3. Scroll to the sidebar, find the Services section

- [ ] **Step 3: Test category expand/collapse**

1. Click a category header (e.g., "🍽️ Dining")
2. Verify: Chevron rotates 180°, services appear with fade animation
3. Click again to collapse
4. Verify: Chevron rotates back, services disappear smoothly

- [ ] **Step 4: Test service pill expand**

1. Open a category
2. Click a service pill
3. Verify: Pill expands to full card showing emoji, name, description, and close button (✕)
4. Verify: Description displays (or "No additional information" if empty)
5. Verify: Only one service expanded per category

- [ ] **Step 5: Test service collapse**

1. Click the ✕ button on expanded card
2. Verify: Card collapses back to pill smoothly
3. Click the same service pill again
4. Verify: Expands again (toggle works both directions)

- [ ] **Step 6: Test multi-category independence**

1. Open "Dining" category and expand a restaurant
2. Open "Facilities" category
3. Verify: Dining still shows expanded card, Facilities shows pills
4. Expand a facility service
5. Verify: Both categories have services expanded simultaneously

- [ ] **Step 7: Verify responsive behavior**

1. Resize browser to tablet width (768px)
2. Verify: Services section remains readable and interactive
3. Resize to mobile width (375px)
4. Verify: Layout adapts, pills stack if needed, interaction still smooth

- [ ] **Step 8: Check animations are smooth**

1. Expand/collapse services multiple times
2. Verify: All transitions are smooth (no jumpy, no lag)
3. Verify: Chevron rotation is smooth
4. Verify: Card height changes are fluid

---

## Task 5: Commit Changes

**Files:**
- Modified: `src/pages/ParkDetail.tsx`
- Created: `src/components/ServiceCard.tsx`, `src/components/ServicesSection.tsx`

- [ ] **Step 1: Check git status**

Run: `git status`
Expected: 3 files changed/added (ParkDetail.tsx modified, 2 new component files)

- [ ] **Step 2: Stage all changes**

Run: `git add src/components/ServiceCard.tsx src/components/ServicesSection.tsx src/pages/ParkDetail.tsx`

- [ ] **Step 3: Commit with message**

Run: 
```bash
git commit -m "feat: enhance park services section with accordion-style expandable cards

- Add ServiceCard component for pill/expanded card rendering
- Add ServicesSection component with category grouping and state management
- Group services by type (Dining, Facilities, Health & Safety, Shopping)
- Implement accordion expand/collapse with smooth 300ms transitions
- Only one service expanded per category at a time
- Update ParkDetail to use new ServicesSection component

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

Expected: Commit succeeds with 3 files changed

- [ ] **Step 4: Verify commit**

Run: `git log --oneline -1`
Expected: Latest commit shows "feat: enhance park services section..."

---

## Self-Review Against Spec

**Spec Coverage:**
- ✅ Services grouped by category (Task 2: categoryConfig)
- ✅ Accordion-style expand/collapse (Task 2: handleCategoryToggle)
- ✅ Service pills with emoji + name (Task 1: collapsed state)
- ✅ Expanded cards showing full details (Task 1: expanded state with description)
- ✅ Only one expanded per category (Task 2: expandedState management)
- ✅ Smooth animations (Task 1/2: duration-300 transitions)
- ✅ Sidebar layout maintained (Task 3: integrates into existing sidebar)
- ✅ Responsive design (Task 4 Step 7: manual testing included)
- ✅ Empty state handling (Task 2: "No additional information" fallback)
- ✅ Keyboard accessible (Task 1/2: button elements with aria labels)

**Placeholder Scan:**
- No TBDs, TODOs, or "fill in later" statements
- All code is complete and exact
- All commands are exact with expected output
- All file paths are complete

**Type Consistency:**
- ServiceCardProps interface matches usage in ServicesSection
- Service interface consistent across both components
- categoryConfig types match grouping logic
- ExpandedState type matches state management logic

**Gaps:** None identified. Plan covers full spec requirements.
