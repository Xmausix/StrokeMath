import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tool, Color, Point, DrawingPath } from '../types/drawing'

export const useDrawingStore = defineStore('drawing', () => {
  const currentTool = ref<Tool>('pencil')
  const currentColor = ref<Color>('white')
  const eraserSize = ref(20)
  const scale = ref(1)
  const offset = ref<Point>({ x: 0, y: 0 })
  const paths = ref<DrawingPath[]>([])
  const redoPaths = ref<DrawingPath[]>([])
  const currentPath = ref<DrawingPath | null>(null)

  const canUndo = computed(() => paths.value.length > 0)
  const canRedo = computed(() => redoPaths.value.length > 0)

  function startNewPath(point: Point) {
    currentPath.value = {
      points: [point],
      tool: currentTool.value,
      color: currentColor.value,
      width: currentTool.value === 'pencil' ? 2 : currentTool.value === 'pen' ? 4 : eraserSize.value
    }
  }

  function addPointToCurrentPath(point: Point) {
    if (currentPath.value) {
      currentPath.value.points.push(point)
    }
  }

  function finishCurrentPath() {
    if (currentPath.value) {
      paths.value.push(currentPath.value)
      redoPaths.value = []
      currentPath.value = null
    }
  }

  function setTool(tool: Tool) {
    currentTool.value = tool
  }

  function setColor(color: Color) {
    currentColor.value = color
  }

  function undo() {
    if (canUndo.value) {
      const path = paths.value.pop()
      if (path) redoPaths.value.push(path)
    }
  }

  function redo() {
    if (canRedo.value) {
      const path = redoPaths.value.pop()
      if (path) paths.value.push(path)
    }
  }

  function updateScale(newScale: number) {
    scale.value = newScale
  }

  function updateOffset(x: number, y: number) {
    offset.value = { x, y }
  }

  return {
    currentTool,
    currentColor,
    eraserSize,
    scale,
    offset,
    paths,
    canUndo,
    canRedo,
    startNewPath,
    addPointToCurrentPath,
    finishCurrentPath,
    setTool,
    setColor,
    undo,
    redo,
    updateScale,
    updateOffset
  }
})