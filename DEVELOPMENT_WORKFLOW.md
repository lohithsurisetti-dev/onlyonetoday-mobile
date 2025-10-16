# 🚀 Development Workflow - From Design to React Native

This guide shows you how to use the HTML prototypes and PNG screenshots to build the React Native mobile app.

---

## 📂 **What We Have**

### Design Resources
```
mobile/
├── STITCH_AI_SCREENS.md           # Detailed text descriptions (Original theme)
├── STITCH_AI_SCREENS_PREMIUM.md   # Detailed text descriptions (Premium theme)
└── screen_designs/                 # Working prototypes
    ├── feed/
    │   ├── code.html              # Working HTML/CSS implementation
    │   └── screen.png             # Screenshot
    ├── filter/
    │   ├── code.html
    │   └── screen.png
    ├── postCreationScreen/
    │   ├── code.html
    │   └── screen.png
    ├── profile/
    │   ├── code.html
    │   └── screen.png
    └── response/
        ├── code.html
        └── screen.png
```

### Code Foundation
```
src/
├── features/          # Feature modules (posts API ready!)
├── shared/           # Shared components (empty - to be built)
├── services/         # API client configured
├── config/           # Theme config with colors
└── lib/              # React Query configured
```

---

## 🎯 **Development Approach**

### **Phase 1: Build Shared UI Components First** ⭐ START HERE

Extract reusable components from HTML and build them in React Native.

#### **1.1 Button Component**

**Reference:** Look at `screen_designs/postCreationScreen/code.html` line 102-104

```html
<button class="w-full mt-4 bg-gradient-to-r from-[#8A2BE2] to-[#4A00E0] 
               text-white font-bold py-4 px-4 rounded-lg glowing-button">
    Discover My Uniqueness ✨
</button>
```

**Create:** `src/shared/components/ui/Button.tsx`

```typescript
import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface ButtonProps {
  onPress: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

export default function Button({ 
  onPress, 
  children, 
  variant = 'primary',
  disabled = false,
  loading = false,
  style 
}: ButtonProps) {
  
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.container, style]}
      >
        <LinearGradient
          colors={['#8A2BE2', '#4A00E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.primaryText}>{children}</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }
  
  // Add secondary and ghost variants...
  
  return null
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})
```

---

#### **1.2 Card Component (Glassmorphism)**

**Reference:** `screen_designs/feed/code.html` line 92-108

```html
<div class="p-4 rounded-xl glassmorphism border-l-4 border-tier-legendary">
  <!-- Card content -->
</div>
```

**CSS from HTML:**
```css
.glassmorphism {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Create:** `src/shared/components/ui/Card.tsx`

```typescript
import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { BlurView } from 'expo-blur'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  borderColor?: string
  borderWidth?: number
}

export default function Card({ 
  children, 
  style, 
  borderColor,
  borderWidth = 0 
}: CardProps) {
  return (
    <BlurView intensity={20} tint="dark" style={[styles.container, style]}>
      <View 
        style={[
          styles.innerContainer,
          borderColor && borderWidth && {
            borderLeftWidth: borderWidth,
            borderLeftColor: borderColor,
          }
        ]}
      >
        {children}
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  innerContainer: {
    padding: 16,
  },
})
```

---

#### **1.3 Input Component**

**Reference:** `screen_designs/postCreationScreen/code.html` line 93-95

```html
<textarea class="w-full bg-black/20 text-white placeholder-gray-400 
                 border border-white/20 rounded-lg p-4 h-32 resize-none 
                 focus:outline-none focus:ring-2 focus:ring-primary/50" 
          placeholder="Ate breakfast on a hot air balloon...">
</textarea>
```

**Create:** `src/shared/components/ui/Input.tsx`

```typescript
import React from 'react'
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  maxLength?: number
  showCharCount?: boolean
}

export default function Input({ 
  label, 
  error, 
  maxLength,
  showCharCount = false,
  value,
  style,
  ...props 
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#666666"
        value={value}
        maxLength={maxLength}
        {...props}
      />
      
      <View style={styles.footer}>
        {error && <Text style={styles.error}>{error}</Text>}
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 120,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
  },
  charCount: {
    color: '#666666',
    fontSize: 12,
  },
})
```

---

### **Phase 2: Build Screens Using Components**

#### **2.1 Home Screen**

**Reference Files:**
- `screen_designs/postCreationScreen/code.html`
- `screen_designs/postCreationScreen/screen.png`
- `STITCH_AI_SCREENS.md` lines 73-217 (detailed specs)

**Create:** `src/features/posts/screens/HomeScreen.tsx`

```typescript
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@shared/components/ui/Button'
import Input from '@shared/components/ui/Input'
import Card from '@shared/components/ui/Card'
import { useCreatePost } from '../hooks/usePosts'

export default function HomeScreen() {
  const [content, setContent] = useState('')
  const [inputType, setInputType] = useState<'action' | 'day'>('action')
  const [scope, setScope] = useState<'city' | 'state' | 'country' | 'world'>('world')
  
  const { mutate: createPost, isPending } = useCreatePost()

  const handleSubmit = () => {
    createPost({
      content,
      inputType,
      scope,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>OnlyOne.Today</Text>
          <Text style={styles.subtitle}>Record. Compare. Discover.</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Posts Today</Text>
            <Text style={styles.statValue}>1,234</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Unique Actions</Text>
            <Text style={styles.statValue}>567</Text>
          </Card>
        </View>

        {/* Main Input Card */}
        <Card style={styles.mainCard}>
          <Text style={styles.cardTitle}>What did YOU do today?</Text>
          
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            {/* Add tab buttons here */}
          </View>

          {/* Text Input */}
          <Input
            value={content}
            onChangeText={setContent}
            placeholder="Ate breakfast on a hot air balloon..."
            multiline
            maxLength={500}
            showCharCount
          />

          {/* Scope Selector */}
          <View style={styles.scopeSelector}>
            {/* Add scope buttons here */}
          </View>

          {/* Submit Button */}
          <Button onPress={handleSubmit} loading={isPending}>
            Discover My Uniqueness ✨
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0C1D',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  mainCard: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  typeSelector: {
    // Add styles
  },
  scopeSelector: {
    marginVertical: 24,
  },
})
```

---

#### **2.2 Response Screen**

**Reference Files:**
- `screen_designs/response/code.html`
- `screen_designs/response/screen.png`
- `STITCH_AI_SCREENS.md` lines 219-361

**Key Elements to Extract:**

1. **Circular Progress Ring** (lines 111-114)
```html
<svg class="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
  <circle cx="110" cy="110" fill="transparent" r="100" 
          stroke="rgba(255, 255, 255, 0.1)" stroke-width="15">
  </circle>
  <circle class="animated-ring text-tier-legendary" 
          cx="110" cy="110" fill="transparent" r="100" 
          stroke="currentColor" stroke-width="15">
  </circle>
</svg>
```

**Create:** `src/features/posts/components/PercentileRing.tsx`

```typescript
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface PercentileRingProps {
  percentile: number
  tier: string
  tierColor: string
}

export default function PercentileRing({ 
  percentile, 
  tier, 
  tierColor 
}: PercentileRingProps) {
  const progress = useSharedValue(0)
  const radius = 100
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    progress.value = withTiming(percentile / 100, { duration: 1500 })
  }, [percentile])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }))

  return (
    <View style={styles.container}>
      <Svg width={220} height={220} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={110}
          cy={110}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={15}
          fill="transparent"
        />
        
        {/* Animated progress circle */}
        <AnimatedCircle
          cx={110}
          cy={110}
          r={radius}
          stroke={tierColor}
          strokeWidth={15}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin="110, 110"
        />
      </Svg>
      
      {/* Center text */}
      <View style={styles.centerContent}>
        <Text style={[styles.percentileText, { color: tierColor }]}>
          Top {percentile}%
        </Text>
        <Text style={[styles.tierText, { color: tierColor }]}>
          {tier}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
  },
  percentileText: {
    fontSize: 36,
    fontWeight: '700',
  },
  tierText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
})
```

---

#### **2.3 Feed Screen**

**Reference Files:**
- `screen_designs/feed/code.html`
- `screen_designs/feed/screen.png`

**Create:** `src/features/feed/components/PostCard.tsx`

Extract the card structure from HTML lines 92-108 and create a React Native component.

---

### **Phase 3: Color Mapping from HTML to React Native**

**HTML Tailwind Colors → React Native:**

```typescript
// src/config/colors.ts

export const colors = {
  // From HTML: background-dark: "#0D0C1D"
  backgroundDark: '#0D0C1D',
  
  // From HTML: primary: "#8347eb"
  primary: '#8347eb',
  
  // Tier colors from HTML
  tiers: {
    legendary: '#FFD700',  // tier-legendary
    epic: '#9400D3',       // tier-epic
    rare: '#0070DD',       // tier-rare
    uncommon: '#1E8449',   // tier-uncommon
    common: '#979797',     // tier-common
  },
  
  // Glass effect
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    muted: '#666666',
  },
}
```

---

### **Phase 4: Animation Patterns from HTML**

**HTML CSS Animation → React Native Reanimated:**

```css
/* HTML: Fade in up animation */
@keyframes fadeInUp {
    '0%': { opacity: '0', transform: 'translateY(20px)' }
    '100%': { opacity: '1', transform: 'translateY(0)' }
}
```

**React Native:**
```typescript
import { useEffect } from 'react'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated'

function FadeInView({ children, delay = 0 }) {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000, delay })
    translateY.value = withTiming(0, { duration: 1000, delay })
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  )
}
```

---

## 🛠️ **Development Steps**

### **Step 1: Install Additional Dependencies**
```bash
cd mobile
npm install expo-linear-gradient expo-blur react-native-svg react-native-reanimated
```

### **Step 2: Build Components (Order Matters!)**
1. ✅ Button
2. ✅ Card (with glassmorphism)
3. ✅ Input
4. ✅ Badge/Pill (for tiers)
5. ✅ Loading Spinner
6. ✅ Modal/Sheet

### **Step 3: Build Screens**
1. ✅ Home Screen (simplest)
2. ✅ Response Screen (needs PercentileRing)
3. ✅ Feed Screen (needs PostCard)
4. ✅ Profile Screen
5. ✅ Filter Modal

### **Step 4: Connect to APIs**
Use the existing hooks:
```typescript
import { usePosts, useCreatePost } from '@features/posts/hooks/usePosts'
```

### **Step 5: Test on Device**
```bash
npm run dev
# Scan QR with Expo Go app
```

---

## 📋 **Quick Reference: HTML → React Native**

### **Layout Conversion**

| HTML/Tailwind | React Native |
|---------------|--------------|
| `flex flex-col` | `flexDirection: 'column'` |
| `justify-between` | `justifyContent: 'space-between'` |
| `items-center` | `alignItems: 'center'` |
| `p-4` | `padding: 16` |
| `mt-6` | `marginTop: 24` |
| `rounded-xl` | `borderRadius: 16` |
| `w-full` | `width: '100%'` |

### **Color Conversion**

| HTML/Tailwind | React Native |
|---------------|--------------|
| `bg-white/10` | `backgroundColor: 'rgba(255,255,255,0.1)'` |
| `text-gray-400` | `color: '#9ca3af'` |
| `border-white/20` | `borderColor: 'rgba(255,255,255,0.2)'` |

### **Typography Conversion**

| HTML/Tailwind | React Native |
|---------------|--------------|
| `text-xl font-bold` | `fontSize: 20, fontWeight: '700'` |
| `text-sm font-medium` | `fontSize: 14, fontWeight: '500'` |
| `leading-tight` | `lineHeight: 1.2 * fontSize` |

---

## 🎯 **Pro Tips**

### **1. Use HTML as Blueprint**
- Copy HTML structure first
- Map HTML classes to StyleSheet
- Extract colors, spacing, typography

### **2. View Screenshots Side-by-Side**
- Keep PNG open while coding
- Match visual spacing exactly
- Check alignment and proportions

### **3. Extract Reusable Patterns**
```typescript
// HTML has repeated card structure → Create Card component
// HTML has repeated pills → Create Badge component
// HTML has repeated buttons → Create Button variants
```

### **4. Use Theme Config**
Instead of hardcoding colors, use your theme:
```typescript
import { colors } from '@config/theme.config'

style={{ backgroundColor: colors.backgroundDark }}
```

### **5. Test Incrementally**
- Build one component → Test
- Add to screen → Test
- Don't build everything then test!

---

## ✅ **Checklist**

### Components
- [ ] Button (primary, secondary, ghost)
- [ ] Card (glassmorphism)
- [ ] Input (text, multiline)
- [ ] Badge/Pill
- [ ] Loading Spinner
- [ ] Modal/Sheet

### Screens
- [ ] Home Screen
- [ ] Response Screen
- [ ] Feed Screen
- [ ] Profile Screen
- [ ] Filter Modal
- [ ] Auth Screen

### Features
- [ ] Create post functionality
- [ ] View percentile display
- [ ] Browse feed
- [ ] Filter posts
- [ ] Share functionality

### Polish
- [ ] Animations (fade in, slide up)
- [ ] Loading states
- [ ] Error handling
- [ ] Pull to refresh
- [ ] Empty states

---

## 🚀 **Start Here!**

1. **Open:** `screen_designs/postCreationScreen/code.html`
2. **Create:** `src/shared/components/ui/Button.tsx`
3. **Copy button styles from HTML → React Native**
4. **Test:** Create a test screen to see your button
5. **Repeat for each component!**

---

**You're ready to build! Start with Button component and work your way up.** 💪

