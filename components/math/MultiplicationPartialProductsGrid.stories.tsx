import type { Meta, StoryObj } from "@storybook/nextjs"
import { MultiplicationPartialProductsGrid } from "./MultiplicationPartialProductsGrid"

const meta = {
  title: "Math/MultiplicationPartialProductsGrid",
  component: MultiplicationPartialProductsGrid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MultiplicationPartialProductsGrid>

export default meta
type Story = StoryObj<typeof meta>

export const TwoByTwo: Story = {
  args: {
    multiplicand: 23,
    multiplier: 45,
    showValidation: true,
  },
}

export const ThreeByTwo: Story = {
  args: {
    multiplicand: 123,
    multiplier: 45,
    showValidation: true,
  },
}

export const ThreeByThree: Story = {
  args: {
    multiplicand: 234,
    multiplier: 567,
    showValidation: true,
  },
}

export const FourByTwo: Story = {
  args: {
    multiplicand: 3456,
    multiplier: 78,
    showValidation: true,
  },
}

export const EasyProblem: Story = {
  args: {
    multiplicand: 12,
    multiplier: 34,
    showValidation: true,
  },
}

export const WithoutValidation: Story = {
  args: {
    multiplicand: 23,
    multiplier: 45,
    showValidation: false,
  },
}

export const LargeProblem: Story = {
  args: {
    multiplicand: 9876,
    multiplier: 5432,
    showValidation: true,
  },
}
