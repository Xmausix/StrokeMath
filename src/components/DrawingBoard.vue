<script setup lang="ts">
import { watch } from 'vue'
import { useDrawingStore } from '../stores/drawingStore'
import { useDrawing } from '../composables/useDrawing'
import { useEventListener } from '@vueuse/core'

const store = useDrawingStore()
const { canvas, startDrawing, draw, stopDrawing, redrawCanvas } = useDrawing()

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    store.updateScale(Math.min(Math.max(0.1, store.scale * delta), 5))
  }
}

const handlePan = (e: MouseEvent) => {
  if (e.buttons === 2) { // Right mouse button
    e.preventDefault()
    store.updateOffset(
      store.offset.x + e.movementX,
      store.offset.y + e.movementY
    )
  }
}

useEventListener(window, 'mouseup', stopDrawing)
useEventListener(window, 'wheel', handleWheel, { passive: false })
useEventListener(window, 'contextmenu', (e) => e.preventDefault())

watch(() => [store.scale, store.offset], redrawCanvas, { deep: true })
</script>

<template>
  <canvas
    ref="canvas"
    class="drawing-board fixed inset-0 cursor-crosshair"
    @mousedown="startDrawing"
    @mousemove="(e) => { draw(e); handlePan(e); }"
    @mouseup="stopDrawing"
  ></canvas>
</template>