import { render, screen } from "@testing-library/react"
import Home from "@/app/page"

describe("Home", () => {
  it("renders MathCat heading", () => {
    render(<Home />)
    const heading = screen.getByRole("heading", { name: /🐱 MathCat/i })
    expect(heading).toBeInTheDocument()
  })

  it("renders tagline", () => {
    render(<Home />)
    const tagline = screen.getByText(/purr-fect your math skills/i)
    expect(tagline).toBeInTheDocument()
  })
})
