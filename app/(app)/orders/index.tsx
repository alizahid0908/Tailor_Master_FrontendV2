import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Clock, Check, CircleAlert as AlertCircle, Plus, User } from 'lucide-react-native';

// Sample data for demonstration
const orders = [
  { id: '1', customer: 'John Smith', items: 2, deadline: '2025-06-20', status: 'pending' },
  { id: '2', customer: 'Maria Garcia', items: 1, deadline: '2025-06-10', status: 'delivered' },
  { id: '3', customer: 'Sam Lee', items: 3, deadline: '2025-05-28', status: 'overdue' },
  { id: '4', customer: 'Emily Johnson', items: 2, deadline: '2025-06-22', status: 'pending' },
  { id: '5', customer: 'David Wilson', items: 1, deadline: '2025-06-25', status: 'pending' },
];

export default function OrdersScreen() {
  const router = useRouter();
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return Colors.light.accent;
      case 'delivered':
        return Colors.light.success;
      case 'overdue':
        return Colors.light.error;
      default:
        return Colors.light.gray[500];
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock size={16} color={Colors.light.accent} />;
      case 'delivered':
        return <Check size={16} color={Colors.light.success} />;
      case 'overdue':
        return <AlertCircle size={16} color={Colors.light.error} />;
      default:
        return null;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.orderCard,
        { borderLeftColor: getStatusColor(item.status) }
      ]}
    >
      <View style={styles.orderHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.customer}</Text>
          <View style={styles.orderStatusContainer}>
            {getStatusIcon(item.status)}
            <Text 
              style={[
                styles.orderStatus,
                { color: getStatusColor(item.status) }
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.orderDate}>
          Due {new Date(item.deadline).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderItems}>{item.items} items</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/orders/create')}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
  },
  ordersList: {
    padding: 24,
  },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderStatus: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  orderDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItems: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});