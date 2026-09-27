import { BrowserRouter, Route, Routes } from 'react-router';
import SessionsPage from './pages/SessionsPage';
import CreateSessionPage from './pages/CreateSessionPage';
import EditSessionPage from './pages/EditSessionPage';
import { Toaster } from 'react-hot-toast';

export default function App() {

  
  return (
    
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 1500,
          style: {
            background: '#1f2937',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path='/create' element={<CreateSessionPage />}/>
        <Route path='/edit/:id' element={<EditSessionPage />} />
        <Route path='/' element={<SessionsPage />}/>
      </Routes>
    </BrowserRouter>
  );
}