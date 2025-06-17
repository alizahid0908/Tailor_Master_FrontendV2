import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { User, Phone, Mail, MapPin, FileText, Plus, CreditCard as Edit, Trash, Scissors } from 'lucide-react-native';

// Sample data for demonstration
const customersData = {
  '1': {
    id: '1',
    name: 'John Smith',
    phone: '+1 234 567 8901',
    email: 'john@example.com',
    address: '123 Main St, New York, NY 10001',
    notes: 'Prefers classic styles. Allergic to wool.',
    measurements: [
      { id: '1', type: 'shirt', chest: 42, waist: 34, sleeve: 25, notes: 'Prefer looser fit around chest' },
      { id: '2', type: 'pants', waist: 34, inseam: 32, outseam: 42, notes: 'Slight taper below knee' },
      { id: '3', type: 'jacket', chest: 42, shoulder: 18.5, sleeve: 25, notes: 'Add extra pocket inside' }
    ],
    orders: [
      { id: '1', date: '2025-05-15', items: 2, status: 'delivered', total: 180 },
      { id: '2', date: '2025-06-20', items: 3, status: 'pending', total: 250 }
    ]
  },
  '2': {
    id: '2',
    name: 'Maria Garcia',
    phone: '+1 234 567 8902',
    email: 'maria@example.com',
    address: '456 Park Ave, Los Angeles, CA 90001',
    notes: 'Prefers bright colors and modern styles.',
    measurements: [
      { id: '1', type: 'dress', bust: 36, waist: 28, hip: 38, notes: 'Likes dresses slightly below knee' },
      { id: '2', type: 'skirt', waist: 28, hip: 38, length: 22, notes: 'Prefers high-waisted' },
      { id: '3', type: 'blouse', bust: 36, shoulder: 16, sleeve: 22, notes: 'Usually rolls up sleeves' }
    ],
    orders: [
      { id: '1', date: '2025-05-10', items: 1, status: 'delivered', total: 120 }
    ]
  }
};

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(customersData[id as string]);
  const [activeTab, setActiveTab] = useState('measurements');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  
  if (!customer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Customer not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveCustomer = () => {
    // In a real app, you would update the customer in your database here
    setCustomer(editedCustomer);
    setIsEditing(false);
    Alert.alert('Success', 'Customer details updated successfully');
  };
  
  const handleDeleteCustomer = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // In a real app, you would delete the customer from your database here
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderCustomerDetails = () => {
    if (isEditing) {
      return (
        <View style={styles.editForm}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.name}
              onChangeText={(text) => setEditedCustomer(prev => ({ ...prev, name: text }))}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.phone}
              onChangeText={(text) => setEditedCustomer(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.email}
              onChangeText={(text) => setEditedCustomer(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={editedCustomer.address}
              onChangeText={(text) => setEditedCustomer(prev => ({ ...prev, address: text }))}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedCustomer.notes}
              onChangeText={(text) => setEditedCustomer(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.editActionButton, styles.cancelButton]}
              onPress={() => {
                setEditedCustomer(customer);
                setIsEditing(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.editActionButton, styles.saveButton]}
              onPress={handleSaveCustomer}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.customerDetails}>
        <View style={styles.detailItem}>
          <Phone size={18} color={Colors.light.gray[500]} />
          <Text style={styles.detailText}>{customer.phone}</Text>
        </View>
        
        {customer.email && (
          <View style={styles.detailItem}>
            <Mail size={18} color={Colors.light.gray[500]} />
            <Text style={styles.detailText}>{customer.email}</Text>
          </View>
        )}
        
        {customer.address && (
          <View style={styles.detailItem}>
            <MapPin size={18} color={Colors.light.gray[500]} />
            <Text style={styles.detailText}>{customer.address}</Text>
          </View>
        )}
        
        {customer.notes && (
          <View style={styles.notesContainer}>
            <View style={styles.detailItem}>
              <FileText size={18} color={Colors.light.gray[500]} />
              <Text style={styles.notesLabel}>Notes</Text>
            </View>
            <Text style={styles.notesText}>{customer.notes}</Text>
          </View>
        )}
      </View>
    );
  };
  
  const renderMeasurementsTab = () => (
    <View style={styles.tabContent}>
      {customer.measurements.map((measurement) => (
        <TouchableOpacity 
          key={measurement.id}
          style={styles.measurementCard}
          onPress={() => router.push({
            pathname: '/customers/measurements/[id]',
            params: { 
              id: measurement.id,
              customerId: customer.id,
              type: measurement.type
            }
          })}
        >
          <View style={styles.measurementHeader}>
            <Text style={styles.measurementType}>{measurement.type}</Text>
            <TouchableOpacity>
              <Edit size={18} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.measurementDetails}>
            {Object.entries(measurement)
              .filter(([key]) => !['id', 'type', 'notes'].includes(key))
              .map(([key, value]) => (
                <View key={key} style={styles.measurementItem}>
                  <Text style={styles.measurementItemLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Text style={styles.measurementItemValue}>{`${value} in`}</Text>
                </View>
              ))}
          </View>
          
          {measurement.notes && (
            <View style={styles.measurementNotes}>
              <Text style={styles.measurementNotesLabel}>Notes:</Text>
              <Text style={styles.measurementNotesText}>{measurement.notes}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push({
          pathname: '/customers/measurements/[id]',
          params: { customerId: customer.id }
        })}
      >
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Measurements</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderOrdersTab = () => (
    <View style={styles.tabContent}>
      {customer.orders.map((order) => (
        <TouchableOpacity 
          key={order.id}
          style={styles.orderCard}
        >
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderDate}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
              <View style={styles.orderStatus}>
                <View 
                  style={[
                    styles.statusDot, 
                    { 
                      backgroundColor: order.status === 'delivered' 
                        ? Colors.light.success 
                        : Colors.light.accent 
                    }
                  ]} 
                />
                <Text 
                  style={[
                    styles.statusText, 
                    { 
                      color: order.status === 'delivered' 
                        ? Colors.light.success 
                        : Colors.light.accent 
                    }
                  ]}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.orderTotal}>${order.total}</Text>
              <Text style={styles.orderItems}>{order.items} item{order.items > 1 ? 's' : ''}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push({
          pathname: '/orders/create',
          params: { customerId: customer.id }
        })}
      >
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Create New Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerActions}>
          {isEditing ? (
            
            <View style={styles.editingIndicator}>
              <Text style={styles.editingText}>Editing Customer</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Edit size={20} color={Colors.light.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteCustomer}
              >
                <Trash size={20} color={Colors.light.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
        
        <View style={styles.profile}>
          <View style={styles.profileIconContainer}>
            <User size={36} color={Colors.light.primary} />
          </View>
          <Text style={styles.customerName}>{customer.name}</Text>
          
          {renderCustomerDetails()}
        </View>
        
        {!isEditing && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabsHeader}>
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'measurements' && styles.activeTab
                ]}
                onPress={() => setActiveTab('measurements')}
              >
                <Scissors 
                  size={18} 
                  color={activeTab === 'measurements' ? Colors.light.primary : Colors.light.gray[500]} 
                />
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'measurements' && styles.activeTabText
                  ]}
                >
                  Measurements
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tab, 
                  activeTab === 'orders' && styles.activeTab
                ]}
                onPress={() => setActiveTab('orders')}
              >
                <FileText 
                  size={18} 
                  color={activeTab === 'orders' ? Colors.light.primary : Colors.light.gray[500]} 
                />
                <Text 
                  style={[
                    styles.tabText, 
                    activeTab === 'orders' && styles.activeTabText
                  ]}
                >
                  Orders
                </Text>
              </TouchableOpacity>
            </View>
            
            {activeTab === 'measurements' ? renderMeasurementsTab() : renderOrdersTab()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 16,
  },
  editingIndicator: {
    backgroundColor: Colors.light.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  customerName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 8,
  },
  customerDetails: {
    width: '100%',
    paddingHorizontal: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.gray[700],
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[700],
  },
  notesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.gray[700],
    marginLeft: 30,
    marginTop: 4,
  },
  editForm: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[700],
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.gray[100],
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[700],
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  tabsContainer: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[500],
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  tabContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  measurementCard: {
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
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  measurementType: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  measurementDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementItem: {
    width: '48%',
    marginBottom: 12,
  },
  measurementItemLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    marginBottom: 2,
  },
  measurementItemValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
  },
  measurementNotes: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray[200],
  },
  measurementNotesLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[600],
    marginBottom: 4,
  },
  measurementNotesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  orderTotal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'right',
  },
  orderItems: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    textAlign: 'right',
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.light.gray[600],
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.primary,
  },
});