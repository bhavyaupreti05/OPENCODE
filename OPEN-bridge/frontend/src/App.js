import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './components/layout/Layout';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Dashboard from './components/Dashboard';
import LearningPath from './components/LearningPath';
import DocsViewer from './components/DocsViewer';
import ProblemCatalog from './components/ProblemCatalog';
import ProgressTracker from './components/ProgressTracker';
import PracticeSection from './components/PracticeSection';
import ContributionProofSubmit from './components/contribution-proof/ContributionProofSubmit';
import ContributionProofList from './components/contribution-proof/ContributionProofList';
import OpenSourceGuidesList from './components/open-source-guides/OpenSourceGuidesList';
import OpenSourceGuideDetail from './components/open-source-guides/OpenSourceGuideDetail';
import ContributorConsole from './components/contributor-console/ContributorConsole';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learning-path/:id" element={<LearningPath />} />
            <Route path="/docs/:id" element={<DocsViewer />} />
            <Route path="/problems/:id" element={<ProblemCatalog />} />
            <Route path="/practice" element={<PracticeSection />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/contribution-proof/submit" element={<ContributionProofSubmit />} />
            <Route path="/contribution-proof" element={<ContributionProofList />} />
            <Route path="/open-source-guides" element={<OpenSourceGuidesList />} />
            <Route path="/open-source-guides/:id" element={<OpenSourceGuideDetail />} />
            <Route path="/contributor-console" element={<ContributorConsole />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
