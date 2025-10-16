# OnlyOne.Today - Premium Mobile Design (Alternative Version)

**Premium Dark Variant - Luxury & Sophistication**

This is an alternative design system with a completely different aesthetic - think luxury apps like luxury car apps, premium banking apps, or high-end lifestyle apps. Modern, sophisticated, elegant.

---

## 🎨 **Premium Design System**

### Color Palette - Luxury Dark
```
Deep Black: #000000 (pure black backgrounds)
Rich Charcoal: #0f0f0f (card backgrounds)
Elegant Gray: #1a1a1a (elevated surfaces)
Premium Silver: #2a2a2a (borders, dividers)

Gold Accent: #d4af37 (primary CTA, highlights)
Rose Gold: #e0c3a5 (secondary accent)
Platinum: #e5e4e2 (premium tier indicator)
Champagne: #f7e7ce (success states)

Text Premium: #ffffff (pure white)
Text Luxury: #e5e5e5 (secondary text)
Text Muted: #a0a0a0 (tertiary text)
Text Subtle: #666666 (hints, captions)
```

### Premium Effects
- **Soft Shadows**: Subtle, elevated depth (not glows)
- **Gradient Overlays**: Linear gradients from black to transparent
- **Fine Lines**: 0.5px hairline borders in silver
- **Matte Finish**: No glossy effects, sophisticated matte
- **Subtle Animations**: Smooth, slow, elegant (500-800ms)

### Typography - Refined
- **Primary Font**: SF Pro Display / Inter (thin to bold weights)
- **Heading Weights**: 200 (ultra thin), 300 (light), 600 (semibold)
- **Letter Spacing**: +0.5px for headings (airy, premium feel)
- **Line Height**: 1.4 (generous, breathable)

### Spacing - Generous
- **Breathing Room**: 32px, 48px, 64px (not cramped)
- **Card Padding**: 32-40px (luxurious space)
- **Margins**: 24px minimum from screen edges

### Border Radius - Sharp Elegance
- **Small**: 4px (sharp, precise)
- **Medium**: 8px (refined curves)
- **Large**: 12px (subtle rounding)
- **No full pills** - sharp sophistication

---

## 📱 **Screen 1: Home / Submit Action (Premium)**

### Screen Name
`HomeScreenPremium.tsx`

### Design Philosophy
Minimalist luxury - like a premium watch interface or luxury car dashboard. Clean, precise, sophisticated.

### Layout Description

**Background:**
- Pure black (#000000)
- Subtle noise texture overlay (5% opacity) for depth
- No animated stars - static elegance
- Optional: Very subtle vertical gradient from #000000 to #0a0a0a

**Status Bar:**
- Light content
- Pure white icons

**Top Section (Header - Minimal):**
- Position: 64px from top (+ safe area)
- Logo/Wordmark: "ONLYONE" in ultra-thin weight (100-200)
  - Font size: 14px
  - Letter spacing: +3px (wide, airy)
  - Color: Gold (#d4af37)
  - All caps
- Tagline: "Curated Uniqueness" below logo
  - Font size: 10px
  - Letter spacing: +1px
  - Color: Muted silver (#a0a0a0)
  - All caps
- Centered horizontally
- Minimal, like luxury brand header

**Stats Module (Refined):**
- Position: Below header, 48px margin top
- Container:
  - Width: Screen width - 48px (24px margins)
  - Height: 80px
  - Background: `rgba(15, 15, 15, 0.6)` (dark translucent)
  - Border: 0.5px solid `rgba(212, 175, 55, 0.2)` (subtle gold hairline)
  - Border radius: 8px
  - Backdrop blur: 20px (frosted glass effect)
  
Stats Layout (horizontal):
- Two columns, equal width
- Vertical divider: 0.5px gold line (50% opacity)

Left Stat:
- Number: "[X]" (28px, thin weight 200, white)
- Label: "CONTRIBUTIONS TODAY" (9px, letter-spacing +1px, muted, uppercase)
- Centered in column

Right Stat:
- Number: "[X]" (28px, thin weight 200, white)
- Label: "UNIQUE MOMENTS" (9px, letter-spacing +1px, muted, uppercase)
- Centered in column

**Main Input Section (Hero):**
- Position: 48px below stats
- Container:
  - Width: Screen width - 48px
  - Background: #0f0f0f (rich charcoal)
  - Border: 0.5px solid #2a2a2a (premium silver)
  - Border radius: 12px
  - Padding: 40px
  - Subtle shadow: `0 8px 32px rgba(0, 0, 0, 0.6)`

Content:
1. **Title:**
   - "Your Moment" (24px, light weight 300, white)
   - Letter spacing: +0.5px
   - Margin bottom: 8px

2. **Subtitle:**
   - "What defined your day?" (13px, muted #a0a0a0)
   - Margin bottom: 32px

3. **Input Type Selector (Minimalist Toggle):**
   - Not tabs - segmented control style
   - Container: 
     - Height: 40px
     - Background: #000000
     - Border: 0.5px solid #2a2a2a
     - Border radius: 8px
     - Padding: 2px
   - Two segments: "Action" | "Summary"
   - Selected segment:
     - Background: Linear gradient (gold to rose gold)
     - Text: Black (bold contrast)
     - Font: 13px, medium weight 500
     - Border radius: 6px
   - Unselected segment:
     - Background: Transparent
     - Text: #a0a0a0
     - Font: 13px, light weight 300

4. **Text Input (Luxury Field):**
   - Margin top: 24px
   - Multiline text area
   - Background: #000000
   - Border: None initially
   - Focus border: 0.5px solid gold
   - Border radius: 8px
   - Padding: 20px
   - Text:
     - Font: 16px, light weight 300
     - Color: White
     - Line height: 1.5
     - Placeholder: "I discovered a hidden rooftop..." (elegant example)
     - Placeholder color: #666666
   - Min height: 140px
   - Auto-resize
   - Character counter:
     - Position: Bottom right, inside field
     - Text: "[X]/500" (10px, #666666)

5. **Scope Selector (Premium Pills):**
   - Label: "COMPARE WITHIN" (9px, uppercase, #a0a0a0, letter-spacing +1px)
   - Margin: 32px top, 12px bottom
   - Pills: Horizontal scroll if needed
     - Style: Minimalist outline
     - Unselected:
       - Background: Transparent
       - Border: 0.5px solid #2a2a2a
       - Text: #a0a0a0, 12px, light
       - Padding: 10px 20px
       - Border radius: 6px
     - Selected:
       - Background: Gold (#d4af37)
       - Border: None
       - Text: Black, 12px, semibold
       - Padding: 10px 20px
       - Border radius: 6px
   - Options: "Worldwide" | "Country" | "State" | "City"
   - Gap: 12px between pills

6. **Submit Button (Premium CTA):**
   - Margin top: 32px
   - Full width
   - Height: 56px
   - Background: Linear gradient (135deg, #d4af37 0%, #e0c3a5 100%)
   - Text: "Discover Uniqueness" (14px, semibold 600, black, letter-spacing +1px)
   - Border radius: 8px
   - Shadow: `0 4px 24px rgba(212, 175, 55, 0.3)`
   - Press animation: Scale to 0.98, slight brightness increase

**Bottom Area:**
- Safe area padding
- Small text: "© 2024 OnlyOne" (9px, #666666, centered)

### Spacing
- All margins: 24px or 48px (generous)
- Section gaps: 48px
- Inner element gaps: 24px or 32px

### Animations
- All transitions: 500ms cubic-bezier(0.4, 0, 0.2, 1)
- Button hover: Subtle brightness increase
- Focus states: Smooth border fade-in
- No bounce, no elastic - smooth linear elegance

---

## 📱 **Screen 2: Response / Percentile (Premium)**

### Screen Name
`ResponseScreenPremium.tsx`

### Design Philosophy
Like opening a luxury product box - reveal the value with sophistication.

### Layout Description

**Background:**
- Pure black #000000
- Subtle noise texture (5% opacity)
- If elite tier: Very subtle gold radial gradient from center (opacity 3%)

**Top Bar (Minimal):**
- Height: 64px + safe area
- Background: Transparent
- Back button: Left, simple "<" arrow (white, 24px)
- Share button: Right, simple share icon (white, 24px)
- No background, floating buttons

**Hero Section (Centerpiece):**
- Position: Centered vertically in upper 40% of screen
- Design: Minimalist ranking display

**Ranking Display (Not circular - Linear):**
Container:
- Width: Screen width - 64px (32px margins)
- Height: Auto
- Background: #0f0f0f
- Border: 0.5px solid based on tier
  - Elite: Gold (#d4af37)
  - Rare: Platinum (#e5e4e2)
  - Unique: Rose gold (#e0c3a5)
  - Notable: Silver (#a0a0a0)
  - Common: Dark gray (#3a3a3a)
- Border radius: 12px
- Padding: 48px 32px
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.6)`

Content (vertical stack, centered):
1. **Tier Badge (Top):**
   - Small text: "PERCENTILE" (9px, uppercase, muted, letter-spacing +1px)
   - Margin bottom: 16px

2. **Ranking Number (Hero):**
   - Text: "TOP [X]%" (72px, ultra-thin weight 100, tier color)
   - Letter spacing: -2px (tight, impactful)
   - Line height: 1
   - Margin bottom: 8px

3. **Tier Name:**
   - Text: "[Elite/Rare/Unique]" (16px, light 300, white, uppercase)
   - Letter spacing: +2px
   - Margin bottom: 32px

4. **Horizontal Progress Bar:**
   - Width: 100%
   - Height: 2px (very thin, elegant)
   - Background: #2a2a2a
   - Fill: Linear gradient of tier color
   - Fill width: [percentile]%
   - Animated fill on load (1.5s smooth)

5. **Context Text:**
   - Margin top: 32px
   - Text: "You're more unique than [X]% of people [scope]"
   - Font: 13px, light 300, #a0a0a0
   - Centered

**Content Card (Below Hero):**
- Margin top: 48px
- Container:
  - Width: Screen width - 64px
  - Background: #000000
  - Border: 0.5px solid #2a2a2a
  - Border radius: 12px
  - Padding: 32px

Content:
1. **Label:** "YOUR MOMENT" (9px, uppercase, muted, letter-spacing +1px)
2. **Quote:** (Margin top: 16px)
   - Text: User's content (18px, light 300, white, line height 1.6)
   - Not italic - clean sans-serif
3. **Metadata:** (Margin top: 24px)
   - Small pills with icons
   - Background: #0f0f0f
   - Border radius: 4px
   - Padding: 8px 12px
   - Font: 10px, #a0a0a0
   - Icons: Minimal line icons
   - Examples: "🌍 Worldwide" | "📊 [X] of [Y]"

**Stats Grid (Below Content):**
- Margin top: 32px
- Grid: 2 columns, equal width, 16px gap

Each stat card:
- Background: #0f0f0f
- Border: 0.5px solid #2a2a2a
- Border radius: 8px
- Padding: 24px
- Centered content

Left Card:
- Label: "RANKING" (9px, uppercase, muted)
- Value: "Top [X]%" (28px, thin 200, tier color)
- Bar: 2px height progress bar below

Right Card:
- Label: "RARITY" (9px, uppercase, muted)
- Value: "[X] of [Y]" (28px, thin 200, tier color)
- Bar: 2px height progress bar below

**Actions (Bottom):**
- Fixed at bottom
- Safe area padding + 24px
- Two buttons:

Primary Button (70% width):
- Height: 56px
- Background: Gold gradient
- Text: "Share Achievement" (14px, semibold, black)
- Border radius: 8px
- Shadow: Gold glow

Secondary Button (30% width):
- Height: 56px
- Background: Transparent
- Border: 0.5px solid #2a2a2a
- Text: "Explore" (14px, light, white)
- Border radius: 8px

### Spacing
- Large gaps: 48px, 64px
- Card padding: 32px, 48px
- Inner gaps: 16px, 24px

### Animations
- Number count-up: Smooth ease-out over 1.5s
- Progress bar fill: Smooth 1.5s
- Card entrance: Fade up (staggered, 100ms delay)
- All transitions: 500-800ms (slower, more premium feel)

---

## 📱 **Screen 3: Feed / Global Posts (Premium)**

### Screen Name
`FeedScreenPremium.tsx`

### Design Philosophy
Like browsing a luxury magazine or curated gallery. Clean, spacious, elegant.

### Layout Description

**Background:**
- Pure black #000000
- Static, no animation

**Top Bar (Fixed, Premium):**
- Height: 96px + safe area (taller, more spacious)
- Background: #000000 with bottom border (0.5px solid #2a2a2a)
- Blur: None (solid for premium feel)

Content:
- Title: "FEED" (12px, uppercase, gold, letter-spacing +2px)
  - Position: Top left, 24px from edges
- Subtitle: "[X] Moments Shared Today" (10px, #666666)
  - Below title, 4px gap
- Filter icon: Top right (simple line icon, white)

**Filter Bar (Below header):**
- Height: 56px
- Background: #000000
- Horizontal scroll
- Pills:
  - Style: Minimalist
  - Selected: Gold background, black text, 11px semibold
  - Unselected: Transparent, 0.5px border #2a2a2a, white text, 11px light
  - Border radius: 6px
  - Padding: 10px 16px
  - Gap: 12px
- Options: "All" | "Elite" | "Rare" | "Unique" | "Recent"

**Posts List (Scrollable):**
- Padding: 24px horizontal
- Gap between posts: 32px (generous)

**Post Card (Premium Design):**
Each card:
- Width: Full width - 48px
- Background: #0f0f0f
- Border: 0.5px solid based on tier
  - Elite: Gold
  - Rare: Platinum
  - Others: #2a2a2a
- Border radius: 8px
- Padding: 32px
- Shadow: `0 4px 16px rgba(0, 0, 0, 0.4)`

Card Content (top to bottom):

1. **Header Row:**
   - Tier badge (left):
     - Small capsule: "TOP [X]%" or "[TIER NAME]"
     - Background: Tier color with 10% opacity
     - Text: Tier color, 9px, uppercase, semibold
     - Border radius: 4px
     - Padding: 6px 10px
   - Time (right):
     - Text: "[X]h ago" (10px, #666666)

2. **Content (Main):**
   - Margin top: 20px
   - Text: User's action (16px, light 300, white)
   - Line height: 1.5
   - Max lines: 4, then "..." with inline "more" link (gold color)

3. **Metadata Row:**
   - Margin top: 24px
   - Horizontal pills
   - Background: #000000
   - Border radius: 4px
   - Padding: 8px 12px
   - Font: 10px, #a0a0a0
   - Gap: 12px
   - Examples:
     - "[X] of [Y] people"
     - "🌍 Worldwide"
     - "Action"

4. **Interaction Row (Subtle):**
   - Margin top: 20px
   - Border top: 0.5px solid #2a2a2a
   - Padding top: 16px
   - Share button: Right aligned
     - Icon: Simple share icon (white, 16px)
     - Text: "Share" (10px, #a0a0a0)
     - Inline, gap 6px

### Empty State
- Centered vertically
- Icon: Simple line art (48px, #666666)
- Text: "No moments yet" (16px, #a0a0a0)
- Subtext: "Be the first to share" (12px, #666666)
- CTA Button: Gold gradient, "Create Moment"

### Pull to Refresh
- Indicator: Simple gold ring spinner (24px)
- No text, just elegant loader
- Smooth elastic animation

### Spacing
- Cards: 32px gap between
- Card padding: 32px
- Section gaps: 24px
- Margins from edge: 24px

---

## 📱 **Screen 4: Profile / My Posts (Premium)**

### Screen Name
`ProfileScreenPremium.tsx`

### Design Philosophy
Elegant portfolio showcase - like a luxury brand's "My Collection" section.

### Layout Description

**Background:**
- Pure black #000000
- Static

**Header (Spacious):**
- Height: 240px (includes safe area)
- Background: Linear gradient (#000000 to #0a0a0a)
- No avatar - minimalist

Content (centered):
1. **Profile Icon (Optional):**
   - Simple thin ring (80px diameter, 0.5px gold)
   - Center: Initials or icon (24px, white, light weight)
   
2. **Name/Title:**
   - Margin top: 20px
   - Text: "YOU" (14px, uppercase, gold, letter-spacing +2px)

3. **Member Since:**
   - Margin top: 8px
   - Text: "Member since Oct 2024" (10px, #666666)

**Stats Row (Below Header):**
- Position: Below header
- Background: #0f0f0f
- Height: 96px
- Border top & bottom: 0.5px solid #2a2a2a

Content: 3 equal columns

Each stat:
- Number: "[X]" (24px, thin 200, white)
- Label: "POSTS" / "UNIQUE" / "AVG RANK" (9px, uppercase, #a0a0a0, letter-spacing +1px)
- Vertical dividers: 0.5px solid #2a2a2a

**Tab Bar:**
- Height: 56px
- Background: #000000
- Border bottom: 0.5px solid #2a2a2a
- Tabs: "Moments" | "Saved"
- Style:
  - Active: Gold text, 2px gold bottom border
  - Inactive: #a0a0a0 text, no border
  - Font: 12px, uppercase, letter-spacing +1px
- Padding: 24px horizontal

**Posts List:**
- Padding: 24px
- Gap: 24px
- Each post: Simplified card (smaller than feed cards)

Simplified Post Card:
- Background: #0f0f0f
- Border: 0.5px solid #2a2a2a
- Border radius: 8px
- Padding: 24px

Content:
- Date: Top right (10px, #666666)
- Content: User's text (14px, light, white, 2 lines max)
- Tier badge: Bottom left (small gold badge)
- Chevron: Bottom right (simple ">" icon, #666666)

### Empty State
- Icon: Simple outline (32px, #666666)
- Text: "No moments yet" (14px, #a0a0a0)
- Button: "Create First Moment" (gold gradient)

---

## 📱 **Screen 5: Filter Sheet (Premium Modal)**

### Screen Name
`FilterSheetPremium.tsx`

### Design Philosophy
Refined control panel - like luxury car settings or high-end audio equalizer.

### Layout Description

**Presentation:**
- Slides up from bottom
- Height: 70% of screen
- Background: #0f0f0f
- Top border radius: 12px
- No rounded handle - clean edge
- Backdrop: `rgba(0, 0, 0, 0.8)` (darker, more premium)

**Handle/Indicator:**
- Top center
- Horizontal line: 32px width, 2px height
- Color: #2a2a2a
- Margin: 16px from top

**Header:**
- Height: 72px
- Padding: 24px horizontal
- Border bottom: 0.5px solid #2a2a2a

Content:
- Title: "FILTERS" (12px, uppercase, white, letter-spacing +2px)
- Close: "Done" text button (right, 12px, gold)

**Content (Scrollable):**
Padding: 24px

**Section 1: Tier Selection**
- Label: "UNIQUENESS TIER" (9px, uppercase, #666666, letter-spacing +1px)
- Margin bottom: 16px

Chips (multi-select):
- Style: Minimal outline
- Unselected:
  - Background: #000000
  - Border: 0.5px solid #2a2a2a
  - Text: #a0a0a0, 11px, light
  - Padding: 10px 16px
  - Border radius: 6px
- Selected:
  - Background: Gold (#d4af37)
  - Border: None
  - Text: Black, 11px, semibold
- Options: "Elite" | "Rare" | "Unique" | "Notable" | "Common" | "Popular"
- Wrap to multiple rows
- Gap: 12px

**Section 2: Scope** (Same style as Tier)
- Label: "LOCATION SCOPE"
- Options: "Worldwide" | "Country" | "State" | "City"

**Section 3: Post Type** (Same style)
- Label: "CONTENT TYPE"
- Options: "Actions" | "Day Summaries" | "All"

**Section 4: Sort** (Different style - list)
- Label: "SORT BY"
- Margin top: 32px

Radio list items:
- Each row: 56px height
- Background: Transparent
- Border: None
- Bottom border: 0.5px solid #2a2a2a (between items)
- Padding: 16px 0

Content:
- Text: "Most Recent" / "Most Unique" / "Most Common"
- Font: 14px, light 300, white
- Radio indicator (right):
  - Unselected: Empty circle (20px, 0.5px border #2a2a2a)
  - Selected: Filled circle (20px, gold background, white checkmark 10px)

**Footer (Fixed):**
- Height: 88px (includes safe area)
- Background: #0f0f0f
- Border top: 0.5px solid #2a2a2a
- Padding: 16px 24px + safe area

Two buttons:
- Reset (left, 35% width):
  - Height: 52px
  - Background: Transparent
  - Border: 0.5px solid #2a2a2a
  - Text: "Reset" (12px, uppercase, #a0a0a0, letter-spacing +1px)
  - Border radius: 8px

- Apply (right, 65% width):
  - Height: 52px
  - Background: Gold gradient
  - Text: "Apply Filters" (12px, uppercase, black, semibold, letter-spacing +1px)
  - Border radius: 8px
  - Shadow: Gold glow

### Spacing
- Sections: 40px gap
- Chips: 12px gap
- List items: 0px gap (borders separate)

### Animations
- Sheet slide up: 400ms cubic-bezier(0.4, 0, 0.2, 1)
- Backdrop fade: 300ms
- Button press: Scale 0.98

---

## 📱 **Screen 6: Authentication (Premium)**

### Screen Name
`AuthScreenPremium.tsx`

### Design Philosophy
Exclusive entry - like logging into a private members club.

### Layout Description

**Background:**
- Pure black #000000
- Subtle noise texture

**Content (Centered):**

**Logo Section:**
- App wordmark: "ONLYONE" (18px, ultra-thin 100, gold, letter-spacing +4px)
- Tagline: "Curated Uniqueness" (10px, #666666, letter-spacing +1px)
- Margin bottom: 64px

**Auth Card:**
- Width: Screen width - 64px
- Background: #0f0f0f
- Border: 0.5px solid #2a2a2a
- Border radius: 12px
- Padding: 48px 32px

**Step 1 - Input:**

1. **Title:**
   - "Welcome" (24px, light 300, white)
   - Margin bottom: 8px

2. **Subtitle:**
   - "Enter your credentials" (12px, #a0a0a0)
   - Margin bottom: 32px

3. **Method Selector:**
   - Segmented control (like home screen)
   - Options: "Email" | "Phone"
   - Height: 40px
   - Selected: Gold background, black text
   - Unselected: Transparent, #a0a0a0 text

4. **Input Field:**
   - Margin top: 32px
   - Background: #000000
   - Border: 0.5px solid #2a2a2a
   - Focus border: 0.5px solid gold
   - Border radius: 8px
   - Padding: 20px
   - Font: 14px, light 300, white
   - Placeholder: "you@domain.com" (color: #666666)
   - Height: 56px

5. **Submit Button:**
   - Margin top: 32px
   - Full width
   - Height: 56px
   - Background: Gold gradient
   - Text: "Continue" (12px, uppercase, black, semibold, letter-spacing +1px)
   - Border radius: 8px

**Step 2 - OTP:**

1. **Title:**
   - "Verification Code" (24px, light 300, white)
   
2. **Subtitle:**
   - "Enter code sent to [email/phone]" (12px, #a0a0a0)
   - Margin bottom: 40px

3. **OTP Input:**
   - 6 boxes
   - Each box:
     - Size: 48px × 56px
     - Background: #000000
     - Border: 0.5px solid #2a2a2a
     - Focus border: 0.5px solid gold
     - Border radius: 8px
     - Text: 24px, semibold, white, centered
     - Gap: 12px
   - Horizontal centered

4. **Resend:**
   - Margin top: 24px
   - Text: "Resend code" (11px, gold, centered)
   - Underline on press

5. **Verify Button:**
   - Same style as submit button
   - Text: "Verify"
   - Disabled: Background #2a2a2a, text #666666

**Footer:**
- Margin top: 32px
- Text: "By continuing, you agree to our Terms & Privacy"
- Font: 10px, #666666, centered
- Links: Gold color, no underline

### Spacing
- Card: 32px padding
- Elements: 24px, 32px gaps
- Generous vertical space

### Animations
- Transition between steps: 500ms fade + slide
- OTP boxes: Scale up on focus
- Button: Brightness increase on press
- All smooth, elegant

---

## 🎨 **Premium Common Components**

### Button Styles

**Primary (Gold Gradient):**
```
Background: linear-gradient(135deg, #d4af37, #e0c3a5)
Text: Black, 12px, semibold, uppercase, letter-spacing +1px
Border radius: 8px
Shadow: 0 4px 24px rgba(212, 175, 55, 0.3)
Press: Scale 0.98, brightness 110%
Height: 52px or 56px
```

**Secondary (Outline):**
```
Background: Transparent
Border: 0.5px solid #2a2a2a
Text: White, 12px, light, uppercase
Border radius: 8px
Press: Border color to gold, scale 0.98
```

**Tertiary (Ghost):**
```
Background: rgba(212, 175, 55, 0.05)
Text: Gold, 12px, light
No border
Press: Background opacity increase
```

### Card Styles

**Premium Card:**
```
Background: #0f0f0f
Border: 0.5px solid #2a2a2a
Border radius: 8px or 12px
Padding: 32px or 48px
Shadow: 0 8px 32px rgba(0, 0, 0, 0.6)
```

**Elevated Card (important content):**
```
Background: #1a1a1a
Border: 0.5px solid [tier color]
Border radius: 12px
Padding: 48px
Shadow: 0 12px 48px rgba(0, 0, 0, 0.8)
```

### Input Styles

**Text Input:**
```
Background: #000000
Border: 0.5px solid #2a2a2a
Focus border: 0.5px solid #d4af37
Border radius: 8px
Padding: 20px
Font: 14-16px, light weight 300, white
Placeholder: #666666
```

### Loading States

**Skeleton:**
```
Background: #0f0f0f
Shimmer: Linear gradient sweep (gold tint)
Animation: 1.5s ease-in-out infinite
Border: 0.5px solid #2a2a2a
```

**Spinner:**
```
Style: Thin ring (2px stroke)
Color: Gold gradient
Size: 24px or 32px
Rotation: Smooth 1s linear infinite
```

---

## 📱 **Premium Tab Navigation**

### Bottom Tab Bar

**Fixed at bottom:**
```
Height: 72px + safe area (taller, more premium)
Background: #0f0f0f
Border top: 0.5px solid #2a2a2a
Shadow: 0 -4px 24px rgba(0, 0, 0, 0.8)
```

**Tabs (4 items):**
- Icons: Simple line icons (20px)
- Labels: 9px, uppercase, letter-spacing +1px
- Active: Gold color (#d4af37)
- Inactive: #666666
- Press: Scale 0.95

**Center FAB (Elevated):**
- Size: 56px circle
- Position: 12px above tab bar
- Background: Gold gradient
- Icon: Plus (24px, black)
- Shadow: Strong gold glow
- Press: Scale 0.95

---

## 🎨 **Key Differences from Original**

### Original (Space/Glassmorphism)
- Purple/pink theme
- Rounded corners (16-24px)
- Glassmorphism effects
- Playful animations
- Colorful accents

### Premium (Luxury/Minimal)
- Gold/platinum theme
- Sharp corners (4-12px)
- Matte solid surfaces
- Subtle slow animations
- Monochromatic with gold accents
- More whitespace
- Thinner fonts
- Hairline borders (0.5px)
- No emojis in UI
- Uppercase labels
- Generous letter-spacing

---

## 📋 **Implementation Notes**

### Fonts
Use system fonts with thin weights:
- iOS: SF Pro Display (weights 100-600)
- Android: Roboto Thin / Light (weights 100-300)

### Borders
Use 0.5px for hairline borders (iOS renders perfectly, Android approximates)

### Colors
Gold must be elegant (#d4af37) not bright yellow
Black must be pure (#000000) not dark gray

### Animations
Slower = more premium (500-800ms vs 300ms)
Use cubic-bezier for smooth easing

### Touch Targets
Still 44px minimum, use padding to extend touch area beyond visual element

---

**This premium variant is ready for Stitch AI generation!** 🏆

Feed it these descriptions to create a completely different, luxury-focused mobile app.

