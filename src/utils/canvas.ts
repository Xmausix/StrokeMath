import type { Point } from '../types/drawing'

export function getCanvasPoint(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  offset: Point,
  scale: number
): Point {
  const rect = canvas.getBoundingClientRect()
  return {
    x: (event.clientX - rect.left - offset.x) / scale,
    y: (event.clientY - rect.top - offset.y) / scale
  }
}

export function setupCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string,
  width: number,
  isEraser: boolean
): void {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  
  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = width
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = color
    ctx.lineWidth = width
  }
  
  ctx.stroke()
}