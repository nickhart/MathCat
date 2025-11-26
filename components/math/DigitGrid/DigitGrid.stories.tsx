import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { DigitGrid } from "./DigitGrid"

const meta = {
  title: "Math/DigitGrid",
  component: DigitGrid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DigitGrid>

export default meta
type Story = StoryObj<typeof meta>

// Wrapper component to manage state
function DigitGridWrapper(props: Partial<React.ComponentProps<typeof DigitGrid>>) {
  const [value, setValue] = useState(props.value || "")

  return <DigitGrid value={value} onChange={setValue} numCells={props.numCells || 4} {...props} />
}

export const Empty: Story = {
  args: {
    value: "",
    onChange: () => {},
    numCells: 4,
  },
  render: () => <DigitGridWrapper numCells={4} />,
}

export const PartiallyFilled: Story = {
  args: {
    value: "12",
    onChange: () => {},
    numCells: 4,
  },
  render: () => <DigitGridWrapper numCells={4} value="12" />,
}

export const FullyFilled: Story = {
  args: {
    value: "1234",
    onChange: () => {},
    numCells: 4,
  },
  render: () => <DigitGridWrapper numCells={4} value="1234" />,
}

export const WithSpacer: Story = {
  args: {
    value: "1234",
    onChange: () => {},
    numCells: 5,
    spacerIndices: [0],
  },
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Spacer at index 0 (for alignment):</div>
      <DigitGridWrapper numCells={5} value="1234" spacerIndices={[0]} />
    </div>
  ),
}

export const MultipleSizers: Story = {
  args: {
    value: "",
    onChange: () => {},
    numCells: 3,
  },
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Three cells (2x2):</div>
      <DigitGridWrapper numCells={3} />

      <div className="text-sm text-muted-foreground mt-6">Four cells (3x2):</div>
      <DigitGridWrapper numCells={4} />

      <div className="text-sm text-muted-foreground mt-6">Six cells (3x3):</div>
      <DigitGridWrapper numCells={6} />
    </div>
  ),
}

export const CorrectValidation: Story = {
  args: {
    value: "1035",
    onChange: () => {},
    numCells: 4,
    validation: "correct",
    showValidation: true,
  },
  render: () => (
    <DigitGridWrapper numCells={4} value="1035" validation="correct" showValidation={true} />
  ),
}

export const IncorrectValidation: Story = {
  args: {
    value: "1234",
    onChange: () => {},
    numCells: 4,
    validation: "incorrect",
    showValidation: true,
  },
  render: () => (
    <DigitGridWrapper numCells={4} value="1234" validation="incorrect" showValidation={true} />
  ),
}

export const Disabled: Story = {
  args: {
    value: "1234",
    onChange: () => {},
    numCells: 4,
    disabled: true,
  },
  render: () => <DigitGridWrapper numCells={4} value="1234" disabled={true} />,
}

export const WithAutoFocus: Story = {
  args: {
    value: "",
    onChange: () => {},
    numCells: 4,
    autoFocus: true,
  },
  render: () => <DigitGridWrapper numCells={4} autoFocus={true} />,
}

export const AlignedRows: Story = {
  args: {
    value: "",
    onChange: () => {},
    numCells: 4,
  },
  render: () => {
    const [product1, setProduct1] = useState("")
    const [product2, setProduct2] = useState("")
    const [sum, setSum] = useState("")

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-24 text-sm font-mono text-right">20 × 3 =</span>
          <DigitGrid
            value={product1}
            onChange={setProduct1}
            numCells={4}
            spacerIndices={[0]}
            ariaLabel="Product 1"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="w-24 text-sm font-mono text-right">300 × 4 =</span>
          <DigitGrid value={product2} onChange={setProduct2} numCells={4} ariaLabel="Product 2" />
        </div>

        <div className="flex items-center gap-3 pt-2 border-t-2 border-gray-300">
          <span className="w-24 text-sm font-mono text-right font-semibold">Sum =</span>
          <DigitGrid value={sum} onChange={setSum} numCells={4} ariaLabel="Sum" />
        </div>
      </div>
    )
  },
}
