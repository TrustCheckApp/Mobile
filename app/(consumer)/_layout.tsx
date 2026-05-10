import { Stack } from 'expo-router';
import { WizardProvider } from '@/wizard/WizardProvider';

export default function ConsumerLayout() {
  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WizardProvider>
  );
}
