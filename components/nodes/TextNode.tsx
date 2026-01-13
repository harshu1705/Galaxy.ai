import { Handle, Position } from 'reactflow'

export default function TextNode() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg min-w-[280px]">
      <div className="px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-200">Text</h3>
      </div>
      <div className="p-4">
        <textarea
          className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-gray-600"
          placeholder="Enter your text..."
          readOnly
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500 border-2 border-gray-700"
      />
    </div>
  )
}
