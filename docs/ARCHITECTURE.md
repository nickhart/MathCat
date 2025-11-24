# MathCat Architecture

## Overview

MathCat is built as a client-side Next.js application with no backend requirements. All state is managed locally in the browser using localStorage and React Context.

## Tech Stack

### Core

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library with hooks and context

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library

### Development

- **pnpm** - Fast, efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

### Testing

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **Storybook** - Component development and documentation

## Project Structure

```
MathCat/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   ├── practice/                 # Practice mode
│   │   └── page.tsx
│   ├── worksheet/                # Worksheet viewer
│   │   └── [id]/page.tsx
│   └── create/                   # Worksheet creator
│       └── page.tsx
│
├── components/                    # React components
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── math/                     # Math-specific components
│   │   ├── EquationEditor/
│   │   ├── DigitGrid/
│   │   ├── CarryIndicator/
│   │   ├── MultiplicationClassic/
│   │   ├── MultiplicationPartialProducts/
│   │   ├── MultiplicationAreaModel/
│   │   └── DivisionClassic/
│   ├── worksheet/                # Worksheet-related components
│   │   ├── WorksheetHeader/
│   │   ├── ProblemCard/
│   │   └── ProgressIndicator/
│   └── layout/                   # Layout components
│       ├── Header/
│       ├── Footer/
│       └── Navigation/
│
├── lib/                          # Business logic and utilities
│   ├── math/                     # Math problem logic
│   │   ├── problem-generator.ts # Generate random problems
│   │   ├── solution-validator.ts# Validate user solutions
│   │   └── difficulty.ts        # Difficulty level configurations
│   ├── storage/                  # Local storage
│   │   ├── local-storage.ts     # localStorage wrapper
│   │   └── progress-tracker.ts  # Track user progress
│   ├── worksheet/                # Worksheet management
│   │   ├── encoder.ts           # URL encoding/decoding
│   │   ├── compressor.ts        # JSON compression
│   │   └── schema.ts            # Zod schemas for validation
│   └── utils/                    # General utilities
│       └── cn.ts                # Tailwind class name merger
│
├── types/                        # TypeScript definitions
│   ├── math.ts                  # Problem, Operation, Method types
│   ├── worksheet.ts             # Worksheet, WorksheetSettings types
│   ├── progress.ts              # ProgressStats types
│   └── index.ts                 # Barrel export
│
├── contexts/                     # React Context providers
│   ├── ProgressContext.tsx      # Global progress state
│   └── WorksheetContext.tsx     # Active worksheet state
│
├── hooks/                        # Custom React hooks
│   ├── useWorksheet.ts          # Access worksheet context
│   ├── useProgress.ts           # Access progress context
│   └── useProblemState.ts       # Manage problem state
│
├── styles/                       # Global styles
│   └── globals.css              # Tailwind imports and CSS variables
│
└── __tests__/                   # Tests
    ├── components/              # Component tests
    ├── lib/                     # Logic/utility tests
    └── integration/             # Integration tests
```

## Data Flow

### Problem Generation Flow

```
User selects difficulty →
Problem Generator →
Random problem created →
Problem displayed in solving method component
```

### Solution Validation Flow

```
User completes problem →
User inputs collected →
Solution Validator checks answer →
Feedback displayed →
Progress updated
```

### Worksheet Sharing Flow

```
User creates worksheet →
Worksheet serialized to JSON →
JSON compressed →
Base64 encoded →
URL created →
User shares URL →
Recipient decodes URL →
Worksheet loaded
```

## Key Design Patterns

### Component Composition

Components are designed to be composable and reusable:

```tsx
// Example: Multiplication component uses shared components
<DigitGrid>
  <CarryIndicator />
  <EquationEditor />
</DigitGrid>
```

### Context + Hooks Pattern

State management uses React Context with custom hooks:

```tsx
// Provider wraps the app
;<ProgressProvider>
  <WorksheetProvider worksheet={worksheet}>
    <App />
  </WorksheetProvider>
</ProgressProvider>

// Components use hooks to access state
const { currentProblem, goToNextProblem } = useWorksheet()
const { incrementExercises } = useProgress()
```

### Render Props for Method Components

Each solving method component accepts an `onComplete` callback:

```tsx
<MultiplicationPartialProducts
  multiplicand={123}
  multiplier={45}
  onComplete={(isCorrect) => {
    if (isCorrect) {
      // Update progress
      // Move to next problem
    }
  }}
/>
```

## State Management

### Local State (useState)

- Component-specific UI state
- Form inputs
- Temporary display states

### Context State

- **ProgressContext**: Global progress tracking
  - Exercises completed
  - Worksheets completed
  - Current worksheet
- **WorksheetContext**: Active worksheet state
  - Current problem index
  - Problem states
  - Navigation methods

### Persisted State (localStorage)

- Progress stats
- Current worksheet state
- User preferences (future)

## Routing

### App Router Structure

```
/                     → Home page
/practice             → Practice mode (generate problems)
/worksheet/[id]       → View/solve worksheet
/create               → Create custom worksheet
```

### URL-Based Worksheets

Worksheets are encoded in the URL:

```
/worksheet/[encoded-worksheet-data]
```

This allows:

- No backend required
- Easy sharing via URL
- Offline functionality

## Accessibility

### WCAG AA Compliance

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast requirements
- Screen reader compatibility

### Keyboard Navigation

- Tab: Navigate between inputs
- Arrow keys: Navigate grid cells
- Enter: Submit/confirm
- Escape: Cancel/close

### Focus Management

- Clear focus indicators
- Logical tab order
- Focus trapping in modals
- Announcements for screen readers

## Performance Considerations

### Code Splitting

- Dynamic imports for method components
- Route-based code splitting (App Router)
- Lazy loading of Storybook stories

### Optimization

- React.memo for expensive components
- Debounced validation
- Virtualization for long problem lists (future)

### Caching

- Stale-while-revalidate for static assets
- Local storage for user data
- Service worker (future PWA support)

## Testing Strategy

### Unit Tests

- Business logic (problem generator, validator)
- Utility functions
- Individual components
- Custom hooks

### Integration Tests

- Complete problem-solving flow
- Worksheet navigation
- URL encoding/decoding
- Progress tracking

### Component Tests (Storybook)

- Visual regression testing
- Interaction testing
- Different states/props
- Accessibility testing

## Build & Deployment

### Development

```bash
pnpm dev              # Start dev server
pnpm storybook       # Start Storybook
pnpm test:watch      # Run tests in watch mode
```

### Production Build

```bash
pnpm validate        # Run all quality checks
pnpm build           # Build for production
pnpm start           # Start production server
```

### CI/CD (GitHub Actions)

1. Checkout code
2. Install dependencies
3. Run type-check
4. Run lint
5. Run format check
6. Run tests with coverage
7. Build application
8. Deploy to Vercel (on main branch)

### Deployment (Vercel)

- Automatic deployments from main branch
- Preview deployments for PRs
- Environment variables (if needed)
- Custom domain support

## Security Considerations

### Client-Side Only

- No sensitive data stored
- No authentication required (MVP)
- All state is local to browser

### Input Validation

- Zod schemas for worksheet data
- Validate decoded URLs
- Sanitize user inputs
- Type-safe throughout

### Future Considerations

- Rate limiting for URL generation
- Content Security Policy
- Subresource Integrity
- HTTPS enforcement

## Future Architecture Changes

### Planned Enhancements

- **PWA Support**: Service workers for offline use
- **Cloud Sync**: Optional backend for progress sync
- **Real-time Collaboration**: WebRTC for shared worksheets
- **Analytics**: Privacy-focused usage tracking

### Scalability

Current architecture supports:

- Static site deployment
- CDN distribution
- Infinite horizontal scaling
- No backend bottlenecks

## Development Philosophy

### Principles

1. **User-First**: Optimize for student experience
2. **Accessibility**: Support all learners
3. **Performance**: Fast and responsive
4. **Maintainability**: Clean, documented code
5. **Type-Safety**: Leverage TypeScript fully
6. **Testing**: Comprehensive test coverage

### Code Quality

- Automated quality gates
- Pre-commit hooks
- Code review required
- Documentation maintained
- Continuous improvement

---

For implementation details, see the [Project Plan](MATHCAT_PROJECT_PLAN.md).
For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
