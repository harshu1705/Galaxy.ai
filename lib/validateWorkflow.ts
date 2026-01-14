import type { Node, Edge } from 'reactflow'
import type { WorkflowNodeData } from '@/src/store/workflowStore'
import { hasCycleInGraph, validateNodeInputs } from './graph'

/**
 * Validates if a workflow node can be executed
 * Runs validations in order:
 * 1. Cycle detection (structural correctness)
 * 2. Input completeness (semantic correctness)
 * 
 * @param targetNodeId - The node ID to validate
 * @param nodes - All nodes in the workflow
 * @param edges - All edges in the workflow
 * @returns Validation result with isValid flag and optional error message
 */
export function validateWorkflow(
  targetNodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): { isValid: boolean; error?: string } {
  // Find the target node
  const targetNode = nodes.find((node) => node.id === targetNodeId)
  
  if (!targetNode) {
    return {
      isValid: false,
      error: 'Target node not found',
    }
  }

  // Step 1: Cycle detection (structural correctness)
  // Check if the entire graph contains any cycles
  const cycleResult = hasCycleInGraph(nodes, edges)
  
  if (cycleResult.hasCycle) {
    return {
      isValid: false,
      error: 'Workflow contains a cycle',
    }
  }

  // Step 2: Input completeness (semantic correctness)
  // Check if the target node has all required inputs
  const inputValidation = validateNodeInputs(targetNodeId, nodes, edges)
  
  if (!inputValidation.isValid) {
    return {
      isValid: false,
      error: inputValidation.error || 'Input validation failed',
    }
  }

  // All validations passed
  return {
    isValid: true,
  }
}
