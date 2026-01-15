import { create } from 'zustand'
import { Node, Edge, Connection, addEdge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'

export type NodeType = 'text' | 'image' | 'llm'

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error'

export interface WorkflowNodeData {
  type: NodeType
  // Execution State
  status?: ExecutionStatus
  output?: string
  executionTime?: number
  // Validation State
  error?: string
  // Content State
  text?: string
  [key: string]: any
}

export interface WorkflowState {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  addNode: (node: Node<WorkflowNodeData>) => void
  addNodeByType: (type: NodeType, position: { x: number; y: number }) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  updateNode: (nodeId: string, updates: Partial<Node<WorkflowNodeData>>) => void
  removeNode: (nodeId: string) => void
  onConnect: (connection: Connection) => void
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  addNodeByType: (type, position) =>
    set((state) => {
      const newNode: Node<WorkflowNodeData> = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { type },
      }
      return {
        nodes: [...state.nodes, newNode],
      }
    }),
  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })),
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, ...updates }
          : node
      ),
    })),
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),
  onConnect: (connection) =>
    set((state) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        return state
      }

      // Check for duplicate edges
      const isDuplicate = state.edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle
      )

      if (isDuplicate) {
        return state
      }

      // Create edge with unique ID
      const newEdge = addEdge(
        {
          ...connection,
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        },
        state.edges
      )

      // Clear errors on source and target nodes when connected
      // This allows the user to retry "Run" after fixing connectivity issues
      const newNodes = state.nodes.map((node) => {
        if (node.id === connection.source || node.id === connection.target) {
          return {
            ...node,
            data: {
              ...node.data,
              error: undefined,
              status: 'idle' as ExecutionStatus,
              output: undefined
            },
          }
        }
        return node
      })

      return {
        edges: newEdge,
        nodes: newNodes,
      }
    }),
  onNodesChange: (changes: NodeChange[]) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),
  onEdgesChange: (changes: EdgeChange[]) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),
}))
