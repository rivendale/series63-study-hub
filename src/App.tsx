import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Curriculum from './pages/Curriculum';
import TopicReader from './pages/TopicReader';
import Topics from './pages/Topics';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import About from './pages/About';
import { useTheme } from './hooks/useProgress';

export default function App() {
  useTheme();
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/curriculum/:id" element={<TopicReader />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/quiz/topic/:id" element={<Quiz mode="topic" />} />
          <Route path="/quiz/mock" element={<Quiz mode="mock" />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
