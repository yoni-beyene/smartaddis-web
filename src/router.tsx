import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Parks from './pages/Parks';
import ParkDetail from './pages/ParkDetail';
import Events from './pages/Events';
import MapPage from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'parks', element: <Parks /> },
      { path: 'parks/:id', element: <ParkDetail /> },
      { path: 'events', element: <Events /> },
      { path: 'map', element: <MapPage /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
]);
