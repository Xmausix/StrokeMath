import { ref, onMounted, onUnmounted } from 'vue'
import type { Point } from '../types/drawing'
import { useDrawingStore } from '../stores/drawingStore'
import { getCanvasPoint, setupCanvas, drawLine } from '../utils/canvas'

export function useDrawing() {
  const store = useDrawingStore()
  const canvas = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const isDrawing = ref(false)
  const lastPoint = ref<Point>({ x: 0, y: 0 })

  const initCanvas = () => {
    if (!canvas.value || !ctx.value) return
    setupCanvas(canvas.value, ctx.value)
    redrawCanvas()
  }

  const startDrawing = (e: MouseEvent) => {
    if (e.button !== 0 || !canvas.value) return
    isDrawing.value = true
    lastPoint.value = getCanvasPoint(e, canvas.value, store.offset, store.scale)
    store.startNewPath(lastPoint.value)
  }

  const draw = (e: MouseEvent) => {
    if (!isDrawing.value || !ctx.value || !canvas.value) return

    const currentPoint = getCanvasPoint(e, canvas.value, store.offset, store.scale)
    
    drawLine(
      ctx.value,
      lastPoint.value,
      currentPoint,
      store.currentColor,
      store.currentTool === 'pencil' ? 2 : store.currentTool === 'pen' ? 4 : store.eraserSize,
      store.currentTool === 'eraser'
    )

    store.addPointToCurrentPath(currentPoint)
    lastPoint.value = currentPoint
  }

  const stopDrawing = () => {
    if (isDrawing.value) {
      isDrawing.value = false
      store.finishCurrentPath()
    }
  }

  const redrawCanvas = () => {
    if (!ctx.value || !canvas.value) return
    ctx.value.setTransform(1, 0, 0, 1, 0, 0)
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.value.setTransform(store.scale, 0, 0, store.scale, store.offset.x, store.offset.y)
    
    store.paths.forEach(path => {
      if (!ctx.value || path.points.length < 2) return
      for (let i = 1; i < path.points.length; i++) {
        drawLine(
          ctx.value,
          path.points[i - 1],
          path.points[i],
          path.color,
          path.width,
          path.tool === 'eraser'
        )
      }
    })
  }

  onMounted(() => {
    if (canvas.value) {
      ctx.value = canvas.value.getContext('2d')
      initCanvas()
      window.addEventListener('resize', initCanvas)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', initCanvas)
  })

  return {
    canvas,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas
  }
}