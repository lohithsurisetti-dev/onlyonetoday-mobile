# OnlyOne.Today Mobile App

Production-grade React Native mobile application built with Expo, following clean architecture principles.

## 🏗️ Architecture

This project follows **Clean Architecture** with feature-first organization:

```
mobile/
├── app/                    # Expo Router (file-based routing)
├── src/
│   ├── features/          # Feature modules (isolated, self-contained)
│   │   ├── auth/         # Authentication feature
│   │   ├── posts/        # Posts feature
│   │   ├── feed/         # Feed feature
│   │   └── profile/      # Profile feature
│   │
│   ├── shared/           # Shared resources
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Global hooks
│   │   ├── utils/       # Utilities
│   │   └── types/       # Shared types
│   │
│   ├── services/        # Infrastructure layer
│   │   ├── api/        # API client
│   │   ├── supabase/   # Supabase client
│   │   └── storage/    # Local storage
│   │
│   ├── stores/         # Global state (Zustand)
│   ├── config/         # Configuration
│   └── lib/            # Third-party configs
│
├── assets/            # Static assets
└── __tests__/         # Tests
```

## 🚀 Tech Stack

### Frontend
- **React Native** (0.74+) - Native mobile framework
- **Expo SDK 51+** - Development toolchain
- **TypeScript** (strict mode) - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based routing

### Data & State
- **TanStack Query v5** - Server state management & caching
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Zod** - Runtime validation

### Backend
- **Supabase** - PostgreSQL database
- **Axios** - HTTP client with interceptors
- (Web APIs for initial development)

### UI & Animation
- **React Native Reanimated** - Smooth animations
- **Expo Image** - Optimized image loading
- **FlashList** - High-performance lists

### Quality
- **ESLint + Prettier** - Code formatting
- **TypeScript strict mode** - Maximum type safety
- **Jest** - Unit testing
- **Detox** - E2E testing (future)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

3. **Run the app:**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web (for testing)
   npm run web
   ```

## 🎨 Design System

Color palette (matching web):
- **Primary:** `#8242f0` (Purple)
- **Background Dark:** `#0A0A2A`
- **Accent Blue:** `#00BFFF`
- **Accent Green:** `#39FF14`
- **Accent Gold:** `#FFD700`

Typography:
- **Display:** Spline Sans
- **Serif:** Lora

See `src/config/theme.config.ts` for complete design tokens.

## 📱 Features

### Core Features
- ✅ **Submit Actions** - What did you do today?
- ✅ **Percentile Ranking** - See how unique you are
- ✅ **Feed** - Browse what others are doing
- ✅ **Scope Selection** - City, State, Country, World
- ⏳ **Authentication** - Email/Phone OTP
- ⏳ **Profile** - View your posts & stats
- ⏳ **Share** - Share your uniqueness
- ⏳ **Push Notifications** - Daily reminders

### Technical Features
- ✅ **Type-safe API calls** - Full TypeScript coverage
- ✅ **Automatic caching** - React Query handles data freshness
- ✅ **Optimistic updates** - Instant UI feedback
- ✅ **Error handling** - Graceful error states
- ✅ **Form validation** - Zod + React Hook Form
- ✅ **Code formatting** - ESLint + Prettier
- ⏳ **Offline support** - React Query persistence
- ⏳ **Analytics** - Track user behavior

## 🔧 Development

### Project Structure

Each **feature** is self-contained:
```
features/posts/
├── api/           # API calls
├── components/    # Feature-specific components
├── hooks/         # React Query hooks
├── screens/       # Screen components
├── types/         # TypeScript types + Zod schemas
└── utils/         # Feature utilities
```

### Adding a New Feature

1. Create feature folder in `src/features/`
2. Add API calls in `api/`
3. Define types in `types/`
4. Create hooks in `hooks/`
5. Build components in `components/`
6. Export from feature index

### Code Style

- **TypeScript strict mode** - All types must be defined
- **Functional components** - Use hooks, no classes
- **Named exports** - Easier to refactor
- **Barrel exports** - Index files for clean imports
- **Zod validation** - Runtime type checking for API data

### Scripts

```bash
npm run dev        # Start development server
npm run ios        # Run on iOS
npm run android    # Run on Android
npm run web        # Run on web
npm run lint       # Lint code
npm run format     # Format code with Prettier
npm run test       # Run tests
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests (future)
npm run test:e2e
```

## 📝 Best Practices

### 1. Type Safety
- Use Zod schemas for API validation
- Infer types from Zod schemas
- Enable TypeScript strict mode
- Define types for all props

### 2. Data Fetching
- Use React Query for all API calls
- Define query keys in `lib/queryClient.ts`
- Cache aggressively (30s staleTime)
- Implement optimistic updates

### 3. Component Design
- Single responsibility principle
- Compose small components
- Use shared UI components
- Keep business logic in hooks

### 4. Performance
- Use FlashList for long lists
- Memoize expensive calculations
- Lazy load heavy screens
- Optimize images with Expo Image

### 5. Error Handling
- Try/catch in async functions
- Show user-friendly error messages
- Log errors in development
- Track errors in production

## 🚢 Deployment

### iOS
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Build for internal testing
eas build --platform android --profile preview

# Submit to Play Store
eas submit --platform android
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [NativeWind](https://www.nativewind.dev/)
- [Zod](https://zod.dev/)

## 🤝 Contributing

1. Follow the established architecture
2. Write tests for new features
3. Use Prettier for formatting
4. Create feature branches
5. Submit PRs with clear descriptions

## 📄 License

Proprietary - OnlyOne.Today

---

**Built with ❤️ using React Native + Expo**

