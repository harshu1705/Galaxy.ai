# Feature Scope: Galaxy.ai Workflow Builder (LOCKED)

## 1. Mandatory Features (MVP)
These features are critical for the core functionality and must be implemented.

### Core Canvas
- **Infinite Workspace**: Dark-themed, dot-grid background.
- **Navigation**:
  - Panning via middle-mouse drag or space+drag (Natural interaction).
  - Zooming via scroll wheel.
  - **Constraint**: No dedicated "Hand/Move" tool mode.
- **Selection**: Click to select, drag-box to multi-select.

### Nodes (The "Big Three")
- **Visual Architecture**:
  - Rounded cards with elevated dark background.
  - Input ports on left, Output ports on right.
  - Inline controls (Text areas, sliders).
- **Required Node Types**:
  1. **Text Input Node**: Simple text area for prompt injection.
  2. **LLM Node**: Accepts text input, has "Run" button, outputs text.
    - **Constraint**: Output is displayed **inline only** on the node face. **No separate output node**.
  3. **Image Node**: Accepts text/params, outputs image, features prominent **Preview Area**.

### Connections
- **Edge Rendering**: Smooth Bézier curves with purple accents.
- **Interaction**: Drag-to-connect with snap-to-port behavior.

### UI Shell
- **Sidebar**:
  - Minimal fixed dock on the left.
  - Draggable items for the 3 node types.
  - **Constraint**: No search, no specific categories (flat list).
- **Feedback**:
  - Loading spinners inside nodes (scoped).
  - Red borders/quiet text for errors.

## 2. Optional Features (Nice-to-Have)
These may be implemented if time permits.
- **Minimap**: Bottom-right transparent overlay.
- **Top Bar Actions**: Simple "Share" or "Export" button.
  - **Clarification**: No authentication or user profile features.
- **Keyboard Shortcuts**: Delete, Copy/Paste.

## 3. Out-of-Scope / Forbidden
- **Complex Sidebar**: No folders, no search bar, no collapsible categories.
- **Tool Modes**: No distinct "Select" vs "Pan" tools in a bottom bar.
- **Global Blocking Loaders**: No full-screen spinners.
- **User Accounts/Auth**: Login/Signup logic is strictly out of scope.
- **Backend Integration**: Pure UI state simulation. No actual API calls to LLMs or image generators.
