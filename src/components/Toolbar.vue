<script setup lang="ts">
import { useDrawingStore } from '../stores/drawingStore'
import type { Tool, Color } from '../types/drawing'

const store = useDrawingStore()

const tools: Tool[] = ['pencil', 'pen', 'eraser']
const colors: Color[] = ['white', 'blue', 'red']
</script>

<template>
  <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-2 flex gap-2 items-center">
    <button
      v-for="tool in tools"
      :key="tool"
      class="toolbar-button"
      :class="{ active: store.currentTool === tool }"
      @click="store.setTool(tool)"
    >
      {{ tool }}
    </button>

    <div class="h-6 w-px bg-gray-600 mx-2"></div>

    <button
      v-for="color in colors"
      :key="color"
      class="w-8 h-8 rounded-full border-2"
      :class="{ 'border-yellow-400': store.currentColor === color }"
      :style="{ backgroundColor: color }"
      @click="store.setColor(color)"
    ></button>

    <div class="h-6 w-px bg-gray-600 mx-2"></div>

    <input
      v-if="store.currentTool === 'eraser'"
      type="range"
      v-model="store.eraserSize"
      min="5"
      max="50"
      class="w-32"
    >

    <div class="h-6 w-px bg-gray-600 mx-2"></div>

    <button
      class="toolbar-button"
      :disabled="!store.canUndo"
      @click="store.undo()"
    >
      Undo
    </button>

    <button
      class="toolbar-button"
      :disabled="!store.canRedo"
      @click="store.redo()"
    >
      Redo
    </button>
  </div>
</template>