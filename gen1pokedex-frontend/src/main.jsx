import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Create React Query client - caches 30sec, 1 retry on failure, prevents excessive API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,           // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      staleTime: 30000,   // Data considered fresh for 30 seconds
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)