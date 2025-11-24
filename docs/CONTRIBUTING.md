# Contributing to MathCat

Thank you for your interest in contributing to MathCat! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive learning environment
- Remember that this project is designed for children's education

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MathCat.git
   cd MathCat
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Running Storybook

```bash
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to view component stories.

### Quality Checks

Before committing, ensure all quality checks pass:

```bash
# Run all checks
pnpm validate

# Or run individually:
pnpm type-check  # TypeScript type checking
pnpm lint        # ESLint
pnpm format:check # Prettier formatting
pnpm test        # Jest tests
```

**Note**: Pre-commit hooks will automatically run `pnpm validate` before each commit.

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces (avoid `any`)
- Use type inference where appropriate
- Export types that may be used externally

### React Components

- Use functional components with hooks
- Follow the component structure:

  ```tsx
  // Imports
  import { useState } from "react"
  import { cn } from "@/lib/utils/cn"

  // Types
  interface MyComponentProps {
    title: string
    onComplete?: () => void
  }

  // Component
  export function MyComponent({ title, onComplete }: MyComponentProps) {
    // hooks
    const [state, setState] = useState(false)

    // handlers
    const handleClick = () => {
      setState(true)
      onComplete?.()
    }

    // render
    return <div>{title}</div>
  }
  ```

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional classes
- Follow shadcn/ui component patterns
- Ensure WCAG AA color contrast
- Support keyboard navigation

### Testing

- Write tests for new components
- Use React Testing Library best practices
- Test user behavior, not implementation
- Aim for >80% code coverage
- Use descriptive test names

Example test structure:

```tsx
describe("MyComponent", () => {
  it("renders with correct title", () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  it("calls onComplete when clicked", () => {
    const onComplete = jest.fn()
    render(<MyComponent title="Test" onComplete={onComplete} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onComplete).toHaveBeenCalled()
  })
})
```

### Storybook Stories

Every component should have accompanying Storybook stories:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { MyComponent } from "./MyComponent"

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    title: "Example Title",
  },
}

export const WithCallback: Story = {
  args: {
    title: "Example Title",
    onComplete: () => console.log("Completed!"),
  },
}
```

## Git Workflow

### Commit Messages

Use semantic commit messages:

```
feat: add partial products multiplication method
fix: correct carry calculation in classic algorithm
docs: update METHODS.md with area model explanation
test: add tests for problem generator
refactor: simplify DigitGrid keyboard navigation
style: format code with prettier
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions/changes

### Pull Requests

1. Update your branch with main:

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. Push your changes:

   ```bash
   git push origin your-branch
   ```

3. Create a pull request with:
   - Clear title describing the change
   - Description of what was changed and why
   - Screenshots/videos for UI changes
   - Reference to related issues (if any)
   - Checklist of completed items

4. Ensure CI passes
5. Request review
6. Address feedback
7. Merge when approved

## Project Structure

```
MathCat/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── practice/          # Practice mode
│   ├── worksheet/         # Worksheet viewer
│   └── create/            # Worksheet creator
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── math/             # Math-specific components
│   ├── worksheet/        # Worksheet components
│   └── layout/           # Layout components
├── lib/                   # Utilities and logic
│   ├── math/             # Math problem generation/validation
│   ├── storage/          # Local storage utilities
│   ├── worksheet/        # Worksheet encoding/decoding
│   └── utils/            # General utilities
├── types/                 # TypeScript type definitions
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── styles/                # Global styles
└── __tests__/            # Tests
```

## Areas for Contribution

### High Priority

- Multiplication method components (partial products, area model)
- Division method components
- Problem generator improvements
- Accessibility enhancements
- Test coverage

### Good First Issues

- Add cat-themed imagery
- Create additional Storybook stories
- Write documentation
- Fix typos
- Add more cat puns!

### Future Features

- Fraction operations
- Decimal conversions
- Word problems
- Timed challenges
- Achievements system

## Questions?

- Check existing [Issues](https://github.com/nickhart/MathCat/issues)
- Review the [Architecture](ARCHITECTURE.md) docs
- Ask questions in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make math education more engaging for students! 🐱✨
