"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Worksheet } from "@/types/worksheet"
import { parseCSVToWorksheet, downloadExampleCSV } from "@/lib/csv-import"
import { generateShareableURL } from "@/lib/worksheet-uri"
import { initializeWorksheetProgress, saveWorksheetProgress } from "@/lib/worksheet-storage"
import { Download, Upload, FileText, Link2, PlayCircle } from "lucide-react"

export default function ImportWorksheetPage() {
  const router = useRouter()
  const [csvText, setCsvText] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvText(text)
      setError(null)
    }
    reader.readAsText(file)
  }

  const handleParse = () => {
    if (!csvText.trim()) {
      setError("Please upload a CSV file or paste CSV content")
      return
    }

    if (!title.trim()) {
      setError("Please enter a worksheet title")
      return
    }

    const parsed = parseCSVToWorksheet(csvText, title, description)
    if (!parsed) {
      setError("Failed to parse CSV. Please check the format.")
      return
    }

    setWorksheet(parsed)
    setError(null)
  }

  const handleGenerateShareUrl = () => {
    if (!worksheet) return
    const url = generateShareableURL(worksheet)
    setShareUrl(url)
    navigator.clipboard.writeText(url)
  }

  const handleStartWorksheet = () => {
    if (!worksheet) return
    const progress = initializeWorksheetProgress(worksheet.id)
    saveWorksheetProgress(progress)
    router.push("/worksheet")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Import Worksheet from CSV</h1>
      <p className="text-muted-foreground mb-8">
        Create a custom worksheet by uploading a CSV file with multiplication problems.
      </p>

      {/* Example Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="font-semibold text-blue-900 mb-1">CSV Format</h2>
            <p className="text-sm text-blue-700 mb-2">
              Your CSV should have columns: section, operand1, operand2, difficulty (optional)
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded border block">
              Two-Digit by One-Digit,12,3,easy
            </code>
          </div>
          <button
            onClick={downloadExampleCSV}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download Example
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Upload CSV File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop your CSV file
              </p>
            </label>
          </div>
        </div>

        {/* Or paste CSV */}
        <div>
          <label className="block text-sm font-medium mb-2">Or Paste CSV Content</label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="section,operand1,operand2,difficulty&#10;Two-Digit by One-Digit,12,3,easy&#10;Two-Digit by One-Digit,45,7,medium"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          />
        </div>

        {/* Worksheet Details */}
        <div>
          <label className="block text-sm font-medium mb-2">Worksheet Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Custom Worksheet"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A collection of multiplication problems"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Parse Button */}
        <button
          onClick={handleParse}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          <FileText className="w-5 h-5" />
          Parse CSV and Preview Worksheet
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
        )}

        {/* Preview */}
        {worksheet && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-green-900">✓ Worksheet Created!</h2>

            <div className="space-y-2">
              <p className="text-sm">
                <strong>Title:</strong> {worksheet.title}
              </p>
              {worksheet.description && (
                <p className="text-sm">
                  <strong>Description:</strong> {worksheet.description}
                </p>
              )}
              <p className="text-sm">
                <strong>Total Problems:</strong> {worksheet.problems.length}
              </p>
              {worksheet.sections && (
                <div className="text-sm">
                  <strong>Sections:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {worksheet.sections.map((section) => (
                      <li key={section.id}>
                        {section.title} ({section.problems.length} problems)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleStartWorksheet}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                <PlayCircle className="w-5 h-5" />
                Start Worksheet
              </button>
              <button
                onClick={handleGenerateShareUrl}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
              >
                <Link2 className="w-5 h-5" />
                {shareUrl ? "Copied!" : "Generate Share Link"}
              </button>
            </div>

            {shareUrl && (
              <div className="bg-white border border-gray-300 rounded p-3">
                <p className="text-xs text-gray-600 mb-1">Shareable URL (copied to clipboard):</p>
                <code className="text-xs break-all">{shareUrl}</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
