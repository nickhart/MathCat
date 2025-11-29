import {
  initializeWorksheetProgress,
  updateProblemState,
  isSectionComplete,
  calculateWorksheetProgress,
  mergeWorksheetSettings,
  loadWorksheetProgress,
  saveWorksheetProgress,
  clearWorksheetProgress,
} from "@/lib/worksheet-storage"
import { WorksheetSettings, WorksheetSection } from "@/types/worksheet"
import { ProblemState } from "@/types/math"

describe("worksheet-storage", () => {
  describe("initializeWorksheetProgress", () => {
    it("should create initial progress with empty state", () => {
      const progress = initializeWorksheetProgress("test-worksheet")

      expect(progress.worksheetId).toBe("test-worksheet")
      expect(progress.problemStates).toEqual({})
      expect(progress.currentProblemId).toBeNull()
      expect(progress.sectionProgress).toEqual({})
      expect(progress.startedAt).toBeDefined()
    })
  })

  describe("updateProblemState", () => {
    it("should update problem state", () => {
      const progress = initializeWorksheetProgress("test-worksheet")
      const problemState: ProblemState = {
        problemId: "prob-1",
        currentMethod: "partial-products",
        userInputs: {},
        isComplete: true,
        isCorrect: true,
      }

      const updated = updateProblemState(progress, "prob-1", problemState)

      expect(updated.problemStates["prob-1"]).toEqual(problemState)
    })

    it("should calculate section progress when section info provided", () => {
      const progress = initializeWorksheetProgress("test-worksheet")
      const problemState: ProblemState = {
        problemId: "prob-1",
        currentMethod: "partial-products",
        userInputs: {},
        isComplete: true,
        isCorrect: true,
      }

      const updated = updateProblemState(progress, "prob-1", problemState, "section-1", [
        "prob-1",
        "prob-2",
      ])

      expect(updated.sectionProgress["section-1"]).toBeDefined()
      expect(updated.sectionProgress["section-1"].completed).toBe(1)
      expect(updated.sectionProgress["section-1"].total).toBe(2)
    })
  })

  describe("isSectionComplete", () => {
    it("should return true when all problems are complete and correct", () => {
      const progress = initializeWorksheetProgress("test-worksheet")
      progress.problemStates = {
        "prob-1": {
          problemId: "prob-1",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: true,
          isCorrect: true,
        },
        "prob-2": {
          problemId: "prob-2",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: true,
          isCorrect: true,
        },
      }

      const result = isSectionComplete(progress, ["prob-1", "prob-2"])

      expect(result).toBe(true)
    })

    it("should return false when any problem is incomplete", () => {
      const progress = initializeWorksheetProgress("test-worksheet")
      progress.problemStates = {
        "prob-1": {
          problemId: "prob-1",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: true,
          isCorrect: true,
        },
      }

      const result = isSectionComplete(progress, ["prob-1", "prob-2"])

      expect(result).toBe(false)
    })

    it("should return false when any problem is incorrect", () => {
      const progress = initializeWorksheetProgress("test-worksheet")
      progress.problemStates = {
        "prob-1": {
          problemId: "prob-1",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: true,
          isCorrect: true,
        },
        "prob-2": {
          problemId: "prob-2",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: true,
          isCorrect: false,
        },
      }

      const result = isSectionComplete(progress, ["prob-1", "prob-2"])

      expect(result).toBe(false)
    })
  })

  describe("calculateWorksheetProgress", () => {
    it("should calculate percentage of completed problems", () => {
      const progress = initializeWorksheetProgress("test-worksheet")
      progress.problemStates = {
        "prob-1": {
          problemId: "prob-1",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: true,
          isCorrect: true,
        },
        "prob-2": {
          problemId: "prob-2",
          currentMethod: "partial-products",
          userInputs: {},
          isComplete: false,
          isCorrect: false,
        },
      }

      const percentage = calculateWorksheetProgress(progress, 2)

      expect(percentage).toBe(50)
    })

    it("should return 0 for empty worksheet", () => {
      const progress = initializeWorksheetProgress("test-worksheet")

      const percentage = calculateWorksheetProgress(progress, 0)

      expect(percentage).toBe(0)
    })
  })

  describe("mergeWorksheetSettings", () => {
    const worksheetSettings: WorksheetSettings = {
      showMethodSelector: true,
      allowedMethods: ["partial-products", "area-model"],
      showHints: false,
      showValidation: true,
      showAllCells: false,
      showPlaceholderZeros: false,
    }

    it("should return worksheet settings when section has no overrides", () => {
      const section: WorksheetSection = {
        id: "section-1",
        title: "Test Section",
        problems: [],
      }

      const merged = mergeWorksheetSettings(worksheetSettings, section)

      expect(merged).toEqual(worksheetSettings)
    })

    it("should merge section settings over worksheet settings", () => {
      const section: WorksheetSection = {
        id: "section-1",
        title: "Test Section",
        problems: [],
        settings: {
          showPlaceholderZeros: true,
        },
      }

      const merged = mergeWorksheetSettings(worksheetSettings, section)

      expect(merged.showPlaceholderZeros).toBe(true)
      expect(merged.showValidation).toBe(true) // Unchanged from worksheet
      expect(merged.showAllCells).toBe(false) // Unchanged from worksheet
    })

    it("should return worksheet settings when no section provided", () => {
      const merged = mergeWorksheetSettings(worksheetSettings, undefined)

      expect(merged).toEqual(worksheetSettings)
    })

    it("should merge multiple section settings", () => {
      const section: WorksheetSection = {
        id: "section-1",
        title: "Test Section",
        problems: [],
        settings: {
          showPlaceholderZeros: true,
          showAllCells: true,
          showHints: true,
        },
      }

      const merged = mergeWorksheetSettings(worksheetSettings, section)

      expect(merged.showPlaceholderZeros).toBe(true)
      expect(merged.showAllCells).toBe(true)
      expect(merged.showHints).toBe(true)
      expect(merged.showValidation).toBe(true) // Unchanged
    })
  })

  describe("calculateSectionProgress with completedAt", () => {
    it("should set completedAt when all problems are complete and correct", () => {
      const progress = initializeWorksheetProgress("test-worksheet")

      // Complete first problem
      const problemState1: ProblemState = {
        problemId: "prob-1",
        currentMethod: "partial-products",
        userInputs: {},
        isComplete: true,
        isCorrect: true,
      }

      const updated1 = updateProblemState(progress, "prob-1", problemState1, "section-1", [
        "prob-1",
        "prob-2",
      ])

      expect(updated1.sectionProgress["section-1"].completedAt).toBeUndefined()

      // Complete second problem
      const problemState2: ProblemState = {
        problemId: "prob-2",
        currentMethod: "partial-products",
        userInputs: {},
        isComplete: true,
        isCorrect: true,
      }

      const updated2 = updateProblemState(updated1, "prob-2", problemState2, "section-1", [
        "prob-1",
        "prob-2",
      ])

      expect(updated2.sectionProgress["section-1"].completedAt).toBeDefined()
      expect(updated2.sectionProgress["section-1"].completed).toBe(2)
      expect(updated2.sectionProgress["section-1"].total).toBe(2)
    })
  })

  describe("localStorage functions", () => {
    let localStorageMock: { [key: string]: string }
    let getItemSpy: jest.SpyInstance
    let setItemSpy: jest.SpyInstance
    let removeItemSpy: jest.SpyInstance

    beforeEach(() => {
      localStorageMock = {}

      getItemSpy = jest.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
        return localStorageMock[key] || null
      })

      setItemSpy = jest
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation((key: string, value: string) => {
          localStorageMock[key] = value
        })

      removeItemSpy = jest
        .spyOn(Storage.prototype, "removeItem")
        .mockImplementation((key: string) => {
          delete localStorageMock[key]
        })
    })

    afterEach(() => {
      getItemSpy.mockRestore()
      setItemSpy.mockRestore()
      removeItemSpy.mockRestore()
    })

    describe("saveWorksheetProgress", () => {
      it("should save progress to localStorage", () => {
        const progress = initializeWorksheetProgress("test-worksheet")

        saveWorksheetProgress(progress)

        expect(setItemSpy).toHaveBeenCalledWith(
          "mathcat_worksheet_test-worksheet",
          JSON.stringify(progress)
        )
      })

      it("should handle save errors gracefully", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()
        setItemSpy.mockImplementation(() => {
          throw new Error("Storage full")
        })

        const progress = initializeWorksheetProgress("test-worksheet")
        saveWorksheetProgress(progress)

        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to save worksheet progress:",
          expect.any(Error)
        )
        consoleSpy.mockRestore()
      })
    })

    describe("loadWorksheetProgress", () => {
      it("should load progress from localStorage", () => {
        const progress = initializeWorksheetProgress("test-worksheet")
        localStorageMock["mathcat_worksheet_test-worksheet"] = JSON.stringify(progress)

        const loaded = loadWorksheetProgress("test-worksheet")

        expect(loaded).toEqual(progress)
      })

      it("should return null if no progress exists", () => {
        const loaded = loadWorksheetProgress("nonexistent")

        expect(loaded).toBeNull()
      })

      it("should handle load errors gracefully", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()
        getItemSpy.mockImplementation(() => {
          throw new Error("Storage error")
        })

        const loaded = loadWorksheetProgress("test-worksheet")

        expect(loaded).toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to load worksheet progress:",
          expect.any(Error)
        )
        consoleSpy.mockRestore()
      })

      it("should handle invalid JSON gracefully", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()
        localStorageMock["mathcat_worksheet_test"] = "invalid json"

        const loaded = loadWorksheetProgress("test")

        expect(loaded).toBeNull()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })
    })

    describe("clearWorksheetProgress", () => {
      it("should remove progress from localStorage", () => {
        const progress = initializeWorksheetProgress("test-worksheet")
        localStorageMock["mathcat_worksheet_test-worksheet"] = JSON.stringify(progress)

        clearWorksheetProgress("test-worksheet")

        expect(removeItemSpy).toHaveBeenCalledWith("mathcat_worksheet_test-worksheet")
      })

      it("should handle clear errors gracefully", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()
        removeItemSpy.mockImplementation(() => {
          throw new Error("Storage error")
        })

        clearWorksheetProgress("test-worksheet")

        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to clear worksheet progress:",
          expect.any(Error)
        )
        consoleSpy.mockRestore()
      })
    })
  })
})
