# Acadebit — Complete Build Prompts for Claude Code

## PROJECT OVERVIEW
Build "Acadebit" — Kenya's Complete School Operating System. A multi-portal web platform serving 8 user types across 17 modules with 155+ features. Built specifically for Kenyan schools with CBC (Competency-Based Curriculum) alignment, M-Pesa integration, biometric safety, and offline-first architecture.

---

## PROMPT 1: PROJECT SETUP & DESIGN SYSTEM

```
Create a new Next.js 14 project with TypeScript, Tailwind CSS, and shadcn/ui.

Design System Requirements:
- Dark-first theme with light mode toggle (CSS variables)
- Color palette:
  --bg: #07090f, --card: #0f1117, --card2: #161923, --border: #1e2330
  --green: #22c55e, --blue: #3b82f6, --purple: #a855f7, --teal: #14b8a6
  --amber: #f59e0b, --red: #ef4444, --orange: #f97316, --pink: #ec4899, --indigo: #6366f1
- Font: DM Sans (body), DM Mono (data/labels)
- Border radius: 13px for cards, 100px for pills/buttons
- Shadows: 0 8px 32px rgba(0,0,0,.4)
- Transitions: cubic-bezier(.4,0,.2,1)

Install: recharts (charts), framer-motion (animations), lucide-react (icons), date-fns

Create the base layout with:
1. Landing page shell with animated hero section
2. App shell with collapsible sidebar (210px desktop, slide-out mobile)
3. Sticky header with global search, clock, notifications, theme toggle
4. Toast notification system (top-right, auto-dismiss)
5. Cart FAB (bottom-right, appears when items added)
6. Quick Actions FAB (bottom-left, home/theme/help shortcuts)
7. Modal system for cart, payments, confirmations

All components must be responsive (mobile-first):
- < 768px: single column, hamburger sidebar, stacked layouts
- 768-1024px: 2-column grids
- > 1024px: full multi-column dashboards
```

---

## PROMPT 2: LANDING PAGE

```
Build the landing page as the entry point to 8 portals.

Structure:
- Fixed nav: Logo (A icon + "Acadebit" + "KENYA SCHOOL OS"), right-side portal quick-links
- Hero section:
  - Badge: "✦ Kenya's Complete School OS · 17 Modules · 155+ Features"
  - H1: "Every person. Every process. One platform." (gradient text: green→blue→purple)
  - Subtitle paragraph about CBC, M-Pesa, offline-first
  - Stats row: 155+ Features | 17 Modules | 8 Portals | CBC 100% | M-Pesa | Offline First
  - Animated counters on scroll-into-view

- Portal Grid (4 columns desktop, 2 tablet, 1 mobile):
  8 portal cards with:
  - Icon (emoji), Name, Description, Role badge, Arrow
  - Hover: translateY(-4px), colored glow shadow, icon scale(1.1)
  - Color-coded borders: Principal(green), Teacher(blue), Student(purple), Parent(teal), BOM(amber), MoE(indigo), Shop(orange), Vendor(pink)
  - Keyboard accessible (tabindex, Enter to navigate)

- Acadebit Shop CTA banner at bottom

Clicking any portal transitions to the app shell with that portal's sidebar nav.
```

---

## PROMPT 3: PORTAL ROUTING & STATE MANAGEMENT

```
Implement portal-based routing and state.

Data structure (portals object):
Each portal has: name, role label, primary color, icon, views array (id, icon, label)

Portals and their views:
1. PRINCIPAL (green): Dashboard, SafetyCore™, FeeSmart™, Staff & Timetable, GovBridge™ Reports
2. TEACHER (blue): CBC Tracker & Classes, AI Teacher Studio
3. STUDENT (purple): Learning Dashboard, AI Tutor & Flashcards, Past Papers Hub
4. PARENT (teal): My Child — Brian, Buy Textbooks, Buy Uniforms
5. BOM (amber): Governance Dashboard
6. MoE (indigo): National Dashboard
7. SHOP (orange): Textbooks, Lab Equipment, Uniforms
8. VENDOR (pink): Vendor Dashboard

State:
- currentPortal: string | null
- currentView: string
- sidebarOpen: boolean (mobile)
- theme: 'dark' | 'light'
- cart: CartItem[]
- notifications: Notification[]
- emergencyActive: boolean

Use React Context or Zustand for global state.
Transition: Landing→App has 0.5s opacity+scale animation.
```

---

## PROMPT 4: PRINCIPAL PORTAL

```
Build all 5 Principal views with real data visualization.

VIEW 1 — Dashboard:
- Header: School name, term/week/date, present/absent badges
- Stats grid (4): Enrolment(255), Present(243/95.3%), Fees(79% = KES 960K/1.2M), Staff(18/20)
- Fee Collection Chart: Bar chart (Recharts), monthly Jan-Jun, expected vs collected
- AI At-Risk Alerts panel: 3 student cards with severity badges (HIGH=red, MED=amber), clickable → toast
- Biometric Gate Log: Timeline list with IN/OUT/BLOCKED badges, hover effects
- Attendance by Class: Horizontal stacked bar chart (present vs absent per class)

VIEW 2 — SafetyCore™:
- Big red "ACTIVATE EMERGENCY" toggle button with pulse animation when active
- Emergency alert banner (hidden by default): timer counting up, parent notification status
- Stats: On Campus(263), Accounted(243), Unaccounted(20)
- Live Headcount: List of 6 classes with progress bars, SAFE/CHECK/ALERT badges
- Prevention Features: 5 feature cards with icons

VIEW 3 — FeeSmart™:
- Stats: Collected(KES 960K), Outstanding(KES 252K), M-Pesa Payments(187), Reminders(312)
- Fee Trend: Line chart showing monthly collection
- Recent Payments: List with +KES amounts in green, M-Pesa flow explanation box

VIEW 4 — Staff & AutoTable™:
- Stats: Total Staff(24), Present(22), Timetable(Active), Substitutes(2)
- Staff Directory table: Name, Role, Subjects, Class, Status badge, TSC Number
- AutoTable™ info box explaining smart timetable generation

VIEW 5 — GovBridge™ Reports:
- Stats: NEMIS Sync(98.2%), MoE Score(91%), Pending(2), Generated(14)
- Compliance Checklist: 6 items with colored dots and status badges
- One-Click Reports: 5 report cards with Generate/Export/Submit buttons that show loading spinner → success state
```

---

## PROMPT 5: TEACHER PORTAL

```
Build both Teacher views.

VIEW 1 — CBC Tracker & Classes:
- Header: Teacher name, subject, class, term
- Stats: My Students(178), Lessons Done(16), Tests Pending(2), Parent Messages(7)
- CBC Competency Table: 5 students × 5 columns (Algebra, Geometry, Stats, Overall, Attendance)
  - Cell badges: EE(green)=Exceeds, ME(blue)=Meets, AE(amber)=Approaching, BE(red)=Below
  - Attendance as percentage with color coding
- Scheme of Work: 5 weeks, current week highlighted (Week 7 = Quadratic Equations), checkmarks for completed
- Class Performance: Bar chart by subject

VIEW 2 — AI Teacher Studio:
- Header with "AI Powered" chip
- AI Input: Topic input + Generate button. On generate: show spinner → display full output (lesson plan, PPT, notes, podcast, test, flashcards)
- 6 AI tool cards in 3-column grid: Lesson Plan, Presentation, Notes & PDF, Podcast Script, Test Generator, Flashcard Builder
  - Each card has icon, title, description, AI chip
  - Hover: colored border glow
- Time Saved panel: 4 stat boxes showing hours saved (4+3+2 = 9+ total)
```

---

## PROMPT 6: STUDENT PORTAL

```
Build all 3 Student views.

VIEW 1 — Learning Dashboard:
- Greeting: "Good Morning, Brian 👋" with streak badge
- Stats: Lessons This Week(12/15), Last Test(74%, +6%), Class Rank(#4/45), Assignments Due(3)
- AI Study Plan: 4 task cards with status (Done=green, Now=purple, Later=gray)
  - Each task has icon, subject, topic, duration, status badge
- CBC Progress: 5 subjects with progress bars and competency labels
- Class Leaderboard: Top 3 + current user highlighted at #4

VIEW 2 — AI Tutor & Flashcards:
- Chat interface:
  - Message area with auto-scroll
  - Pre-loaded conversation (AI greeting, user question, AI answer about quadratics)
  - Input field + Send button
  - Quick-ask buttons: Photosynthesis, Insha writing, Water cycle
  - Typing indicator when AI "responds"
- Flashcard: Click to flip question↔answer, gradient reveal
  - 2 buttons: "Didn't know" / "Got it!" → loads next card
  - 3 cards in rotation
- Weekly Test Progress: Line chart (student vs class average)

VIEW 3 — Past Papers Hub:
- Stats: KCPE(2000-23), KCSE(2000-23), CBC(2019-24), AI Marking(All)
- Filter pills: KCSE✓, KCPE, Mathematics✓, 2020-2023
- Paper list: 4 papers with download badge + Practice button
  - Each shows: title, marks, duration, status (New/Best score/Not attempted)
- AI Topic Intelligence: Alert box about quadratic equations frequency
- Past Paper History: Line chart showing score progression 2019-2023
```

---

## PROMPT 7: PARENT, BOM, MOE PORTALS

```
Build Parent, BOM, and MoE views.

PARENT — My Child:
- Child profile card with gradient background: name, grade, admission number, arrival status
- 4 subject progress bars with competency labels
- Today's Timeline: Vertical timeline with icons, times, events (Arrived→Assembly→Maths→Break)
- Fee Payment panel: Outstanding balance, due date, "Pay via M-Pesa" button → opens payment modal
  - Installment option note
  - Quick links to Shop (Textbooks, Uniforms)
- Message Teacher: Textarea + Send button
- School Announcements: 2 announcement cards

BOM — Governance Dashboard:
- Header: Chairman name, school, next meeting date
- Stats: Fee Collection(79%, +4%), Staff Attendance(94%, +1%), Student Performance(68%, -2%), Compliance(91%, +6%)
- Budget vs Expenditure: Horizontal bar chart by category (Salaries, Infra, Learning, Ops, Security)
- Board Resolutions: 4 resolution cards with vote counts, status badges (PASSED/DEFERRED)
- Board Meeting Pack: 6 auto-generated document cards with ready/in-progress status

MoE — National Dashboard:
- Header: "Ministry of Education — GovBridge™"
- Stats: Schools on Acadebit(1,847), Learners(412K), CBC Compliance(67%, +12%), NEMIS Sync(98.2%)
- CBC Compliance by County: Bar chart (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Garissa) with color-coded bars
- National Compliance Status: 6 checklist items with dots and badges
- Action buttons: Generate County Report, Export NEMIS Package
```

---

## PROMPT 8: SHOP & VENDOR PORTALS

```
Build the marketplace and vendor dashboard.

SHOP — Textbooks:
- Category tabs: Textbooks(active), Lab Equipment, Uniforms, Stationery, Sports
- "Recommended for Grade 8 · Brian Omondi" label
- Product grid (3 columns): 6 textbook cards
  - Each: emoji icon, publisher, title, price, "Add to Cart — M-Pesa" button
  - Bundle card highlighted in orange
  - Hover: border color change, lift effect

SHOP — Lab Equipment:
- School Purchase Order Flow: 4-step visual (Principal selects → LPO generated → Supplier confirms → Delivered)
- 6 lab equipment cards with "Add to School Order" buttons

SHOP — Uniforms:
- "How it works for Parents" 4-step flow
- "Uniforms — Mwangaza Junior Academy" label
- 6 uniform items with "Order — M-Pesa" buttons

VENDOR — Dashboard:
- Stats: Revenue(KES 84K, +23%), Orders(127, 18 pending), Products(84), Rating(4.8)
- Recent Orders table: Order #, Product, Buyer, Amount, Status badge
- Revenue Trend: Line chart
- Add New Product form: name input, price input, "List Product" button
- M-Pesa Settlement info box
```

---

## PROMPT 9: SHARED COMPONENTS & INTERACTIONS

```
Build all shared interactive components.

CART SYSTEM:
- addCart(name, price): adds to array, updates badge count, shows toast
- Cart Modal: overlay with item list (name, price, delete button), total, Clear + Pay buttons
- Checkout: simulates M-Pesa STK push, shows "Enter PIN" toast, then success

PAYMENT MODAL:
- M-Pesa number input, amount input
- Quick amount buttons: KES 4,167 / KES 6,250 / Full
- "Send STK Push" button → loading → success toast

NOTIFICATIONS:
- Dropdown from bell icon with 3 sample notifications
- Each clickable → triggers relevant toast
- Red dot indicator when unread

THEME TOGGLE:
- Sun/moon icon, toggles CSS class on body
- All charts re-render with new colors
- Preference persisted in localStorage

EMERGENCY SYSTEM:
- Toggle button: normal → pulsing red active state
- Active: shows alert banner with live timer, notification status
- Deactivate: returns to normal, shows cleared toast

AI CHAT:
- sendChat(): adds user message, shows typing indicator, simulates AI response after delay
- qChat(preset): fills input and sends
- Responses mapped by keyword: photo→photosynthesis, insha→kiswahili, water→geography

KEYBOARD SHORTCUTS:
- Escape: close modals, or go home if no modals
- / : focus search input
- All cards: Enter key to activate

TOAST SYSTEM:
- 4 types: success(green), error(red), warning(amber), info(blue)
- Auto-dismiss after 3.5s with slide-out animation
- Max 5 toasts visible

PRINT STYLES:
- Hide sidebar, header, FABs
- Show all content, white background, black text
- Page breaks between views
```

---

## PROMPT 10: DATA, TYPES & MOCK DATA

```
Create TypeScript types and comprehensive mock data.

Types:
- Portal, View, CartItem, Notification, Student, Staff, Order, Product, Resolution, ComplianceItem
- All with proper interfaces

Mock Data:
- 5 students with full CBC competency data
- 4 staff members with TSC numbers
- 6 shop products per category
- 5 vendor orders
- 4 board resolutions
- 6 compliance checklist items
- 6 county compliance percentages
- 7 weeks of test scores
- 6 months of fee collection data
- 6 months of vendor revenue

All data should feel realistic for a Kenyan junior academy (Mwangaza Junior Academy, 255 students, 24 staff, Term 2 2026).
```

---

## PROMPT 11: PERFORMANCE & ACCESSIBILITY

```
Optimize for production use in Kenyan schools.

Performance:
- Lazy load portal views (dynamic imports)
- Chart.js/Recharts only render when view is visible
- Images: use next/image with placeholder blur
- Bundle size: aim for <200KB initial JS

Accessibility:
- All interactive elements have focus states
- Color contrast WCAG AA minimum
- ARIA labels on icons and buttons
- Keyboard navigation throughout
- Screen reader friendly tables with proper headers

Offline-First (commented architecture for later):
- Service worker registration placeholder
- localStorage for cart persistence
- Cache API for past papers and static content

Mobile:
- Touch targets minimum 44px
- Swipe gestures for sidebar (future)
- Bottom sheet modals on mobile
- Viewport-locked layouts prevent zoom issues
```

---

## PROMPT 12: DEPLOYMENT & ENVIRONMENT

```
Prepare for deployment.

Environment Variables:
- NEXT_PUBLIC_APP_NAME=Acadebit
- NEXT_PUBLIC_API_URL (placeholder for backend)
- MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET (sandbox)

Build:
- next build → static export for CDN deployment
- Or Docker container for school servers

Features to mark as "Coming Soon":
- Stationery category
- Sports equipment
- Real M-Pesa API integration (currently simulated)
- Biometric hardware integration
- WhatsApp/SMS gateway
- NEMIS API sync

Documentation comments in code explaining:
- Which parts are MVP vs Phase 2
- Where real APIs will replace mock data
- Kenya-specific configurations (CBC strands, KNEC formats)
```

---

## FINAL INTEGRATION PROMPT

```
Now integrate everything into a single cohesive application.

File structure:
/app
  /(landing)/page.tsx
  /(app)/layout.tsx
  /(app)/[portal]/page.tsx
  /components
    /ui (shadcn components)
    /layout (Sidebar, Header, AppShell)
    /landing (Hero, PortalGrid, Stats)
    /shared (Toast, Modal, Cart, Search)
    /charts (all Recharts wrappers)
    /portals
      /principal (5 views)
      /teacher (2 views)
      /student (3 views)
      /parent (1 view)
      /bom (1 view)
      /moe (1 view)
      /shop (3 views)
      /vendor (1 view)
  /lib
    /data (all mock data)
    /types.ts
    /utils.ts
  /hooks
    usePortal.ts, useCart.ts, useTheme.ts, useToast.ts

Ensure:
- All 17 modules represented across views
- 155+ features visible in UI (count badges, feature lists, tool cards)
- Every button does something (no dead clicks)
- Smooth 60fps animations
- Zero console errors
- Works on Chrome, Safari, Firefox latest
- Works on Android Chrome and iOS Safari
```

---

## DESIGN PRINCIPLES TO EMPHASIZE

1. **Information Density**: Kenyan school staff need LOTS of data visible at once. Don't oversimplify.
2. **Speed**: Every interaction <100ms feedback. Loading states on everything >300ms.
3. **Trust**: M-Pesa payments need clear confirmation flows. Safety alerts need immediate visual impact.
4. **Local Context**: CBC terminology (EE/ME/AE/BE), Kenyan shillings, NEMIS/KNEC/TSC references, Kiswahili support.
5. **Offline Resilience**: Show what's cached vs live. Graceful degradation when disconnected.
