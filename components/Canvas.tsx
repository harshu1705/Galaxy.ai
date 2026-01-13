'use client'

import ReactFlow, { Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { useWorkflowStore } from '@/src/store/workflowStore'

export default function Canvas() {
  const { nodes, edges, onConnect } = useWorkflowStore()

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
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
