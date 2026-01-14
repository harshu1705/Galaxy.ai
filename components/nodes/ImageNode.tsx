import { Handle, Position } from 'reactflow'
import { WorkflowNodeData } from '@/src/store/workflowStore'

export default function ImageNode({ data }: { data: WorkflowNodeData }) {
  const hasError = !!data.error

  return (
    <div className={`bg-gray-800 rounded-lg border shadow-lg min-w-[280px] ${hasError ? 'border-red-500' : 'border-gray-700'}`}>
      <div className="px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-200">Image</h3>
      </div>
      <div className="p-4">
        <div className="w-full h-48 bg-gray-900 border-2 border-dashed border-gray-700 rounded flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500">Image preview</span>
        </div>
        {hasError && (
          <div className="text-xs text-red-400 font-medium">
            {data.error}
          </div>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500 border-2 border-gray-700"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500 border-2 border-gray-700"
      />
    </div>
  )
}
