# MathCat - Interactive Math Learning App

## Project Plan for Claude Code

---

## Project Overview

**MathCat** is an interactive web-based math learning application designed for elementary students (grades 3-5) to practice and master multiplication, division, and related concepts through multiple solving methods. The app features a cat-themed interface with puns and imagery, making math practice engaging and fun.

### Key Goals

- Provide interactive practice for multi-digit multiplication and division
- Support multiple solving methods (classic algorithm, partial products, area model)
- Enable teachers/parents to create custom worksheets via shareable URLs
- Track student progress locally (no accounts required initially)
- Ensure accessibility and usability on laptops and tablets (11"+ landscape)

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Component Library**: shadcn/ui (purple theme)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Testing**: Jest + React Testing Library
- **Component Development**: Storybook
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)
- **Deployment**: Vercel

---

## Project Structure

```
mathcat/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions for CI/CD
├── .husky/
│   └── pre-commit                 # Git hooks
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── manager.ts
├── docs/
│   ├── STATUS.md                  # Development progress tracker
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   ├── ARCHITECTURE.md            # Technical architecture
│   └── METHODS.md                 # Math solving methods documentation
├── public/
│   ├── cats/                      # Cat-themed imagery
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home/landing page
│   │   ├── practice/
│   │   │   └── page.tsx           # Practice mode
│   │   ├── worksheet/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Shared worksheet viewer
│   │   └── create/
│   │       └── page.tsx           # Worksheet creator
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── math/                  # Custom math components
│   │   │   ├── EquationEditor/
│   │   │   ├── DigitGrid/
│   │   │   ├── CarryIndicator/
│   │   │   ├── MultiplicationClassic/
│   │   │   ├── MultiplicationPartialProducts/
│   │   │   ├── MultiplicationAreaModel/
│   │   │   └── DivisionClassic/
│   │   ├── worksheet/
│   │   │   ├── WorksheetHeader/
│   │   │   ├── ProblemCard/
│   │   │   └── ProgressIndicator/
│   │   └── layout/
│   │       ├── Header/
│   │       ├── Footer/
│   │       └── Navigation/
│   ├── lib/
│   │   ├── math/
│   │   │   ├── problem-generator.ts
│   │   │   ├── solution-validator.ts
│   │   │   └── difficulty.ts
│   │   ├── storage/
│   │   │   ├── local-storage.ts
│   │   │   └── progress-tracker.ts
│   │   ├── worksheet/
│   │   │   ├── encoder.ts         # URL encoding/decoding
│   │   │   ├── compressor.ts      # JSON compression
│   │   │   └── schema.ts          # Worksheet data schemas
│   │   └── utils/
│   │       └── cn.ts              # Class name utilities
│   ├── types/
│   │   ├── math.ts
│   │   ├── worksheet.ts
│   │   └── progress.ts
│   ├── contexts/
│   │   ├── WorksheetContext.tsx
│   │   └── ProgressContext.tsx
│   ├── hooks/
│   │   ├── useWorksheet.ts
│   │   ├── useProgress.ts
│   │   └── useProblemState.ts
│   └── styles/
│       └── globals.css
├── __tests__/
│   ├── components/
│   ├── lib/
│   └── integration/
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── jest.config.js
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── LICENSE
└── README.md
```

---

## Core Data Types

### Problem Types

```typescript
type Operation = "multiplication" | "division" | "fraction-decimal" | "decimal-fraction"

type DifficultyLevel = "easy" | "medium" | "hard" | "bonkers"

interface Problem {
  id: string
  operation: Operation
  operands: number[]
  difficulty: DifficultyLevel
  correctAnswer: number | string
}

interface ProblemState {
  problemId: string
  currentMethod: SolvingMethod
  userInputs: Record<string, any>
  isComplete: boolean
  isCorrect: boolean | null
}
```

### Solving Methods

```typescript
type SolvingMethod =
  | "classic-algorithm"
  | "partial-products"
  | "area-model"
  | "long-division"
  | "short-division"

interface MethodConfig {
  id: SolvingMethod
  name: string
  description: string
  supportedOperations: Operation[]
  component: React.ComponentType<MethodProps>
}
```

### Worksheet Structure

```typescript
interface Worksheet {
  id: string
  title: string
  description?: string
  problems: Problem[]
  createdAt: string
  settings: WorksheetSettings
}

interface WorksheetSettings {
  showMethodSelector: boolean
  allowedMethods: SolvingMethod[]
  showHints: boolean
  timeLimit?: number
}

interface WorksheetState {
  worksheetId: string
  problemStates: Record<string, ProblemState>
  currentProblemIndex: number
  startedAt: string
  completedAt?: string
}
```

### Progress Tracking

```typescript
interface ProgressStats {
  exercisesCompleted: number
  worksheetsCompleted: number
  currentWorksheet?: {
    id: string
    state: WorksheetState
  }
  lastAccessed: string
}
```

---

## Phase 1: Foundation & Setup

### 1.1 Project Initialization

- [ ] Initialize Next.js project with TypeScript and App Router
- [ ] Set up pnpm workspace
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui with purple theme
- [ ] Set up ESLint and Prettier with shared configs
- [ ] Configure Husky pre-commit hooks
- [ ] Set up Jest and React Testing Library
- [ ] Initialize Storybook with Next.js integration
- [ ] Create initial project structure (folders as outlined above)

### 1.2 Quality Gates

Create scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "validate": "pnpm run type-check && pnpm run lint && pnpm run format:check && pnpm run test"
  }
}
```

Pre-commit hook should run: `pnpm run validate`

### 1.3 Documentation Setup

- [ ] Create professional README.md with badges
- [ ] Create docs/STATUS.md for tracking development progress
- [ ] Create docs/CONTRIBUTING.md
- [ ] Create docs/ARCHITECTURE.md
- [ ] Create docs/METHODS.md (document each solving method)

---

## Phase 2: Core Components Library

Build reusable math UI components with Storybook stories for each.

### 2.1 Basic Math Components

#### EquationEditor

Interactive equation display with editable blanks.

```typescript
interface EquationEditorProps {
  operands: (number | null)[]
  operator: "+" | "-" | "×" | "÷"
  result?: number | null
  editableIndices?: number[]
  onChange?: (index: number, value: number) => void
}
```

**Features**:

- Render left-to-right equation
- Support blank spaces for user input
- Configurable operator symbol
- Accessible input fields with labels

**Storybook Stories**:

- Simple equation (3 + 5 = 8)
- Equation with blanks (3 + \_\_ = 8)
- Multi-digit equation (123 × 45 = \_\_\_\_)

#### DigitGrid

Grid-based input for multi-digit arithmetic with place value alignment.

```typescript
interface DigitGridProps {
  rows: number
  cols: number
  values: (number | null)[][]
  editablePositions?: [row: number, col: number][]
  onChange?: (row: number, col: number, value: number) => void
  showPlaceValues?: boolean
}
```

**Features**:

- Align digits by place value (ones, tens, hundreds)
- Support empty cells for user input
- Optional place value labels
- Keyboard navigation (arrow keys, tab)

**Storybook Stories**:

- Basic 2×3 grid
- Editable grid with some pre-filled values
- Grid with place value labels

#### CarryIndicator

Small superscript indicator for "carry" digits in addition/multiplication.

```typescript
interface CarryIndicatorProps {
  value: number | null
  position: "above" | "below"
  visible: boolean
  editable?: boolean
  onChange?: (value: number) => void
}
```

**Features**:

- Superscript styling
- Positioned above or below main digit
- Optional editing
- Fade in/out animation

**Storybook Stories**:

- Static carry indicator
- Editable carry indicator
- Animated appearance

### 2.2 Multiplication Method Components

#### MultiplicationClassic

Traditional algorithm (multiply each digit, carry, add).

```typescript
interface MultiplicationClassicProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
}
```

**Features**:

- Vertical layout with proper alignment
- Editable intermediate products
- Carry indicators
- Underline for addition
- Final answer row

**Storybook Stories**:

- Empty problem (123 × 45)
- Partially completed
- Completed with validation

#### MultiplicationPartialProducts

Break down multiplication into partial products by place value.

```typescript
interface MultiplicationPartialProductsProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
}
```

**Features**:

- Show each partial product separately
- Highlight place value (ones, tens, hundreds)
- Editable partial products
- Sum of partial products
- Visual grouping

**Storybook Stories**:

- Empty problem
- Partially completed
- Completed with validation

#### MultiplicationAreaModel

Visual grid-based area representation.

```typescript
interface MultiplicationAreaModelProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
}
```

**Features**:

- Grid divided by place values
- Each section shows partial area
- Labels for dimensions
- Editable area values
- Sum of all areas

**Storybook Stories**:

- Empty model
- Partially completed
- Completed with validation

### 2.3 Division Components

#### DivisionClassic

Long division algorithm.

```typescript
interface DivisionClassicProps {
  dividend: number
  divisor: number
  onComplete?: (isCorrect: boolean) => void
}
```

**Features**:

- Traditional long division layout
- Steps: divide, multiply, subtract, bring down
- Editable at each step
- Remainder display

**Storybook Stories**:

- Empty problem
- Partially completed
- Completed with validation
- Problem with remainder

---

## Phase 3: Problem Generation & Validation

### 3.1 Problem Generator

```typescript
// lib/math/problem-generator.ts

interface GeneratorConfig {
  operation: Operation
  difficulty: DifficultyLevel
  count: number
  customRange?: {
    minDigits: number
    maxDigits: number
  }
}

function generateProblems(config: GeneratorConfig): Problem[]
function generateMultiplication(difficulty: DifficultyLevel): Problem
function generateDivision(difficulty: DifficultyLevel): Problem
```

**Difficulty Mapping**:

- **Easy**: 1-2 digits × 1 digit, 2 digits ÷ 1 digit
- **Medium**: 2-3 digits × 2 digits, 3 digits ÷ 1-2 digits
- **Hard**: 3-4 digits × 2-3 digits, 4 digits ÷ 2 digits
- **Bonkers**: 4+ digits × 3+ digits, 5+ digits ÷ 2-3 digits

### 3.2 Solution Validator

```typescript
// lib/math/solution-validator.ts

function validateSolution(
  problem: Problem,
  method: SolvingMethod,
  userInputs: Record<string, any>
): ValidationResult

interface ValidationResult {
  isCorrect: boolean
  errors?: ValidationError[]
}

interface ValidationError {
  field: string
  expected: any
  actual: any
  message: string
}
```

**Method-Specific Validation**:

- Classic: Check intermediate products, carries, final sum
- Partial Products: Validate each partial product and sum
- Area Model: Verify each area section and total
- Long Division: Validate each step (quotient digits, subtractions, remainders)

### 3.3 Unit Tests

- [ ] Test problem generation for each difficulty level
- [ ] Test validation logic for each solving method
- [ ] Test edge cases (single digit, large numbers, remainders)
- [ ] Test random distribution of generated problems

---

## Phase 4: Local Storage & Progress Tracking

### 4.1 Storage Utilities

```typescript
// lib/storage/local-storage.ts

const STORAGE_KEYS = {
  PROGRESS: "mathcat_progress",
  CURRENT_WORKSHEET: "mathcat_current_worksheet",
} as const

function saveProgress(stats: ProgressStats): void
function loadProgress(): ProgressStats | null
function saveWorksheetState(state: WorksheetState): void
function loadWorksheetState(): WorksheetState | null
function clearStorage(): void
```

### 4.2 Progress Context

```typescript
// contexts/ProgressContext.tsx

interface ProgressContextValue {
  stats: ProgressStats
  incrementExercises: () => void
  incrementWorksheets: () => void
  saveCurrentWorksheet: (worksheet: Worksheet, state: WorksheetState) => void
  clearCurrentWorksheet: () => void
}

export function ProgressProvider({ children }: PropsWithChildren)
export function useProgress(): ProgressContextValue
```

### 4.3 Worksheet Context

```typescript
// contexts/WorksheetContext.tsx

interface WorksheetContextValue {
  worksheet: Worksheet | null
  worksheetState: WorksheetState | null
  currentProblem: Problem | null
  currentProblemState: ProblemState | null
  goToNextProblem: () => void
  goToPreviousProblem: () => void
  goToProblem: (index: number) => void
  updateProblemState: (updates: Partial<ProblemState>) => void
  submitWorksheet: () => void
}

export function WorksheetProvider({
  worksheet,
  children,
}: PropsWithChildren<{ worksheet: Worksheet }>)
export function useWorksheet(): WorksheetContextValue
```

---

## Phase 5: Worksheet URL Encoding

### 5.1 Encoding/Decoding Utilities

```typescript
// lib/worksheet/encoder.ts

function encodeWorksheet(worksheet: Worksheet): string
function decodeWorksheet(encoded: string): Worksheet | null
```

**Implementation**:

1. Normalize JSON (sort keys, remove whitespace)
2. Compress with LZ-string or similar
3. Base64 encode
4. URL-safe encoding (replace +, /, =)

### 5.2 Compression

```typescript
// lib/worksheet/compressor.ts

function compress(data: string): string
function decompress(data: string): string | null
```

Consider using `lz-string` package for client-side compression.

### 5.3 Schema Validation

```typescript
// lib/worksheet/schema.ts

import { z } from "zod"

export const ProblemSchema = z.object({
  id: z.string(),
  operation: z.enum(["multiplication", "division", "fraction-decimal", "decimal-fraction"]),
  operands: z.array(z.number()),
  difficulty: z.enum(["easy", "medium", "hard", "bonkers"]),
  correctAnswer: z.union([z.number(), z.string()]),
})

export const WorksheetSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  problems: z.array(ProblemSchema),
  createdAt: z.string(),
  settings: z.object({
    showMethodSelector: z.boolean(),
    allowedMethods: z.array(z.string()),
    showHints: z.boolean(),
    timeLimit: z.number().optional(),
  }),
})
```

Use Zod for runtime validation of decoded worksheets.

---

## Phase 6: Pages & User Flows

### 6.1 Home Page (`app/page.tsx`)

**Features**:

- Welcome message with cat theme
- Quick start options:
  - Generate random practice problems
  - Continue current worksheet
  - Create custom worksheet
  - Open shared worksheet (paste URL)
- Display progress stats (if any)

**Cat Puns Ideas**:

- "Purr-fect your math skills!"
- "Time to multiply the fun!"
- "Let's paws and practice!"

### 6.2 Practice Mode (`app/practice/page.tsx`)

**Features**:

- Select operation type
- Choose difficulty level
- Select number of problems
- Optional: choose specific solving methods
- Generate and start practice session

**Flow**:

1. Configuration screen
2. Generate problems
3. Navigate to worksheet viewer with generated worksheet

### 6.3 Worksheet Viewer (`app/worksheet/[id]/page.tsx`)

**Features**:

- Display current problem
- Method selector (tabs or dropdown)
- Interactive solving interface (switches based on selected method)
- Navigation: Previous, Next, Jump to problem
- Progress indicator (3/10 completed)
- Submit button (when all complete)
- Review mode (after submission)

**Layout**:

```
┌─────────────────────────────────────────┐
│  Header: Problem 3 of 10                │
├─────────────────────────────────────────┤
│  Method Tabs: [Classic] [Partial] [Area]│
├─────────────────────────────────────────┤
│                                          │
│   Interactive Problem Component          │
│   (switches based on selected method)   │
│                                          │
│                                          │
├─────────────────────────────────────────┤
│  [← Previous]  [Next →]  [Submit All]   │
└─────────────────────────────────────────┘
```

**Accessibility**:

- Keyboard shortcuts: Arrow keys for navigation, Tab for inputs
- Screen reader announcements for problem changes
- Focus management when switching problems

### 6.4 Worksheet Creator (`app/create/page.tsx`)

**Features**:

- Worksheet title and description
- Add problems:
  - Manual entry (operands)
  - Generate random based on criteria
- Configure settings (methods allowed, hints, etc.)
- Preview worksheet
- Generate shareable URL
- Copy to clipboard
- "Duplicate & Edit" feature (pre-populate from existing URL)

**Flow**:

1. Enter worksheet metadata
2. Add problems (manual or generated)
3. Configure settings
4. Preview
5. Generate URL
6. Share

### 6.5 Review Mode

**Features**:

- Show all problems with user answers
- Highlight correct/incorrect
- Allow corrections
- Show correct answers (optional toggle)
- Display summary stats (X/Y correct, time taken)
- Options: Retry incorrect, New worksheet, Back to home

---

## Phase 7: Styling & Theme

### 7.1 shadcn/ui Configuration

- Use purple as primary color
- Configure in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  // ... other shadcn colors
}
```

### 7.2 Cat Theme Assets

- Cat logo/icon
- Cat illustrations for:
  - Success states
  - Empty states
  - Loading states
- Cat-themed success messages with puns

### 7.3 Responsive Design

- Optimize for landscape tablets (11"+)
- Minimum width: 1024px (iPad landscape)
- Secondary support for portrait mode
- Font sizes appropriate for children (minimum 16px body text)

---

## Phase 8: Testing Strategy

### 8.1 Unit Tests

**Components** (`__tests__/components/`):

- [ ] EquationEditor: rendering, editing, validation
- [ ] DigitGrid: keyboard navigation, editing, accessibility
- [ ] CarryIndicator: visibility, editing
- [ ] Each multiplication method component
- [ ] Division components

**Utilities** (`__tests__/lib/`):

- [ ] Problem generator: all difficulty levels, edge cases
- [ ] Solution validator: each method, error cases
- [ ] Storage utilities: save/load, edge cases
- [ ] Encoding utilities: encode/decode round-trip

### 8.2 Integration Tests (`__tests__/integration/`)

- [ ] Complete problem solving flow
- [ ] Worksheet navigation
- [ ] Progress tracking
- [ ] URL encoding/decoding with real worksheets

### 8.3 Coverage Goals

- Aim for >80% code coverage
- 100% coverage for math validation logic
- Focus on critical paths (problem solving, validation)

---

## Phase 9: Deployment & CI/CD

### 9.1 GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run format:check
      - run: pnpm run test:coverage
      - run: pnpm run build
```

### 9.2 Vercel Deployment

- Connect GitHub repo to Vercel
- Configure build settings:
  - Build command: `pnpm run build`
  - Output directory: `.next`
  - Install command: `pnpm install`
- Set up preview deployments for PRs
- Configure custom domain (optional)

---

## Phase 10: Future Enhancements (Post-MVP)

### 10.1 Additional Features

- [ ] Fraction operations (add, subtract, multiply, divide)
- [ ] Converting between fractions and decimals
- [ ] Decimal operations
- [ ] Word problems
- [ ] Timed challenges
- [ ] Achievements and badges
- [ ] Print-friendly view for worksheets

### 10.2 User Profiles & Cloud Storage

- [ ] Simple authentication (email/password)
- [ ] Cloud storage for progress
- [ ] User dashboard
- [ ] Historical stats and trends
- [ ] Saved worksheets library

### 10.3 Enhanced Sharing

- [ ] QR code generation for worksheet URLs
- [ ] Teacher dashboard for classroom management
- [ ] Class-wide worksheet assignment
- [ ] Progress reports for parents/teachers

---

## Implementation Order (Suggested)

1. **Setup** (Phase 1): Get the project foundation solid
2. **Basic Components** (Phase 2.1): Build EquationEditor, DigitGrid, CarryIndicator with Storybook
3. **One Method** (Phase 2.2): Implement MultiplicationClassic first (most familiar)
4. **Problem Logic** (Phase 3): Generator and validator for multiplication
5. **Basic Page Flow** (Phase 6): Home → Practice → Worksheet viewer (single method)
6. **Storage** (Phase 4): Add progress tracking
7. **Additional Methods** (Phase 2.2-2.3): Partial products, area model, division
8. **Worksheet URLs** (Phase 5): Encoding and creator page
9. **Polish** (Phase 7): Styling, cat theme, accessibility
10. **Testing** (Phase 8): Comprehensive test coverage
11. **Deploy** (Phase 9): CI/CD and production deployment

---

## README.md Template

````markdown
# 🐱 MathCat

[![CI](https://github.com/[username]/mathcat/workflows/CI/badge.svg)](https://github.com/[username]/mathcat/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

> Purr-fect your math skills! An interactive learning platform for elementary students to master multiplication, division, and more.

## ✨ Features

- 🎯 **Multiple Solving Methods**: Learn the same problem different ways (classic algorithm, partial products, area model)
- 📝 **Custom Worksheets**: Create and share worksheets via URL (no accounts needed)
- 📊 **Progress Tracking**: Keep track of completed exercises locally
- 🎨 **Interactive Learning**: Visual, step-by-step problem solving
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 📱 **Tablet-Friendly**: Optimized for 11"+ tablets in landscape mode
- 🐱 **Cat-Themed**: Because math is better with cats and puns!

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```
````

## 📋 Requirements

- Node.js 18+
- pnpm 8+

## 🛠️ Development

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm type-check

# Lint
pnpm lint

# Format code
pnpm format

# Run Storybook
pnpm storybook

# Run all quality checks
pnpm validate
```

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React + shadcn/ui + Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Components**: Storybook
- **Quality**: ESLint, Prettier, Husky

## 📖 Documentation

- [Development Status](docs/STATUS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Math Methods](docs/METHODS.md)

## 🗺️ Roadmap

- [x] Core multiplication methods
- [x] Worksheet creator and sharing
- [ ] Division methods
- [ ] Fraction support
- [ ] Decimal conversions
- [ ] User accounts and cloud storage
- [ ] Achievements and badges

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

## 💬 Support

Found a bug? Have a feature request? [Open an issue](https://github.com/[username]/mathcat/issues)!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 About

Created with ❤️ for students learning math. Inspired by 3rd-5th grade curricula and powered by cats! 🐱

---

**MathCat** - Time to multiply the fun! 🎉

````

---

## STATUS.md Template

```markdown
# MathCat Development Status

Last Updated: [Date]

## Current Phase: [Phase Name]

## Completed ✅

### Phase 1: Foundation & Setup
- [ ] Project initialization
- [ ] Quality gates configured
- [ ] Documentation scaffolding
- [ ] CI/CD pipeline

### Phase 2: Core Components
- [ ] EquationEditor + Stories
- [ ] DigitGrid + Stories
- [ ] CarryIndicator + Stories
- [ ] MultiplicationClassic + Stories
- [ ] MultiplicationPartialProducts + Stories
- [ ] MultiplicationAreaModel + Stories
- [ ] DivisionClassic + Stories

### Phase 3: Problem Generation
- [ ] Problem generator (all difficulty levels)
- [ ] Solution validator (all methods)
- [ ] Unit tests (problem logic)

### Phase 4: Storage & Progress
- [ ] Local storage utilities
- [ ] Progress context
- [ ] Worksheet context
- [ ] Progress tracking tests

### Phase 5: Worksheet URLs
- [ ] Encoding/decoding utilities
- [ ] Compression implementation
- [ ] Schema validation
- [ ] Round-trip tests

### Phase 6: Pages
- [ ] Home page
- [ ] Practice mode
- [ ] Worksheet viewer
- [ ] Worksheet creator
- [ ] Review mode

### Phase 7: Styling
- [ ] shadcn/ui purple theme
- [ ] Cat-themed assets
- [ ] Responsive design
- [ ] Accessibility audit

### Phase 8: Testing
- [ ] Component unit tests
- [ ] Utility unit tests
- [ ] Integration tests
- [ ] Coverage >80%

### Phase 9: Deployment
- [ ] GitHub Actions CI
- [ ] Vercel deployment
- [ ] Custom domain (optional)

## In Progress 🚧

[Current work items]

## Blocked 🚫

[Any blockers]

## Next Up 📅

[Next planned items]

## Known Issues 🐛

[List of known bugs]

## Notes 📝

[Any important development notes]
````

---

## Key Implementation Notes

### Accessibility Checklist

- [ ] All interactive elements have labels
- [ ] Keyboard navigation works throughout
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested with NVDA/JAWS
- [ ] Semantic HTML structure
- [ ] ARIA labels where needed

### Performance Considerations

- Use React.memo for expensive components
- Lazy load method components
- Optimize Storybook build size
- Consider code splitting for worksheet creator

### Testing Best Practices

- Use data-testid sparingly (prefer accessible queries)
- Test user behavior, not implementation
- Mock localStorage in tests
- Use MSW for any future API mocking

### Git Workflow

- Main branch is protected
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- PR required for merge
- Squash commits on merge
- Semantic commit messages

---

## Success Metrics

**MVP is complete when**:

1. All three multiplication methods work end-to-end
2. One division method implemented
3. Worksheet creator generates shareable URLs
4. Progress tracking persists across sessions
5. All quality gates pass (lint, format, type-check, tests)
6. Deployed to Vercel and accessible
7. Documentation is complete
8. Tested on target devices (laptop + tablet)

---

## Questions to Revisit

1. Should we add animation/transitions between problems?
2. Do we need sound effects for correct answers?
3. Should incorrect answers shake or have visual feedback?
4. What's the best way to handle very long numbers (7+ digits)?
5. Should we support custom operator symbols (e.g., · vs ×)?

---

## Contact & Collaboration

This project is designed to be built collaboratively with Claude Code. Each component, utility, and page should be built incrementally with:

- Clear interfaces defined first
- Tests written alongside code
- Storybook stories for visual components
- Documentation updated as we go

Let's make math fun, one cat pun at a time! 🐱✨

```

```
