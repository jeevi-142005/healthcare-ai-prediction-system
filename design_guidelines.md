# AI-Enhanced Healthcare Resource Management System - Design Guidelines

## Design Approach: Material Design System

**Rationale**: Healthcare dashboards demand clarity, accessibility, and data-first design. Material Design provides robust patterns for information-dense interfaces, strong visual hierarchy, and proven interaction models for complex enterprise applications.

**Core Principles**:
- **Clarity First**: Medical decisions require immediate comprehension
- **Data Hierarchy**: Critical information must dominate the visual field
- **Trustworthy Interface**: Professional, stable design inspires confidence
- **Efficient Navigation**: Quick access to all modules without cognitive load

---

## Color Palette

**Primary Colors (Professional Medical Blue)**
- Primary: 210 95% 45% (Deep medical blue)
- Primary Light: 210 90% 65% 
- Primary Dark: 210 100% 35%

**Status/Priority System**
- Critical/Emergency: 0 85% 55% (Urgent red)
- High Priority: 25 90% 50% (Alert orange)
- Medium Priority: 45 85% 60% (Caution yellow)
- Low Priority: 150 40% 55% (Stable green)
- Success/Available: 145 60% 45% (Resource green)

**Neutrals & Backgrounds**
- Background: 220 15% 97% (Light mode base)
- Surface: 0 0% 100% (Card/panel white)
- Border: 220 10% 88%
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 45%

**Dark Mode**
- Background: 220 25% 8%
- Surface: 220 20% 12%
- Border: 220 15% 20%

---

## Typography

**Font Stack**: Inter (via Google Fonts CDN)
- **Display/Hero**: 2.5rem (40px), font-weight: 700, letter-spacing: -0.02em
- **Section Headers**: 1.75rem (28px), font-weight: 600
- **Card Titles**: 1.125rem (18px), font-weight: 600
- **Body Text**: 0.9375rem (15px), font-weight: 400, line-height: 1.6
- **Data/Metrics**: 1.875rem (30px), font-weight: 700, tabular-nums
- **Labels/Captions**: 0.8125rem (13px), font-weight: 500, tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 (cards, panels)
- Section spacing: space-y-8 (vertical rhythm)
- Grid gaps: gap-6 (dashboard cards)
- Page margins: px-8 py-6 (main content areas)

**Container Strategy**:
- Dashboard: max-w-[1600px] (accommodate wide data tables)
- Content Sections: max-w-7xl
- Forms/Modals: max-w-2xl

**Grid Layouts**:
- Dashboard Overview: 3-column grid (lg:grid-cols-3) for metrics
- Resource Status: 4-column grid (lg:grid-cols-4) for quick stats
- Patient List: Full-width table with fixed headers
- Analytics Charts: 2-column grid (lg:grid-cols-2) for comparisons

---

## Component Library

**Navigation**
- **Top Bar**: Fixed header with logo, module navigation, user profile, notification bell
- **Sidebar**: Collapsible left panel with icon + label navigation for all modules
- **Breadcrumbs**: Show current location within deep hierarchies

**Dashboard Cards**
- Elevated surfaces with subtle shadow (shadow-md)
- Header with icon, title, and optional action button
- Content area with appropriate data visualization
- Footer with timestamp or "View Details" link

**Data Display**
- **Metrics Cards**: Large number with label, trend indicator (↑↓), percentage change
- **Priority Queue**: Vertical list with color-coded priority badges, patient info, wait time
- **Resource Graph**: Interactive node-edge visualization with status indicators
- **Forecast Charts**: Line/area charts with prediction confidence bands, toggle controls
- **Staff Schedule**: Calendar-style grid with shift blocks, drag-drop capability (visual only)

**Tables**
- Striped rows for readability
- Sortable column headers with arrow indicators
- Action buttons (edit, delete) in fixed right column
- Pagination controls at bottom
- Search/filter bar above table

**Forms & Inputs**
- Outlined input fields with floating labels
- Dropdown selects with search capability
- Date/time pickers with calendar popup
- Radio buttons for priority selection (visual priority indicator)
- Submit buttons: Primary color, full-width on mobile

**Status Indicators**
- **Badges**: Rounded-full pills with priority colors, white text
- **Progress Bars**: Thin horizontal bars showing resource utilization
- **Status Dots**: Inline circular indicators (Available: green, In Use: blue, Critical: red)

**Modals & Overlays**
- Centered modal with backdrop blur
- Header with title and close button
- Content area with form or information
- Footer with action buttons (Cancel, Confirm)

---

## Page-Specific Layouts

**Dashboard Overview**
- Top row: 4 metric cards (Total Patients, Available Beds, Staff On Duty, Critical Cases)
- Middle: 2-column layout (Priority Queue left, Resource Graph right)
- Bottom: Full-width forecast chart with controls

**Patient Management**
- Search/filter bar with "Add Patient" button
- Patient table with columns: ID, Name, Priority, Condition, Wait Time, Actions
- Click row to expand details panel

**Resource Allocation**
- Visual graph display with nodes (beds, ICUs, doctors, ambulances)
- Right sidebar: Resource statistics and allocation controls
- Bottom panel: Real-time update log

**Staff Scheduler**
- Calendar view with week/month toggle
- "Optimize Schedule" button triggers algorithm
- Color-coded shifts by department/role
- Conflict indicators and overtime warnings

**Forecasting & Analytics**
- Tab navigation: Patient Inflow, Resource Demand, Staff Requirements
- Large interactive charts with date range selector
- AI insights panel with natural language recommendations
- Export controls (CSV, PDF)

**Emergency Management**
- Alert banner at top when active
- Resource reallocation simulator with drag-drop interface
- Side-by-side comparison: Current vs. Proposed allocation
- "Apply Changes" confirmation modal

---

## Images

**No large hero images** - This is a data-focused dashboard application where hero imagery would distract from critical information.

**Iconography**: Use outlined Material Icons via CDN for:
- Navigation items (Dashboard, Patients, Resources, Schedule, Analytics, Emergency)
- Priority indicators (Critical: alert-circle, High: arrow-up, Medium: minus, Low: arrow-down)
- Resource types (Bed: hotel, Doctor: person-outline, ICU: local-hospital, Ambulance: local-shipping)
- Actions (Add: add-circle, Edit: edit, Delete: delete, Optimize: auto-fix-high)

**Visualization Assets**: Use Chart.js for all data visualizations (line, bar, doughnut charts)

---

## Key Interactions

- **Priority Queue**: Auto-updates when new patient added, visual slide animation
- **Resource Graph**: Hover nodes to see details, click to allocate/reallocate
- **Charts**: Tooltips on hover, click legend to toggle data series
- **Tables**: Row hover highlights, click to select/expand
- **Buttons**: Subtle scale on hover (hover:scale-105), loading spinner during async operations

**Critical**: All form inputs and text fields maintain dark mode consistency with proper contrast ratios (WCAG AA minimum).