import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Search, User, ChevronRight } from 'lucide-react-native';

// Sample data for demonstration
const customersData = [
  { id: '1', name: 'John Smith', phone: '+1 234 567 8901', email: 'john@example.com', measurements: 3, orders: 2 },
  { id: '2', name: 'Maria Garcia', phone: '+1 234 567 8902', email: 'maria@example.com', measurements: 5, orders: 1 },
  { id: '3', name: 'Alex Johnson', phone: '+1 234 567 8903', email: 'alex@example.com', measurements: 2, orders: 0 },
  { id: '4', name: 'Sarah Williams', phone: '+1 234 567 8904', email: 'sarah@example.com', measurements: 4, orders: 3 },
  { id: '5', name: 'Robert Brown', phone: '+1 234 567 8905', email: 'robert@example.com', measurements: 1, orders: 1 },
  { id: '6', name: 'Emily Davis', phone: '+1 234 567 8906', email: 'emily@example.com', measurements: 6, orders: 4 },
  { id: '7', name: 'Michael Wilson', phone: '+1 234 567 8907', email: 'michael@example.com', measurements: 2, orders: 2 },
  { id: '8', name: 'Lisa Martinez', phone: '+1 234 567 8908', email: 'lisa@example.com', measurements: 3, orders: 1 },
];

export default function SelectCustomerScreen() {
  const router = useRouter();
  const { customerId: preselectedCustomerId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Simulate search loading for a better UX
    if (text.length > 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  };
  
  const filteredCustomers = customersData.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerSelect = (customerId: string) => {
    router.push({
      pathname: '/orders/create/measurements',
      params: { customerId }
    });
  };

  // If customer is preselected, automatically navigate to measurements
  React.useEffect(() => {
    if (preselectedCustomerId) {
      handleCustomerSelect(preselectedCustomerId as string);
    }
  }, [preselectedCustomerId]);
  
  const renderCustomerItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => handleCustomerSelect(item.id)}
    >
      <View style={styles.customerIconContainer}>
        <User size={24} color={Colors.light.primary} />
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerContact}>{item.phone}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
        <View style={styles.customerStats}>
          <Text style={styles.customerStatsText}>
            {item.measurements} Measurements • {item.orders} Orders
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color={Colors.light.gray[400]} />
    </TouchableOpacity>
  );

  if (preselectedCustomerId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading customer measurements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Customer</Text>
        <Text style={styles.headerSubtitle}>Choose a customer to create an order for</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.light.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            placeholderTextColor={Colors.light.gray[400]}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : filteredCustomers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <User size={64} color={Colors.light.gray[300]} />
          <Text style={styles.emptyText}>No customers found</Text>
          <Text style={styles.emptySubtext}>
            Try a different search or add a new customer
          </Text>
          <TouchableOpacity 
            style={styles.addCustomerButton}
            onPress={() => router.push('/customers/add')}
          >
            <Text style={styles.addCustomerButtonText}>Add New Customer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={renderCustomerItem}
          contentContainerStyle={styles.customersList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.gray[500],
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
    padding: 0,
  },
  clearButton: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  customersList: {
    padding: 24,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 2,
  },
  customerContact: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
    marginBottom: 2,
  },
  customerEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    marginBottom: 4,
  },
  customerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  customerStatsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.gray[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.gray[700],
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addCustomerButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addCustomerButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[600],
    marginTop: 16,
  },
});