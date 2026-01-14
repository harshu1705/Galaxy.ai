import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData } from '@/src/store/workflowStore'

/**
 * Builds an adjacency list representation of the graph
 * Maps each node ID to an array of node IDs it connects to
 */
export function buildAdjacencyList(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>()

  // Initialize all nodes with empty arrays
  nodes.forEach((node) => {
    adjacencyList.set(node.id, [])
  })

  // Build connections from edges
  edges.forEach((edge) => {
    const sourceId = edge.source
    const targetId = edge.target

    if (adjacencyList.has(sourceId) && adjacencyList.has(targetId)) {
      const targets = adjacencyList.get(sourceId) || []
      if (!targets.includes(targetId)) {
        targets.push(targetId)
        adjacencyList.set(sourceId, targets)
      }
    }
  })

  return adjacencyList
}

/**
 * Gets all upstream nodes (ancestors) for a given node
 * Returns a set of node IDs that have a path to the target node
 */
export function getUpstreamNodes(
  nodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Set<string> {
  const upstreamNodes = new Set<string>()
  const adjacencyList = buildAdjacencyList(nodes, edges)

  // Build reverse adjacency list (target -> sources)
  const reverseAdjacencyList = new Map<string, string[]>()
  nodes.forEach((node) => {
    reverseAdjacencyList.set(node.id, [])
  })

  edges.forEach((edge) => {
    const sourceId = edge.source
    const targetId = edge.target

    if (reverseAdjacencyList.has(targetId)) {
      const sources = reverseAdjacencyList.get(targetId) || []
      if (!sources.includes(sourceId)) {
        sources.push(sourceId)
        reverseAdjacencyList.set(targetId, sources)
      }
    }
  })

  // DFS to find all ancestors (starting from the node itself)
  const visited = new Set<string>()
  const stack: string[] = [nodeId]

  while (stack.length > 0) {
    const currentId = stack.pop()!
    
    if (visited.has(currentId)) {
      continue
    }

    visited.add(currentId)

    // Get all nodes that connect to currentId (its parents)
    const parents = reverseAdjacencyList.get(currentId) || []
    parents.forEach((parentId) => {
      if (!visited.has(parentId)) {
        upstreamNodes.add(parentId)
        stack.push(parentId)
      }
    })
  }

  return upstreamNodes
}

/**
 * Detects if adding a new edge would create a cycle in the graph
 * Uses DFS to check if target has a path back to source
 * 
 * @param sourceId - Source node ID
 * @param targetId - Target node ID
 * @param nodes - All nodes in the graph
 * @param edges - All existing edges
 * @returns Object with hasCycle boolean and optional cycle path
 */
export function detectCycle(
  sourceId: string,
  targetId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): { hasCycle: boolean; cyclePath?: string[] } {
  // Self-connections are cycles
  if (sourceId === targetId) {
    return { hasCycle: true, cyclePath: [sourceId, targetId] }
  }

  const adjacencyList = buildAdjacencyList(nodes, edges)

  // Check if target has a path back to source
  // If yes, adding source -> target would create a cycle
  const visited = new Set<string>()
  const stack: string[] = [targetId]
  const path: string[] = []

  while (stack.length > 0) {
    const currentId = stack[stack.length - 1]

    if (visited.has(currentId)) {
      stack.pop()
      path.pop()
      continue
    }

    visited.add(currentId)
    path.push(currentId)

    // If we've reached the source, we have a cycle
    if (currentId === sourceId) {
      return { hasCycle: true, cyclePath: [...path] }
    }

    const neighbors = adjacencyList.get(currentId) || []
    const unvisitedNeighbor = neighbors.find((id) => !visited.has(id))

    if (unvisitedNeighbor) {
      stack.push(unvisitedNeighbor)
    } else {
      stack.pop()
      path.pop()
    }
  }

  return { hasCycle: false }
}

/**
 * Checks if the entire graph contains any cycles
 * Uses DFS to detect back edges
 * 
 * @param nodes - All nodes in the graph
 * @param edges - All edges in the graph
 * @returns Object with hasCycle boolean and optional cycle path
 */
export function hasCycleInGraph(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): { hasCycle: boolean; cyclePath?: string[] } {
  const adjacencyList = buildAdjacencyList(nodes, edges)
  const visited = new Set<string>()
  const recStack = new Set<string>()

  const dfs = (nodeId: string, path: string[]): { hasCycle: boolean; cyclePath?: string[] } => {
    visited.add(nodeId)
    recStack.add(nodeId)
    path.push(nodeId)

    const neighbors = adjacencyList.get(nodeId) || []
    
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        const result = dfs(neighborId, [...path])
        if (result.hasCycle) {
          return result
        }
      } else if (recStack.has(neighborId)) {
        // Found a back edge - cycle detected
        const cycleStart = path.indexOf(neighborId)
        const cyclePath = [...path.slice(cycleStart), neighborId]
        return { hasCycle: true, cyclePath }
      }
    }

    recStack.delete(nodeId)
    return { hasCycle: false }
  }

  // Check each unvisited node (handles disconnected components)
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const result = dfs(node.id, [])
      if (result.hasCycle) {
        return result
      }
    }
  }

  return { hasCycle: false }
}

/**
 * Validates that a node has the required incoming connections based on its type.
 * Text nodes are always valid. Image and LLM nodes require at least one incoming edge.
 */
export function validateNodeInputs(
  nodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): { isValid: boolean; error?: string } {
  const node = nodes.find((n) => n.id === nodeId)

  if (!node) {
    return { isValid: false, error: 'Node not found' }
  }

  const nodeType = node.data.type

  // Text nodes do not require inputs
  if (nodeType === 'text') {
    return { isValid: true }
  }

  // Count incoming edges
  const incomingCount = edges.filter((edge) => edge.target === nodeId).length

  // Image and LLM require at least one input
  if (incomingCount < 1) {
    const label = nodeType === 'image' ? 'Image' : 'LLM'
    return {
      isValid: false,
      error: `${label} node requires at least one input`,
    }
  }

  return { isValid: true }
}
