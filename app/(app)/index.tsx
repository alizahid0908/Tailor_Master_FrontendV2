import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Check, CircleAlert as AlertCircle, Plus, User, ChevronRight, Scissors } from 'lucide-react-native';

const windowWidth = Dimensions.get('window').width;

// Sample data for demonstration
const recentCustomers = [
  { id: '1', name: 'John Smith', phone: '+1 234 567 8901', measurements: 3, orders: 2 },
  { id: '2', name: 'Maria Garcia', phone: '+1 234 567 8902', measurements: 5, orders: 1 },
  { id: '3', name: 'Alex Johnson', phone: '+1 234 567 8903', measurements: 2, orders: 0 },
];

const recentOrders = [
  { id: '1', customer: 'John Smith', items: 2, deadline: '2025-06-20', status: 'pending' },
  { id: '2', customer: 'Maria Garcia', items: 1, deadline: '2025-06-10', status: 'delivered' },
  { id: '3', customer: 'Sam Lee', items: 3, deadline: '2025-05-28', status: 'overdue' },
];

export default function HomeScreen() {
  const { user } = useAuth();
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

  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => router.push(`/customers/${item.id}`)}
    >
      <View style={styles.customerIconContainer}>
        <User size={24} color={Colors.light.primary} />
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
        <View style={styles.customerStats}>
          <Text style={styles.customerStatsText}>
            {item.measurements} Measurements • {item.orders} Orders
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color={Colors.light.gray[400]} />
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.orderCard,
        { borderLeftColor: getStatusColor(item.status) }
      ]}
      onPress={() => router.push('/orders')}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderCustomer}>{item.customer}</Text>
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
      <View style={styles.orderDetails}>
        <View style={styles.orderDetail}>
          <Scissors size={16} color={Colors.light.gray[500]} />
          <Text style={styles.orderDetailText}>{item.items} items</Text>
        </View>
        <View style={styles.orderDetail}>
          <Calendar size={16} color={Colors.light.gray[500]} />
          <Text style={styles.orderDetailText}>Due {new Date(item.deadline).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Tailor'}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.stats}
          onPress={() => router.push('/stats')}
        >
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.light.accent + '20' }]}>
              <Clock size={24} color={Colors.light.accent} />
            </View>
            <Text style={styles.statCount}>8</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.light.success + '20' }]}>
              <Check size={24} color={Colors.light.success} />
            </View>
            <Text style={styles.statCount}>24</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.light.error + '20' }]}>
              <AlertCircle size={24} color={Colors.light.error} />
            </View>
            <Text style={styles.statCount}>2</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recentOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ordersList}
            snapToInterval={windowWidth - 48}
            decelerationRate="fast"
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/orders/create')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>New Order</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Customers</Text>
            <TouchableOpacity onPress={() => router.push('/customers')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentCustomers.map(customer => (
            <React.Fragment key={customer.id}>
              {renderCustomerItem({ item: customer })}
            </React.Fragment>
          ))}
          
          <TouchableOpacity 
            style={[styles.addButton, { marginTop: 16 }]}
            onPress={() => router.push('/customers/add')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Add Customer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.gray[500],
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.light.text,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  ordersList: {
    paddingRight: 24,
  },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderLeftWidth: 4,
    width: windowWidth - 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderCustomer: {
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
  orderDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderDetailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  customerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
  },
  customerPhone: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    marginBottom: 4,
  },
  customerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerStatsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.gray[600],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});