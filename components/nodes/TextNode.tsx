import { Handle, Position, NodeProps } from 'reactflow'
import { WorkflowNodeData, useWorkflowStore } from '@/src/store/workflowStore'

export default function TextNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const hasError = !!data.error

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: e.target.value })
  }

  return (
    <div className={`bg-gray-800 rounded-lg border shadow-lg min-w-[280px] ${hasError ? 'border-red-500' : 'border-gray-700'}`}>
      <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-200">Text</h3>
      </div>
      <div className="p-4">
        <textarea
          className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-gray-600 mb-2"
          placeholder="Enter your text..."
          value={data.text || ''}
          onChange={handleChange}
        />
        {hasError && (
          <div className="text-xs text-red-400 font-medium">
            {data.error}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500 border-2 border-gray-700"
      />
    </div>
  )
}
