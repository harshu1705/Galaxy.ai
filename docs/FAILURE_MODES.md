# Failure Modes: Galaxy.ai Workflow Builder

## 1. User & Input Failures
Common errors caused by incomplete or invalid user configuration.

| Failure Mode | Detection | Handling Strategy | User Experience (UX) |
| :--- | :--- | :--- | :--- |
| **Missing Input** | **Pre-flight Validation (Zod)** checks if upstream source or text field is empty. | Block execution request immediately. Do not send API call. | Target node highlights with **Red Border**. Tooltip/message: "Input required." |
| **Invalid Parameters** | **Input handler** detects value out of bounds (e.g., cfg > 20). | Auto-clamp to nearest valid min/max or reject input. | Input field reverts to max value or shows red outline. |
| **Disconnected Node** | **Graph Traversal** finds node has 0 inputs but requires them. | Block execution. | Node input handle flashes red. Message: "Connect an input to run." |

## 2. Graph & Structure Failures
Issues arising from the logic of the workflow connections.

| Failure Mode | Detection | Handling Strategy | User Experience (UX) |
| :--- | :--- | :--- | :--- |
| **Cyclic Dependency** | **DAG Algorithm** (Tological Sort or DFS) during connection attempt or pre-flight. | **Best:** Prevent connection creation. **Callback:** Abort validation. | Connection line turns red/snaps back. Toast: "Cycles not allowed." |
| **Incompatible Types** | **Connection Handler** checks source type (Text) vs target type (Image). | Prevent connection snap. | Line does not snap to port. Cursor shows "forbidden" icon contextually. |
| **Orphaned Workflow** | **Graph Analysis** detects disjointed clusters during full run. | Execute only the cluster containing the triggered node (or user selection). | Non-running nodes remain dimmed/idle. Focus on active path. |

## 3. Execution & API Failures (Gemini)
Failures occurring during the asynchronous communication with the AI backend.

| Failure Mode | Detection | Handling Strategy | User Experience (UX) |
| :--- | :--- | :--- | :--- |
| **API Timeout** | **Client-side Promise** race with logic (e.g., 30s limit). | Abort controller cancels fetch. Request marked failed. | Node status: **Error**. Message: "Request timed out. Try again." |
| **Rate Limit (429)** | **API Response** status 429. | (Optional) Simple exponential backoff or immediate fail for MVP. | Node status: **Error**. Message: "System busy (429). Please wait." |
| **Content Safety Policy** | **API Response** contains "Blocked" flag/safety ratings. | Terminate processing. Do not render partial unsafe content. | Node status: **Blocked**. Message: "Content flagged by safety filters." |
| **Network Disconnect** | **Fetch Error** (Connection refused/offline). | Retry once immediately, then fail. | Node status: **Error**. Message: "Network error. Check connection." |
| **Invalid API Key** | **Server-side auth** check fails (401/403). | Block request at server proxy. | Global/Node Error: "Service configuration error. Contact admin." |

## 4. System & State Failures
Issues related to application state, memory, or persistence.

| Failure Mode | Detection | Handling Strategy | User Experience (UX) |
| :--- | :--- | :--- | :--- |
| **Corrupted Save File** | **JSON Schema Validation** on upload. | Reject file load. Do not mutate current store. | Modal Alert: "Invalid workflow file. Could not load." |
| **Browser Memory Full** | Browser crashes or **Image Generation** fails to render blob. | (Hard to catch gracefully) Chrome kills tab. | *Prevention*: Limit max image history/size in store. |
| **Stale State** | Node running indefinitely (Zombie state). | **Timeout Watchdog** clears status after N seconds of no update. | Reset node to "Idle" or "Error" after timeout. |
