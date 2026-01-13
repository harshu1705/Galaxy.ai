'use client'

export default function Sidebar() {
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, nodeType: 'text' | 'image' | 'llm') => {
    e.dataTransfer.setData('application/node-type', nodeType)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4">
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
