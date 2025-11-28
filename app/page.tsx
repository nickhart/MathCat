import Link from "next/link"
import { FileSpreadsheet, BookOpen, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">🐱 MathCat</h1>
          <p className="text-3xl text-muted-foreground mb-4">Purr-fect your math skills!</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive multiplication practice for elementary students with multiple solving
            methods
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/demo"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Try the Demo</h2>
            <p className="text-gray-600 text-sm">
              Explore multiplication methods including Partial Products and Area Model with
              interactive examples
            </p>
          </Link>

          <Link
            href="/worksheet"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Sample Worksheet</h2>
            <p className="text-gray-600 text-sm">
              Work through a pre-built worksheet with problems organized by difficulty level
            </p>
          </Link>

          <Link
            href="/worksheet/import"
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Import Worksheet</h2>
            <p className="text-gray-600 text-sm">
              Create custom worksheets by uploading a CSV file with your own multiplication problems
            </p>
          </Link>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4">About MathCat</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              MathCat is an interactive math practice tool designed to help elementary students
              master multiplication through different solving methods.
            </p>
            <p>
              <strong>Features:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Multiple solving methods: Partial Products, Area Model, and Classic Algorithm</li>
              <li>Interactive grid-based input for step-by-step problem solving</li>
              <li>Immediate validation feedback to help students learn from mistakes</li>
              <li>Customizable worksheets via CSV import</li>
              <li>Shareable worksheet URLs for easy distribution</li>
              <li>Progress tracking to monitor completion</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
