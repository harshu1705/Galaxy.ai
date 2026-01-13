'use client'

import ReactFlow, { Background } from 'reactflow'
import 'reactflow/dist/style.css'

export default function Canvas() {
  return (
    <div className="h-full w-full">
      <ReactFlow
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
