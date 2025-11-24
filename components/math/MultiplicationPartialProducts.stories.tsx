import type { Meta, StoryObj } from "@storybook/nextjs"
import { MultiplicationPartialProducts } from "./MultiplicationPartialProducts"

const meta: Meta<typeof MultiplicationPartialProducts> = {
  title: "Math/MultiplicationPartialProducts",
  component: MultiplicationPartialProducts,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof MultiplicationPartialProducts>

export const TwoByTwo: Story = {
  args: {
    multiplicand: 23,
    multiplier: 45,
  },
}

export const ThreeByTwo: Story = {
  args: {
    multiplicand: 123,
    multiplier: 45,
  },
}

export const ThreeByThree: Story = {
  args: {
    multiplicand: 234,
    multiplier: 567,
  },
}

export const FourByTwo: Story = {
  args: {
    multiplicand: 3456,
    multiplier: 78,
  },
}

export const FourByThree: Story = {
  args: {
    multiplicand: 2345,
    multiplier: 678,
  },
}

export const FourByFour: Story = {
  args: {
    multiplicand: 1234,
    multiplier: 5678,
  },
}

export const WithZeros: Story = {
  args: {
    multiplicand: 101,
    multiplier: 202,
  },
}
