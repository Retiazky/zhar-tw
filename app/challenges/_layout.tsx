import { Stack } from 'expo-router';

export default function ChallengeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="create"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="active" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
