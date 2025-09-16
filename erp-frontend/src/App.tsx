// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import BranchesPage from './pages/Branches/BranchesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Toaster position="bottom-center" />
        <BranchesPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
