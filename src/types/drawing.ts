export type Tool = 'pencil' | 'pen' | 'eraser'
export type Color = 'white' | 'blue' | 'red'

export interface Point {
  x: number
  y: number
}

export interface DrawingPath {
  points: Point[]
  tool: Tool
  color: Color
  width: number
}