import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function CreateOrderLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
        },
        headerTintColor: Colors.light.primary,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Select Customer',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="measurements"
        options={{
          title: 'Select Measurements',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Order Details',
          headerShown: true,
        }}
      />
    </Stack>
  );
}