import { Stack } from 'expo-router';
import { CaseWizardProvider } from '@/features/cases/useCaseWizard';

export default function ConsumerLayout() {
  return (
    <CaseWizardProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="wizard-step1" />
        <Stack.Screen name="wizard-step2" />
        <Stack.Screen name="wizard-step3" />
        <Stack.Screen name="wizard-step4" />
        <Stack.Screen name="wizard-success" />
      </Stack>
    </CaseWizardProvider>
  );
}
