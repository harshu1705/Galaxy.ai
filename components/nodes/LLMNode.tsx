import { Handle, Position } from 'reactflow'
import { WorkflowNodeData } from '@/src/store/workflowStore'

export default function LLMNode({ data }: { data: WorkflowNodeData }) {
  const hasError = !!data.error

  return (
    <div className={`bg-gray-800 rounded-lg border shadow-lg min-w-[320px] ${hasError ? 'border-red-500' : 'border-gray-700'}`}>
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
          className={`w-full px-4 py-2 text-sm font-medium rounded border transition-colors ${hasError
              ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
              : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white'
            }`}
          disabled={hasError}
        >
          Run
        </button>
        {hasError && (
          <div className="text-xs text-red-400 font-medium">
            {data.error}
          </div>
        )}
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
