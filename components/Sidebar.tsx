export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4">
      <div className="flex flex-col gap-2">
        <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-colors">
          Text
        </button>
        <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-colors">
          Image
        </button>
        <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-white transition-colors">
          LLM
        </button>
      </div>
    </aside>
  )
}
