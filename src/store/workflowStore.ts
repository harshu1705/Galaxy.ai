import { create } from 'zustand'
import { Node, Edge, Connection, addEdge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'

export type NodeType = 'text' | 'image' | 'llm'

export interface WorkflowNodeData {
  type: NodeType
  error?: string
  [key: string]: any
}

export interface WorkflowState {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  addNode: (node: Node<WorkflowNodeData>) => void
  addNodeByType: (type: NodeType, position: { x: number; y: number }) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  removeNode: (nodeId: string) => void
  onConnect: (connection: Connection) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
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

      return {
        edges: newEdge,
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
