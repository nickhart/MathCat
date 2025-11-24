import type { Meta, StoryObj } from "@storybook/nextjs"
import { CatValidator } from "./CatValidator"

const meta: Meta<typeof CatValidator> = {
  title: "Feedback/CatValidator",
  component: CatValidator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof CatValidator>

export const Thinking: Story = {
  args: {
    isComplete: false,
    isCorrect: null,
  },
}

export const Correct: Story = {
  args: {
    isComplete: true,
    isCorrect: true,
  },
}

export const Incorrect: Story = {
  args: {
    isComplete: true,
    isCorrect: false,
  },
}
