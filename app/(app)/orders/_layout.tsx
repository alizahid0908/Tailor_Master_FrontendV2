import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function OrdersLayout() {
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
          title: 'Orders',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Order',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Order Details',
          headerShown: true,
        }}
      />
    </Stack>
  );
}