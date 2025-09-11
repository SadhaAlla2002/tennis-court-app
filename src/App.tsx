import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { CourtsProvider } from './context/CourtsContext';
import { ReviewsProvider } from './context/ReviewsContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { CourtListPage, CourtDetailPage } from './pages';

// Wrapper component to handle court detail routing
const CourtDetailWrapper: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();

  if (!courtId) {
    navigate('/');
    return null;
  }

  return (
    <CourtDetailPage 
      courtId={courtId} 
      onBackClick={() => navigate('/')} 
    />
  );
};

// Main app routing component
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route 
          path="/" 
          element={
            <CourtListPage 
              onCourtClick={(courtId: string) => navigate(`/court/${courtId}`)} 
            />
          } 
        />
        <Route 
          path="/court/:courtId" 
          element={<CourtDetailWrapper />} 
        />
      </Routes>
    </ErrorBoundary>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <CourtsProvider>
        <ReviewsProvider>
          <AppRoutes />
        </ReviewsProvider>
      </CourtsProvider>
    </Router>
  );
};

export default App;
