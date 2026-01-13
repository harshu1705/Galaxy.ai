# System Architecture: Galaxy.ai Workflow Builder

## 1. Frontend Responsibilities (UI Layer)
The Frontend serves as the interactive presentation layer, utilizing **Next.js App Router** for the application shell and **React Flow** for the canvas. It remains strictly decoupled from business logic and direct API communication.

*   **Canvas Rendering**:
    *   Renders the infinite grid, nodes, and edges based on data provided by the Store.
    *   Handles visual interactions like panning (middle-mouse) and zooming.
    *   delegates node-specific interactions (drag, click) to the Store.
*   **Node Presentation**:
    *   Displays node data (inputs, previews, status indicators).
    *   Captures user input (typing in text areas, adjusting sliders) and immediately dispatches updates to the Store.
*   **Feedback Display**:
    *   Reflects "Loading" or "Error" states visually on specific nodes based on the Store execution status.
    *   Does NOT perform validation logic itself.

## 2. State Management Responsibilities (Store Layer)
**Zustand** acts as the single source of truth for the entire application state. It manages the complete graph structure and execution lifecycle.

*   **Graph State**:
    *   Maintains lists of `nodes` and `edges`.
    *   Handles atomic actions: `addNode`, `removeNode`, `updateNodeData`, `onConnect` (edge creation).
*   **Execution State**:
    *   Tracks the `executionStatus` of each node (IDLE, RUNNING, COMPLETED, ERROR).
    *   Stores output data (generated text, image URLs) within the respective node objects.
*   **Action Dispatcher**:
    *   Centralizes all state mutations. The UI never modifies state directly; it calls actions like `updatePrompt` or `setNodeStatus`.

## 3. Validation Flow (Logic Layer)
Validation is a distinct phase that occurs **before** any execution attempts. It ensures the workflow graph is structurally sound.

1.  **Trigger**: User clicks "Run" on an LLM or Image node.
2.  **Structural Check (DAG)**:
    *   The system traverses the graph backwards from the target node.
    *   Verifies that the graph is Acyclic (no infinite loops).
3.  **Input Integrity (Zod)**:
    *   Checks that all required upstream inputs are connected.
    *   Validates that input fields are not empty or malformed.
4.  **Outcome**:
    *   **Pass**: Proceeds to Execution Flow.
    *   **Fail**: Stops immediately; updates the target node state to `ERROR` with a specific message (e.g., "Missing input source").

## 4. Execution Flow (API Layer)
This layer handles the actual communication with the AI models via the **Gemini API**. It is triggered only after successful validation.

1.  **Context Assembly**:
    *   The system gathers data from all upstream nodes required for the target node.
    *   Formatting: Combines text prompts and parameters into the correct payload structure for the API.
2.  **State Transition (Start)**:
    *   Target node status updates to `RUNNING`.
    *   UI shows a loading spinner on the node.
3.  **API Request**:
    *   Sends an asynchronous request to the Next.js API route (server-side).
    *   Server securely communicates with Gemini API to prevent key exposure.
4.  **Response Handling**:
    *   **Success**:
        *   Receives generated content (text or image data).
        *   Updates target node data with the result.
        *   Sets node status to `COMPLETED`.
    *   **Failure**:
        *   Catches network or API errors.
        *   Sets node status to `ERROR` with a user-friendly error message.

## 5. Persistence Flow (Data Layer)
Persistence is lightweight and client-side focused, allowing users to save their work without authentication.

*   **Serialization (Save)**:
    *   Extracts the current `nodes` and `edges` arrays from the Zustand store.
    *   Converts the object graph into a standard JSON string.
    *   Triggers a browser file download (e.g., `workflow.json`).
*   **Deserialization (Load)**:
    *   Parses an uploaded JSON file.
    *   Validates the structure against a schema to prevent crashing.
    *   Replaces the entire current Zustand store with the loaded data, effectively restoring the session.

---

## Data Flow Example: Running an LLM Node

1.  **User Action**: User types a prompt in a *Text Node* linked to an *LLM Node* and clicks "Run".
2.  **Validation**:
    *   System confirms *Text Node* has content.
    *   System confirms the link exists.
3.  **State Update**: *LLM Node* set to `RUNNING`. UI shows spinner.
4.  **Execution**:
    *   Text is retrieved from the *Text Node*.
    *   Payload sent to `/api/generate`.
    *   Gemini processes the request.
5.  **Completion**:
    *   Result received.
    *   *LLM Node* data updated with response text.
    *   Status set to `COMPLETED`.
    *   UI re-renders to display the response inline.
