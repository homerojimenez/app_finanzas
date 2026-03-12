import { AppProvider } from '@/app/providers/AppProvider';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function App() {
  const done = useFinanceStore((s) => s.settings.onboardingCompleted);
  return done ? <AppProvider /> : <OnboardingPage />;
}
