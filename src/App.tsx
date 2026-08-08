import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Curriculum from './pages/Curriculum';
import TopicReader from './pages/TopicReader';
import Topics from './pages/Topics';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import About from './pages/About';
import Glossary from './pages/Glossary';
import CheatSheet from './pages/CheatSheet';
import Review from './pages/Review';
import { useEffect } from 'react';
import { useTheme } from './hooks/useProgress';
import { requestPersistence } from './lib/storage';

export default function App() {
  useTheme();

  // Ask once per load for durable storage. On Chrome this is granted silently
  // on engagement heuristics and makes the study record exempt from eviction;
  // elsewhere it is a no-op. The answer is not surfaced here — the Progress
  // page reports the resulting state, which is where somebody would look.
  useEffect(() => {
    void requestPersistence();
  }, []);
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
          <Route path="/quiz/missed" element={<Quiz mode="missed" />} />
          <Route path="/quiz/review" element={<Quiz mode="review" />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/review" element={<Review />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
