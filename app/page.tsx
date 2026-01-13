import Canvas from '@/components/Canvas'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <div className="flex h-full w-full bg-gray-950">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-hidden bg-gray-950">
        <Canvas />
      </main>
    </div>
  )
}
