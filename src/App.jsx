import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

// Load the city and classic portfolio independently.
const Home = lazy(() => import('./Home'));
const Resume = lazy(() => import('./components/Resume'));
const CityApp = lazy(() => import('./city/CityApp'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<CityApp />} />
          <Route path="/classic" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/city/*" element={<CityApp />} />
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
    
  )
}

export default App
