'use client'

import { useCallback, useRef } from 'react'
import ReactFlow, { Background, ReactFlowInstance, Connection } from 'reactflow'
import 'reactflow/dist/style.css'
import { useWorkflowStore } from '@/src/store/workflowStore'
import TextNode from './nodes/TextNode'
import ImageNode from './nodes/ImageNode'
import LLMNode from './nodes/LLMNode'
import type { NodeType } from '@/src/store/workflowStore'

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  llm: LLMNode,
}

export default function Canvas() {
  const { nodes, edges, onConnect, addNodeByType } = useWorkflowStore()
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance
  }, [])

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Must have both source and target
      if (!connection.source || !connection.target) {
        return false
      }

      // No self-connections
      if (connection.source === connection.target) {
        return false
      }

      // Find source and target nodes
      const sourceNode = nodes.find((node) => node.id === connection.source)
      const targetNode = nodes.find((node) => node.id === connection.target)

      if (!sourceNode || !targetNode) {
        return false
      }

      const sourceType = sourceNode.data.type
      const targetType = targetNode.data.type

      // LLM cannot be a source (no output handle)
      if (sourceType === 'llm') {
        return false
      }

      // Text cannot be a target (no input handle)
      if (targetType === 'text') {
        return false
      }

      // Image cannot connect to Image
      if (sourceType === 'image' && targetType === 'image') {
        return false
      }

      // All other combinations are valid:
      // Text → LLM ✅
      // Text → Image ✅
      // Image → LLM ✅

      return true
    },
    [nodes]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      if (!reactFlowInstance.current) {
        return
      }

      const nodeType = e.dataTransfer.getData('application/node-type') as NodeType

      if (!nodeType || !['text', 'image', 'llm'].includes(nodeType)) {
        return
      }

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      })

      // Center node on cursor (approximate node dimensions)
      const nodeWidth = nodeType === 'llm' ? 320 : 280
      const nodeHeight = nodeType === 'text' ? 200 : nodeType === 'image' ? 280 : 400
      const centeredPosition = {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      }

      addNodeByType(nodeType, centeredPosition)
    },
    [addNodeByType]
  )

  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodesConnectable={true}
        nodesDraggable={true}
        elementsSelectable={true}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1}
          color="#4B5563"
          style={{ opacity: 0.3 }}
        />
      </ReactFlow>
    </div>
  )
}
