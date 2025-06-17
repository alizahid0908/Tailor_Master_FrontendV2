import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function CustomersLayout() {
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
          title: 'Customers',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Customer Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: 'Add Customer',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="measurements/add"
        options={{
          title: 'Add Measurements',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}