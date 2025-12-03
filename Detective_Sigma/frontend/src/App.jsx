import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
              🔍 Detective Sigma
            </h1>
            <div className="text-center">
              <p className="text-xl text-gray-300 mb-4">
                Welcome, Young Detective!
              </p>
              <p className="text-gray-400">
                Backend API running at: {import.meta.env.VITE_API_URL || 'http://localhost:4000'}
              </p>
              <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">System Status</h2>
                <p className="text-green-400">✅ Frontend: Running</p>
                <p className="text-yellow-400">⏳ Backend: Connecting...</p>
                <p className="text-gray-400 mt-4 text-sm">
                  Full game interface coming soon. Copy your Components and Pages folders to frontend/src/
                </p>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
