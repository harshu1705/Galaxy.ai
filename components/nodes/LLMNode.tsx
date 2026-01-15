import { Handle, Position, NodeProps } from 'reactflow'
import { WorkflowNodeData, useWorkflowStore } from '@/src/store/workflowStore'
import { validateWorkflow } from '@/lib/validateWorkflow'

// Use NodeProps to get id passed by ReactFlow
export default function LLMNode({ id, data }: NodeProps<WorkflowNodeData>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const updateNode = useWorkflowStore((state) => state.updateNode)

  const status = data.status || 'idle'
  const isRunning = status === 'running'

  const handleRun = async () => {
    // 1. Transition to RUNNING
    // Clear previous errors/outputs to give fresh feedback
    updateNodeData(id, {
      status: 'running',
      error: undefined,
      output: undefined
    })

    // Lock node interaction
    updateNode(id, { draggable: false })

    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get current state from store directly to avoid re-renders subscription
    const { nodes, edges } = useWorkflowStore.getState()

    // 2. Validate
    const validation = validateWorkflow(id, nodes, edges)

    if (!validation.isValid) {
      // VALIDATION ERROR
      updateNodeData(id, {
        status: 'error',
        error: validation.error
      })
      updateNode(id, { draggable: true }) // Unlock
      return
    }

    // 3. EXECUTION (Mock)
    try {
      // Collect inputs from connected nodes
      const incomingEdges = edges.filter(edge => edge.target === id)
      const inputTexts = incomingEdges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        return sourceNode?.data.text
      }).filter(Boolean)

      // Simulate Random API Latency (1.5s - 2.0s)
      const delay = Math.floor(Math.random() * 500) + 1500
      await new Promise(resolve => setTimeout(resolve, delay))

      // Simulate Random Failure (20% chance)
      const shouldFail = Math.random() < 0.2

      if (shouldFail) {
        throw new Error('Failed to generate response. Please retry.')
      }

      const inputSummary = inputTexts.length > 0
        ? `\n\nAnalyzed inputs:\n${inputTexts.map(t => `• "${t}"`).join('\n')}`
        : ''

      // SUCCESS
      updateNodeData(id, {
        status: 'success',
        output: `This is a mock LLM response generated for testing.${inputSummary}`
      })
    } catch (err: any) {
      // EXECUTION ERROR
      const errorMessage = err.message || 'Execution failed: API Timeout'
      updateNodeData(id, {
        status: 'error',
        error: errorMessage
      })
    } finally {
      updateNode(id, { draggable: true }) // Unlock always
    }
  }

  // UI Helper: Get Border Color
  const getBorderColor = () => {
    switch (status) {
      case 'running': return 'border-blue-500 ring-2 ring-blue-500/20'
      case 'success': return 'border-green-500'
      case 'error': return 'border-red-500'
      default: return 'border-gray-700'
    }
  }

  // UI Helper: Get Button Style
  const getButtonStyle = () => {
    if (isRunning) return 'bg-gray-800 text-gray-400 border-gray-700 cursor-wait'
    if (status === 'error') return 'bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700 hover:text-gray-300'
    return 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white'
  }

  return (
    <div className={`bg-gray-800 rounded-lg border shadow-lg min-w-[320px] transition-all duration-300 ${getBorderColor()}`}>
      <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-200">LLM</h3>
        {status === 'success' && <span className="text-xs text-green-400 font-mono">1.5s</span>}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <textarea
            className="w-full h-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter prompt..."
            readOnly={isRunning}
            disabled={isRunning}
          />
        </div>
        <button
          onClick={handleRun}
          className={`w-full px-4 py-2 text-sm font-medium rounded border transition-colors flex items-center justify-center gap-2 ${getButtonStyle()}`}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
              Running...
            </>
          ) : 'Run'}
        </button>
        {data.error && (
          <div className="text-xs text-red-400 font-medium bg-red-900/10 p-2 rounded border border-red-900/20">
            {data.error}
          </div>
        )}
        <div>
          <textarea
            className={`w-full h-32 px-3 py-2 bg-gray-900 border rounded text-sm text-gray-300 placeholder-gray-500 resize-none focus:outline-none transition-colors ${status === 'success' ? 'border-green-500/50 text-white' : 'border-gray-700'
              }`}
            placeholder={status === 'running' ? "Generating..." : "Output will appear here..."}
            readOnly
            value={data.output || ''}
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
