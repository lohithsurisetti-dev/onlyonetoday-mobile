# OnlyOne.Today - Mobile App Screens for Stitch AI

Complete screen descriptions for generating React Native screens using Stitch AI.

---

## 🎨 **Design System Reference**

### Color Palette
```
Primary Purple: #8b5cf6
Background Dark: #0a0a1a (deep space blue-black)
Surface Dark: #1a1a2e (card background)
Surface Mid: #2d2d44 (elevated elements)
Accent Blue: #3b82f6
Accent Pink: #ec4899
Accent Gold: #fbbf24
Text Primary: #f9fafb (white)
Text Secondary: #9ca3af (gray)
Text Muted: #6b7280 (darker gray)
```

### Typography
- **Display Font**: Inter (system font for mobile)
- **Heading Sizes**: 24px (large), 18px (medium), 16px (small)
- **Body Sizes**: 16px (base), 14px (small), 12px (caption)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Effects
- **Glassmorphism**: `rgba(26, 26, 46, 0.8)` with 10px blur
- **Glow Effect**: Soft purple/blue glow around elevated cards
- **Border Radius**: 12px (default), 16px (large), 24px (extra large)
- **Shadows**: Soft, subtle shadows with purple/blue tint

### Animations
- **Fade In**: 300ms ease-out
- **Slide Up**: 400ms ease-out with spring
- **Button Press**: Scale down to 0.95 on press
- **Pull to Refresh**: Elastic spring animation

---

## 📱 **Screen 1: Home / Submit Action**

### Screen Name
`HomeScreen.tsx`

### Purpose
Main entry point where users submit what they did today.

### Layout Description

**Background:**
- Deep space gradient from `#0a0a1a` at top to `#1a1a2e` in middle to `#2d1b4e` at bottom
- Animated white dots scattered across the background (star field effect)
- Subtle blur on background for depth

**Top Section (Header):**
- Status bar: Light content
- Logo/Title: "OnlyOne.Today" in large bold white text (24px), centered
- Tagline below: "Discover your uniqueness" in secondary gray (14px), centered
- Padding: 48px from top, 24px horizontal

**Stats Bar:**
- Horizontal pill-shaped container with glassmorphism effect
- Background: `rgba(26, 26, 46, 0.8)` with backdrop blur
- Border: 1px solid `rgba(255, 255, 255, 0.1)`
- Border radius: 24px (full pill shape)
- Height: 56px
- Contains 2 stats side by side:
  - Left: "🔥 [X] posts today" in white (14px semibold)
  - Right: "✨ [X] unique actions" in white (14px semibold)
- Padding: 16px horizontal

**Main Content (Center):**
- Large card with glassmorphism
- Background: `rgba(26, 26, 46, 0.9)` with backdrop blur
- Border: 1px solid `rgba(139, 92, 246, 0.3)` (purple glow)
- Border radius: 24px
- Padding: 32px
- Soft purple glow shadow

Inside card:
1. **Title:** "What did YOU do today?" (18px bold white)
2. **Input Type Tabs:**
   - Two tabs: "Single Action" | "Day Summary"
   - Active tab: Purple background (#8b5cf6), white text
   - Inactive tab: Transparent, gray text
   - Border radius: 12px
   - Padding: 12px 24px

3. **Text Input:**
   - Multiline text input
   - Placeholder: "I went skydiving for the first time..."
   - Background: `rgba(255, 255, 255, 0.05)`
   - Border: 1px solid `rgba(255, 255, 255, 0.1)`
   - Border radius: 16px
   - Padding: 16px
   - Text color: White
   - Font size: 16px
   - Min height: 120px
   - Character counter below: "[X]/500" (12px gray)

4. **Scope Selector:**
   - Label: "Compare with:" (14px gray)
   - 4 horizontal chips:
     - 🌍 Worldwide | 🌎 Country | 🏛️ State | 📍 City
   - Selected chip: Purple background with white text
   - Unselected: Transparent with border, gray text
   - Border radius: 20px
   - Padding: 10px 16px
   - Font size: 14px

5. **Submit Button:**
   - Full width
   - Height: 56px
   - Background: Linear gradient from purple (#8b5cf6) to pink (#ec4899)
   - Border radius: 16px
   - Text: "Discover My Uniqueness ✨" (16px bold white)
   - Shadow: Soft purple glow
   - Press animation: Scale to 0.95

**Bottom Section:**
- Safe area padding
- Quick links or version info in small gray text

### Spacing
- All cards: 24px horizontal margin from screen edges
- Vertical spacing between elements: 24px
- Inner card padding: 32px

### Interactions
- Tap input type tabs to switch between action/day summary
- Tap scope chips to select comparison scope
- Auto-resize text input as user types
- Haptic feedback on button press
- Loading state: Button shows spinner, disabled during submission

---

## 📱 **Screen 2: Response / Percentile Display**

### Screen Name
`ResponseScreen.tsx`

### Purpose
Show user how unique their action is with beautiful visualizations.

### Layout Description

**Background:**
- Same space gradient with animated stars
- More vibrant if "elite" tier (add golden glow effect)

**Top Bar:**
- Back button (← icon, 24px, white) on top left
- Share button (share icon, 24px, white) on top right
- Padding: 16px

**Hero Section (Top 1/3 of screen):**
- Large circular progress indicator (200px diameter)
- Background: `rgba(26, 26, 46, 0.9)` with glassmorphism
- Border: 3px gradient border (purple to pink)
- Inside circle:
  - Animated SVG ring showing percentile (stroke animation)
  - Ring color based on tier:
    - Elite: Gold (#fbbf24)
    - Rare: Purple (#8b5cf6)
    - Unique: Blue (#3b82f6)
    - Notable: Pink (#ec4899)
    - Common: Gray (#9ca3af)
  - Center text:
    - "Top [X]%" (32px bold, tier color)
    - Emoji below (48px)
    - Small label: "[Tier Name]" (14px gray)

**Message Card:**
- Below hero circle
- Glassmorphism card
- Background: `rgba(26, 26, 46, 0.8)`
- Border: 1px solid tier color with opacity 0.3
- Border radius: 20px
- Padding: 24px
- Margin: 0px horizontal, 24px top

Content:
- Main message: Large bold text (20px) in white
  - Examples:
    - "You're a unicorn! Only you did this! 🦄"
    - "Super rare! Only [X] people did this"
    - "[X] others did something similar"
- Scope indicator: Small pill below
  - Icon + text: "🌍 Worldwide" (12px gray)
  - Background: `rgba(255, 255, 255, 0.05)`
  - Border radius: 12px
  - Padding: 6px 12px

**Content Quote:**
- Glassmorphism card
- Display user's submitted action in quotes
- Font: Italic serif style (18px)
- Color: White with slight opacity (0.9)
- Padding: 20px
- Border radius: 16px
- Margin: 16px horizontal, 16px top

**Stats Grid (2 columns):**
- Two cards side by side
- Each card:
  - Glassmorphism background
  - Border radius: 16px
  - Padding: 16px
  - Gap: 12px between cards

Left card:
- Icon: 🎯
- Label: "Ranking" (12px gray)
- Value: "Top [X]%" (20px bold tier color)
- Progress bar below (full width, 4px height, tier color)

Right card:
- Icon: 👥
- Label: "People" (12px gray)
- Value: "[X] of [Y]" (20px bold tier color)
- Progress bar below

**Temporal Stats (if available):**
- Collapsible section
- Label: "Historical Context" with chevron (14px gray)
- When expanded:
  - Glassmorphism card
  - "Last seen: [X] days ago" (14px white)
  - "Frequency: [rare/common/first time]" (12px gray)
  - Small line chart showing temporal pattern (optional)

**Action Buttons:**
- Floating at bottom (safe area)
- 2 buttons side by side with gap
- Each button:
  - Height: 52px
  - Border radius: 16px
  - Font: 16px semibold

Button 1 (70% width):
- "Share My Uniqueness ✨"
- Purple gradient background
- White text
- Glow shadow

Button 2 (30% width):
- "View Feed 🌍"
- Transparent with purple border
- Purple text
- No glow

### Spacing
- All cards: 16px horizontal margin
- Vertical gaps: 16px between sections
- Bottom button section: Fixed at bottom with 16px padding + safe area

### Animations
- Circle: Animate stroke from 0 to percentile over 1.5s with elastic easing
- Cards: Fade in and slide up (staggered, 100ms delay between each)
- Stats bars: Animate width from 0 to value over 1s

---

## 📱 **Screen 3: Feed / Global Posts**

### Screen Name
`FeedScreen.tsx`

### Purpose
Browse what others are doing, filtered and sorted.

### Layout Description

**Background:**
- Space gradient (same as other screens)
- Lighter stars (less prominent)

**Top Bar (Fixed):**
- Height: 64px + safe area
- Background: `rgba(10, 10, 26, 0.95)` with blur
- Border bottom: 1px solid `rgba(255, 255, 255, 0.1)`

Content:
- Title: "Global Feed 🌍" (20px bold white) - left aligned
- Filter button (filter icon) - right aligned
- Below title: Filter pills (horizontal scroll)
  - Pills: "All" | "Trending" | "Elite" | "Actions" | "Summaries"
  - Selected: Purple background, white text
  - Unselected: Transparent with border, gray text
  - Height: 36px
  - Padding: 8px 16px
  - Border radius: 18px
  - Gap: 8px

**Pull to Refresh Indicator:**
- At very top
- Circular spinner with purple color
- Appears when pulling down
- Elastic animation

**Post List (Scrollable):**
- Vertical list with optimized FlashList
- Each post card:

**Post Card Design:**
- Width: Screen width - 32px (16px margin each side)
- Background: `rgba(26, 26, 46, 0.85)` with glassmorphism
- Border: 1px solid based on tier (elite = gold, rare = purple, etc.)
- Border radius: 20px
- Padding: 20px
- Margin bottom: 16px
- Shadow: Soft glow matching tier color

Card content (top to bottom):
1. **Header Row:**
   - Left: Tier badge
     - Small rounded pill (8px height, 60px width)
     - Background: Tier color with opacity 0.2
     - Text: "Top [X]%" (10px bold, tier color)
   - Right: Time
     - "[X] mins ago" (12px gray)

2. **Content:**
   - User's action in quotes (16px white, slightly bold)
   - Font: Regular (not italic)
   - Max lines: 3, then "..." with "more" link
   - Margin: 12px top

3. **Metadata Row:**
   - Small pills with icons
   - Horizontal layout with 8px gap
   - Each pill:
     - Background: `rgba(255, 255, 255, 0.05)`
     - Border radius: 12px
     - Padding: 6px 10px
     - Font: 11px gray
   - Pills:
     - 🎯 "[X] of [Y] people"
     - Scope icon + text (e.g., "🌍 World")
     - Type badge (e.g., "🎬 Action")

4. **Footer Row:**
   - Share button: Icon only (share icon, 18px, gray)
   - Tappable, haptic feedback
   - Right aligned

### Spacing
- Top bar: 16px horizontal padding
- Cards: 16px horizontal margin from edges
- Card inner padding: 20px
- Gap between cards: 16px
- Bottom padding: 100px (for tab bar)

### Interactions
- Tap card: Navigate to detail view (optional)
- Tap share: Open share sheet with that post
- Pull down: Refresh feed
- Scroll up quickly: Hide filter pills, show only title (condense header)
- Tap filter pills: Filter posts instantly
- Loading state: Show 3 skeleton cards

### Empty State
- If no posts match filter:
  - Large icon: 🌌 (48px)
  - Text: "No posts yet" (18px gray)
  - Subtext: "Be the first!" (14px lighter gray)
  - Button: "Submit Action ✨" (purple gradient)
  - Centered vertically and horizontally

---

## 📱 **Screen 4: Filter Sheet (Modal)**

### Screen Name
`FilterSheetModal.tsx`

### Purpose
Bottom sheet modal for advanced filtering options.

### Layout Description

**Presentation:**
- Modal bottom sheet
- Slides up from bottom with spring animation
- Background: `rgba(26, 26, 46, 0.98)` with blur
- Border radius (top only): 24px
- Height: 60% of screen (dynamic based on content)
- Backdrop: Dark overlay (rgba(0,0,0,0.6))

**Handle:**
- Top center
- Small horizontal pill (40px width, 4px height)
- Color: `rgba(255, 255, 255, 0.3)`
- Margin: 12px from top

**Header:**
- Title: "Filters" (20px bold white)
- Close button: X icon (right aligned, 24px, gray)
- Padding: 24px horizontal, 16px vertical
- Border bottom: 1px solid `rgba(255, 255, 255, 0.1)`

**Content (Scrollable):**

Section 1: **Tier Filter**
- Label: "Uniqueness Tier" (14px semibold white)
- Multi-select chips:
  - 🥇 Elite | 💎 Rare | ✨ Unique | 📌 Notable | 👥 Common | 🔥 Popular
- Chip design:
  - Unselected: Transparent with border, gray text
  - Selected: Tier color background, white text
  - Border radius: 16px
  - Padding: 10px 16px
  - Wrap to multiple rows

Section 2: **Scope Filter**
- Label: "Location Scope" (14px semibold white)
- Single-select chips:
  - 🌍 Worldwide | 🌎 Country | 🏛️ State | 📍 City
- Same chip design as above

Section 3: **Type Filter**
- Label: "Post Type" (14px semibold white)
- Single-select chips:
  - 🎬 Actions | 📅 Day Summaries | All Types
- Same chip design

Section 4: **Sort Order**
- Label: "Sort By" (14px semibold white)
- Radio buttons:
  - 🕐 Most Recent
  - 🔥 Most Unique
  - 👥 Most Common
- Each row:
  - Text (16px white)
  - Radio circle (right aligned, 24px)
  - Selected: Purple fill with white checkmark
  - Unselected: Empty circle with gray border
  - Padding: 16px vertical

**Footer (Fixed at bottom):**
- Two buttons side by side
- Gap: 12px
- Padding: 16px + safe area

Button 1 (40% width):
- "Reset"
- Transparent with gray border
- Gray text
- Border radius: 16px
- Height: 52px

Button 2 (60% width):
- "Apply Filters"
- Purple gradient background
- White text
- Border radius: 16px
- Height: 52px
- Glow shadow

### Spacing
- Sections: 24px gap between each
- Chips: 8px gap between each, 16px gap between rows
- Content padding: 24px horizontal
- Section label margin: 8px bottom

### Animations
- Sheet: Slide up from bottom (400ms spring)
- Backdrop: Fade in (300ms)
- Chips: Scale to 0.95 on press
- Apply button: Pulse glow when filters changed

---

## 📱 **Screen 5: Profile / My Posts**

### Screen Name
`ProfileScreen.tsx`

### Purpose
View user's submitted posts and personal stats.

### Layout Description

**Background:**
- Space gradient (consistent)
- Stars animation

**Header:**
- Height: 200px (includes safe area)
- Background: Darker gradient overlay

Content:
- Avatar placeholder: Large circle (80px diameter)
  - Background: Purple gradient
  - Center: User initials or icon (32px white)
  - Border: 3px solid `rgba(255, 255, 255, 0.2)`
- Username: "You" (20px bold white) - below avatar
- Join date: "Member since Oct 2024" (12px gray) - below username
- Centered vertically and horizontally

**Stats Row:**
- Just below header
- Horizontal 3-column grid
- Each stat box:
  - Background: `rgba(26, 26, 46, 0.8)` glassmorphism
  - Border radius: 16px
  - Padding: 16px
  - Centered text

Stats:
1. Total Posts
   - Number: "[X]" (24px bold purple)
   - Label: "Posts" (12px gray)

2. Unique Actions
   - Number: "[X]" (24px bold blue)
   - Label: "Unique" (12px gray)

3. Avg Rank
   - Number: "Top [X]%" (24px bold pink)
   - Label: "Average" (12px gray)

**Tab Bar:**
- Below stats
- 2 tabs: "My Posts" | "Saved"
- Height: 48px
- Active tab: Bottom border (3px purple), white text
- Inactive tab: No border, gray text
- Background: Transparent
- Padding: 16px horizontal

**Posts List:**
- Vertical scrollable list
- Same card design as Feed screen but simplified
- Each card shows:
  - Date (top right, small gray text)
  - Action content (16px white)
  - Tier badge + percentile (bottom)
  - Tap to view full details

**Empty State:**
- If no posts:
  - Large icon: 📝 (48px)
  - Text: "No posts yet" (18px gray)
  - Button: "Create Your First Post ✨" (purple gradient)
  - Centered vertically

### Spacing
- Stats row: 16px horizontal padding, 12px gap between cards
- Posts list: 16px horizontal margin, 12px gap between cards
- Bottom padding: 100px (for tab bar)

---

## 📱 **Screen 6: Authentication (Email/Phone OTP)**

### Screen Name
`AuthScreen.tsx`

### Purpose
Simple authentication flow with email or phone OTP.

### Layout Description

**Background:**
- Space gradient
- Lighter star field (less distracting)

**Content (Centered vertically):**

**Logo Section:**
- App logo or icon (80px)
- "OnlyOne.Today" (28px bold white)
- Tagline: "Discover your uniqueness" (14px gray)
- Margin bottom: 48px

**Auth Card:**
- Background: `rgba(26, 26, 46, 0.9)` glassmorphism
- Border: 1px solid `rgba(139, 92, 246, 0.3)`
- Border radius: 24px
- Padding: 32px
- Max width: 90% of screen
- Shadow: Soft purple glow

Content (Step 1 - Input):
1. **Title:** "Welcome!" (24px bold white)
2. **Subtitle:** "Enter your email or phone" (14px gray)
3. **Tab selector:**
   - Two tabs: "Email" | "Phone"
   - Active: Purple background, white text
   - Inactive: Transparent, gray text
   - Border radius: 12px
   - Padding: 10px 20px
   - Margin: 16px bottom

4. **Input field:**
   - Placeholder: "you@example.com" or "+1 234 567 8900"
   - Background: `rgba(255, 255, 255, 0.05)`
   - Border: 1px solid `rgba(255, 255, 255, 0.1)`
   - Border radius: 16px
   - Padding: 16px
   - Font: 16px white
   - Height: 56px

5. **Submit button:**
   - Full width
   - Height: 56px
   - Background: Purple gradient
   - Text: "Send Code ✉️" (16px bold white)
   - Border radius: 16px
   - Margin: 24px top
   - Shadow: Purple glow

Content (Step 2 - Verify):
1. **Title:** "Enter Code" (24px bold white)
2. **Subtitle:** "We sent a code to [email/phone]" (14px gray)
3. **OTP Input:**
   - 6 separate boxes
   - Each box:
     - Size: 48px × 56px
     - Background: `rgba(255, 255, 255, 0.05)`
     - Border: 1px solid `rgba(255, 255, 255, 0.1)`
     - Border radius: 12px
     - Center aligned text (24px white)
     - Gap: 8px between boxes
   - Auto-focus and advance to next box
   - Active box: Purple border

4. **Resend link:**
   - "Didn't receive? Resend code" (14px purple, underline)
   - Center aligned
   - Margin: 16px top

5. **Verify button:**
   - Same style as submit button
   - Text: "Verify & Continue"
   - Disabled until all 6 digits entered
   - Disabled state: Gray background, no glow

**Bottom text:**
- "By continuing, you agree to our Terms & Privacy"
- 12px gray
- Center aligned
- Links: Purple color
- Margin: 24px from card

### Spacing
- Card: 24px horizontal margin
- Elements inside card: 16px vertical gaps
- OTP boxes: Horizontally centered with 8px gap

### Animations
- Transition between steps: Fade and slide (300ms)
- OTP boxes: Scale up when focused
- Button: Pulse glow when enabled

---

## 🎨 **Common Components**

### Button Styles
**Primary (Purple Gradient):**
- Background: `linear-gradient(135deg, #8b5cf6, #ec4899)`
- Text: White, bold
- Shadow: `0 4px 12px rgba(139, 92, 246, 0.4)`
- Press: Scale to 0.95

**Secondary (Outline):**
- Background: Transparent
- Border: 1px solid purple
- Text: Purple, semibold
- Press: Scale to 0.95

**Tertiary (Ghost):**
- Background: `rgba(139, 92, 246, 0.1)`
- Text: Purple, medium
- No border

### Card Styles
**Glassmorphism Card:**
- Background: `rgba(26, 26, 46, 0.85)`
- Backdrop blur: 10px
- Border: 1px solid `rgba(255, 255, 255, 0.1)`
- Border radius: 20px
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.3)`

**Elevated Card (for important info):**
- Background: `rgba(26, 26, 46, 0.95)`
- Border: 1px solid tier/accent color (opacity 0.3)
- Border radius: 20px
- Shadow: Glow effect matching border color

### Input Styles
**Text Input:**
- Background: `rgba(255, 255, 255, 0.05)`
- Border: 1px solid `rgba(255, 255, 255, 0.1)`
- Border radius: 16px
- Padding: 16px
- Font: 16px white
- Placeholder: Gray (60% opacity)
- Focus: Purple border with glow

### Loading States
**Skeleton Card:**
- Same dimensions as actual card
- Background: `rgba(255, 255, 255, 0.05)`
- Shimmer animation: Light sweep from left to right (1.5s infinite)

**Spinner:**
- Size: 24px or 32px (context dependent)
- Color: Purple or white
- Style: Circular spinner with gradient

---

## 📱 **Tab Navigation**

### Bottom Tab Bar
**Fixed at bottom:**
- Height: 64px + safe area
- Background: `rgba(10, 10, 26, 0.98)` with heavy blur
- Border top: 1px solid `rgba(255, 255, 255, 0.1)`
- Shadow: `0 -4px 16px rgba(0, 0, 0, 0.3)`

**Tabs (4 items):**
1. Home (🏠 icon)
2. Feed (🌍 icon)
3. Submit (➕ icon) - Elevated center button
4. Profile (👤 icon)

**Tab Item:**
- Icon size: 24px
- Active: Purple color (#8b5cf6)
- Inactive: Gray color (#9ca3af)
- Label: 11px, 4px below icon
- Press: Scale to 0.9

**Center Submit Button:**
- Size: 56px circle
- Background: Purple gradient
- Position: Elevated 12px above tab bar
- Icon: ➕ (white, 28px)
- Shadow: Strong purple glow
- Press: Scale to 0.9 + haptic

---

## 🎨 **Notes for Stitch AI**

1. **Consistency**: All screens use the same space gradient background and glassmorphism style.
2. **Typography**: Use Inter or system font, never custom fonts (simplicity for mobile).
3. **Spacing**: Follow 8px grid system (8, 16, 24, 32, 48).
4. **Colors**: Stick to defined color palette, use tier colors for dynamic elements.
5. **Animations**: All interactions should feel smooth and responsive (300-400ms).
6. **Safe Areas**: Always respect safe area insets (top notch, bottom home indicator).
7. **Touch Targets**: Minimum 44px for all tappable elements.
8. **Accessibility**: Ensure sufficient contrast (4.5:1 minimum for text).
9. **Loading States**: Always show skeleton/spinner during async operations.
10. **Error States**: Use subtle red tint and clear error messages.

---

**Ready to generate! Feed these descriptions to Stitch AI one screen at a time.** 🚀

