# NeuroMarketer Design Guidelines

## Design Approach

**Selected System**: Material Design + Linear-inspired productivity aesthetics
**Justification**: Information-dense productivity tool requiring clear forms, efficient workflows, and professional polish for Russian-speaking marketers.

## Typography

**Font Families**:
- Primary: Inter (body, UI elements, forms) - excellent Cyrillic support
- Display: Plus Jakarta Sans (headings, landing page) - modern, approachable

**Hierarchy**:
- Hero headline: text-5xl/text-6xl, font-bold
- Section headers: text-3xl/text-4xl, font-semibold  
- Tab labels: text-base, font-medium
- Form labels: text-sm, font-medium, uppercase tracking
- Body text: text-base, leading-relaxed
- Helper text: text-sm
- Generated results: text-base, leading-7 (optimal for Russian readability)

## Layout System

**Spacing Primitives**: Use Tailwind units 2, 4, 6, 8, 12, 16, 20, 24
- Form field gaps: space-y-6
- Section padding: p-8, p-12 for containers
- Card padding: p-6
- Button padding: px-6 py-3
- Page margins: max-w-7xl mx-auto px-8

**Grid Strategy**:
- Landing: Single column, max-w-4xl for content
- Workspace: Two-column split (40% form / 60% results) on lg screens, stack on mobile
- History table: Full-width with max-w-7xl

## Component Library

### Landing Page (`/`)

**Hero Section** (80vh):
- Full-width background with subtle gradient
- Centered content: max-w-3xl
- Large hero image: Abstract illustration of marketing/AI collaboration (futuristic dashboard mockup with Russian text elements)
- Headline + subtitle stacked vertically with space-y-4
- CTA button: Large (px-8 py-4), rounded-lg, with arrow icon
- Trust indicator below CTA: "Trusted by 500+ Russian marketers" with small logos

**Features Section** (py-20):
- Three-column grid (grid-cols-3) on desktop, stack on mobile
- Each feature card: Icon (80px), title (text-xl), description (text-base)
- Cards with subtle border, p-8, rounded-xl

**How It Works** (py-20):
- Numbered steps (1-2-3), horizontal layout
- Each step: Large number, title, description
- Connecting lines between steps

**Footer**:
- Two-column: Links (Продукт, Ресурсы, Поддержка) / Contact info
- Social links, copyright

### Workspace (`/app`)

**Header**:
- Fixed top bar with logo left, minimal navigation
- Clean white background with subtle bottom border
- Height: h-16

**Tab Navigation**:
- Horizontal tabs below header
- Active tab: border-b-2 with accent, font-medium
- Inactive: subtle hover state
- Icons + text for each tab
- Sticky position (sticky top-16)

**Form Panels** (Left Side):
- White cards with rounded-xl, border
- Form groups with space-y-6
- Label above input pattern
- Textareas: min-h-24, rounded-lg border
- Select dropdowns: Full-width, rounded-lg
- Number inputs: Compact width
- "Использовать пример" button: Small, secondary style, mb-6
- Submit button: Full-width, large (py-3), prominent
- Loading state: Disabled button with spinner

**Results Panels** (Right Side):
- Sticky top positioning (sticky top-32) to stay visible while scrolling forms
- Each variant: Card with rounded-lg border, p-6, space-y-3
- Variant number badge (top-right): Small pill
- Generated text: bg-gray-50 rounded p-4, monospace-like for structure
- "Копировать" button: Small, icon + text, top-right of each variant
- Success feedback: Brief green checkmark animation on copy
- Empty state: Centered illustration + "Заполните форму чтобы начать"

### History Tab (`/app?tab=history`)

**Filter Bar**:
- Horizontal flex layout, gap-4
- Module dropdown (w-48)
- Search input (flex-1, max-w-md)
- "Только избранное" toggle switch

**Table**:
- Full-width, rounded-lg border
- Header: bg-gray-50, font-medium, text-sm
- Rows: hover:bg-gray-50, cursor-pointer
- Columns: Date (w-40), Module badge, Input snippet (truncated), Output preview
- Star icon: Interactive, hover:scale-110
- Sticky header on scroll

**Detail Modal**:
- Overlay: bg-black/50
- Modal: max-w-3xl, bg-white, rounded-xl, p-8
- Close button: top-right (absolute)
- Content sections: Input JSON (collapsible), Full output (scrollable)
- Actions: Copy full text, Delete entry

## Key Interactions

**Copy to Clipboard**:
- Button: Icon (copy) + "Копировать"
- On click: Icon changes to checkmark, text to "Скопировано!", green accent
- Reset after 2s

**Form Validation**:
- Required fields: Red border + error text below on submit
- All Russian error messages
- Disable submit during API call

**Loading States**:
- Generate buttons: Spinner + "Генерируем..."
- Results area: Skeleton cards (3 pulsing rectangles)

## Images

**Hero Image**: 
- Full-width background (1920x1080): Gradient mesh with abstract data visualization, Russian text snippets floating, modern marketing imagery
- Style: Soft, professional, slightly futuristic
- Placement: Behind hero content with overlay for readability

**Feature Icons**: Use Heroicons via CDN
- Яндекс.Директ: MegaphoneIcon
- Email/Social: EnvelopeIcon
- Лояльность: HeartIcon  
- История: ClockIcon

**Empty States**: Simple illustrations (find on unDraw or similar) showing:
- Results panel: Person at desk with lightbulb
- History: Empty folder/documents

## Accessibility

- All form inputs: aria-labels in Russian
- Focus indicators: 2px ring with offset
- Keyboard navigation: Tab through forms, Enter to submit
- Error announcements: aria-live regions