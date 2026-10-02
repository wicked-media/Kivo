import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// (no further module aliases required)
import { motion } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { AuthPage } from '@/components/auth-page';
import { RequireAuth } from '@/components/require-auth';
import { OnboardingView } from '@/components/onboarding';
import { HomeView } from '@/views/home-view';
import { DashboardView } from '@/views/dashboard-view';
import { BillsView } from '@/views/bills-view';
import { SubscriptionsView } from '@/views/subscriptions-view';
import { DocumentsView } from '@/views/documents-view';
import { RemindersView } from '@/views/reminders-view';
import { AskKivoView } from '@/views/ask-view';
import { SettingsView } from '@/views/settings-view';

function App() {
  const navigate = useNavigate();

  return (
    <BrowserRouter>
      <AppShell>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/bills"
              element={
                <RequireAuth>
                  <BillsView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/subscriptions"
              element={
                <RequireAuth>
                  <SubscriptionsView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/documents"
              element={
                <RequireAuth>
                  <DocumentsView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/reminders"
              element={
                <RequireAuth>
                  <RemindersView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/ask"
              element={
                <RequireAuth>
                  <AskKivoView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <RequireAuth>
                  <SettingsView />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/onboarding"
              element={
                <RequireAuth>
                  <OnboardingView onComplete={() => navigate('/dashboard')} />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
