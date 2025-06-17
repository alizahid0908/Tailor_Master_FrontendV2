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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Search, User, Plus, Users } from 'lucide-react-native';

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

export default function CustomersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSearch = (text) => {
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
        <Text style={styles.customerContact}>{item.phone}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
        <View style={styles.customerStats}>
          <Text style={styles.customerStatsText}>
            {item.measurements} Measurements • {item.orders} Orders
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
          <Users size={64} color={Colors.light.gray[300]} />
          <Text style={styles.emptyText}>No customers found</Text>
          <Text style={styles.emptySubtext}>
            Try a different search or add a new customer
          </Text>
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
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/customers/add')}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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