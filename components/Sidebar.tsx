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
  const [isInvalid, setIsInvalid] = useState(false)

  // Reset invalid state when nodes/edges change
  useEffect(() => {
    if (isInvalid) {
      setIsInvalid(false)
      // Optional: Clear errors on change if desired, but prompt says "When validation passes, clear..."
      // We will clear on next Run click to clear existing errors.
    }
  }, [nodes, edges, isInvalid])

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, nodeType: 'text' | 'image' | 'llm') => {
    e.dataTransfer.setData('application/node-type', nodeType)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleRun = () => {
    let hasErrors = false
    const connectedNodeIds = new Set<string>()

    // Simple validation: check if nodes are connected
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    nodes.forEach((node) => {
      let error = ''

      switch (node.type) {
        case 'llm':
          // LLM requires at least one input (incoming connection)
          {
            const hasInput = edges.some(edge => edge.target === node.id)
            if (!hasInput) {
              error = 'LLM node requires at least one input'
            }
          }
          break

        case 'image':
          // Image requires at least one input (incoming connection)
          {
            const hasInput = edges.some(edge => edge.target === node.id)
            if (!hasInput) {
              error = 'Image node requires at least one input'
            }
          }
          break

        case 'text':
          // Text node is always valid
          break
      }

      if (error) {
        hasErrors = true
        updateNodeData(node.id, { error })
      } else {
        // Clear error if it was previously set
        if (node.data.error) {
          updateNodeData(node.id, { error: undefined })
        }
      }
    })

    if (hasErrors) {
      setIsInvalid(true)
    } else {
      setIsInvalid(false)
      // Allow execution later (mock)
      console.log('Workflow is valid, ready to run')
    }
  }

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4 flex flex-col gap-4">
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
