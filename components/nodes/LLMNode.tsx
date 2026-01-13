import { Handle, Position } from 'reactflow'

export default function LLMNode() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg min-w-[320px]">
      <div className="px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-200">LLM</h3>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <textarea
            className="w-full h-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-gray-600"
            placeholder="Enter prompt..."
            readOnly
          />
        </div>
        <button
          className="w-full px-4 py-2 bg-gray-700 text-gray-400 text-sm font-medium rounded border border-gray-600 cursor-not-allowed"
          disabled
        >
          Run
        </button>
        <div>
          <textarea
            className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-gray-600"
            placeholder="Output will appear here..."
            readOnly
          />
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500 border-2 border-gray-700"
      />
    </div>
  )
}
