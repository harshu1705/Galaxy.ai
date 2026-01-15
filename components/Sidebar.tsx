'use client'

import { useWorkflowStore } from '@/src/store/workflowStore'
import { useState, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

export default function Sidebar() {
  const { nodes, edges, updateNodeData } = useWorkflowStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      updateNodeData: state.updateNodeData,
    }),
    shallow
  )

  /* Step 8: Persistence Implementation */
  const handleExport = () => {
    const data = {
      nodes,
      edges,
      version: '1.0.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `galaxy-workflow-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)

        // Basic Shape Validation
        if (!Array.isArray(json.nodes) || !Array.isArray(json.edges)) {
          alert('Invalid workflow file: Missing nodes or edges array.')
          return
        }

        // Hydrate Store
        useWorkflowStore.getState().setNodes(json.nodes)
        useWorkflowStore.getState().setEdges(json.edges)
      } catch (err) {
        alert('Failed to parse workflow file.')
        console.error(err)
      }
    }
    reader.readAsText(file)
  }

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, nodeType: 'text' | 'image' | 'llm') => {
    e.dataTransfer.setData('application/node-type', nodeType)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4 flex flex-col gap-4">
      {/* Persistence Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 px-3 py-2 text-xs font-medium text-gray-200 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition-colors"
        >
          Save
        </button>
        <label className="flex-1 px-3 py-2 text-xs font-medium text-gray-200 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition-colors text-center cursor-pointer">
          Load
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="h-px bg-gray-800 my-1" />

      <div className="flex flex-col gap-2">
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, 'text')}
          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-colors cursor-grab active:cursor-grabbing"
        >
          Text
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, 'image')}
          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-colors cursor-grab active:cursor-grabbing"
        >
          Image
        </button>
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, 'llm')}
          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-colors cursor-grab active:cursor-grabbing"
        >
          LLM
        </button>
      </div>
    </aside>
  )
}
