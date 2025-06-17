import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { User, Scissors, Calendar, Package, Minus, Plus, Check } from 'lucide-react-native';
import { useSizesByCustomer } from '@/hooks/useSizes';
import { useOrders } from '@/hooks/useOrders';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { customerId, measurementIds } = useLocalSearchParams();
  
  const { sizes: allSizes, loading } = useSizesByCustomer(customerId as string);
  const { createOrder } = useOrders();
  
  const selectedMeasurementIds = (measurementIds as string).split(',');
  const selectedMeasurements = allSizes.filter(size => 
    selectedMeasurementIds.includes(size.id.toString())
  );

  const [quantities, setQuantities] = useState<Record<string, number>>(
    selectedMeasurements.reduce((acc, measurement) => ({
      ...acc,
      [measurement.id]: 1
    }), {})
  );
  
  const [deadline, setDeadline] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading measurements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedMeasurements.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No measurements found</Text>
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

  const updateQuantity = (measurementId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [measurementId]: Math.max(1, (prev[measurementId] || 1) + change)
    }));
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleCreateOrder = async () => {
    if (!deadline.trim()) {
      Alert.alert('Missing Deadline', 'Please enter a deadline for this order.');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Missing Price', 'Please enter a price for this order.');
      return;
    }

    setIsCreating(true);
    
    try {
      const orderData = {
        customer_id: parseInt(customerId as string),
        size_id: selectedMeasurements.map(m => m.id),
        quantity: selectedMeasurements.map(m => quantities[m.id] || 1),
        price: parseFloat(price),
      };

      await createOrder(orderData);
      
      Alert.alert(
        'Order Created',
        'Order has been created successfully!',
        [
          {
            text: 'View Orders',
            onPress: () => router.replace('/orders')
          },
          {
            text: 'Create Another',
            onPress: () => router.replace('/orders/create')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create order');
    } finally {
      setIsCreating(false);
    }
  };

  const renderMeasurementItem = (measurement: any) => {
    const quantity = quantities[measurement.id] || 1;
    
    return (
      <View key={measurement.id} style={styles.measurementItem}>
        <View style={styles.measurementInfo}>
          <View style={styles.measurementIcon}>
            <Scissors size={20} color={Colors.light.primary} />
          </View>
          <View style={styles.measurementDetails}>
            <Text style={styles.measurementType}>
              {measurement.size_name || measurement.category}
            </Text>
            <Text style={styles.measurementSummary}>
              {measurement.category} • {measurement.description || 'No description'}
            </Text>
          </View>
        </View>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(measurement.id.toString(), -1)}
            disabled={quantity <= 1}
          >
            <Minus 
              size={16} 
              color={quantity <= 1 ? Colors.light.gray[400] : Colors.light.primary} 
            />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(measurement.id.toString(), 1)}
          >
            <Plus size={16} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.customerInfo}>
            <View style={styles.customerIconContainer}>
              <User size={24} color={Colors.light.primary} />
            </View>
            <View>
              <Text style={styles.customerName}>Customer #{customerId}</Text>
              <Text style={styles.headerSubtitle}>Order details and quantities</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Package size={20} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Items & Quantities</Text>
            </View>
            
            {selectedMeasurements.map(renderMeasurementItem)}
            
            <View style={styles.totalSummary}>
              <Text style={styles.totalText}>
                Total Items: {getTotalItems()}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Order Details</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Deadline</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter deadline (e.g., 2025-07-15)"
                placeholderTextColor={Colors.light.gray[400]}
                value={deadline}
                onChangeText={setDeadline}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter total price"
                placeholderTextColor={Colors.light.gray[400]}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any special instructions or notes..."
              placeholderTextColor={Colors.light.gray[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.orderSummary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <Text style={styles.summaryText}>
              {selectedMeasurements.length} type{selectedMeasurements.length !== 1 ? 's' : ''} • {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.disabledButton]}
            onPress={handleCreateOrder}
            disabled={isCreating}
          >
            {isCreating ? (
              <Text style={styles.createButtonText}>Creating Order...</Text>
            ) : (
              <>
                <Check size={20} color="white" />
                <Text style={styles.createButtonText}>Create Order</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  customerName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
  },
  content: {
    padding: 24,
    paddingBottom: 140,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  measurementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  measurementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  measurementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  measurementDetails: {
    flex: 1,
  },
  measurementType: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  measurementSummary: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    minWidth: 24,
    textAlign: 'center',
  },
  totalSummary: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  totalText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.primary,
    textAlign: 'center',
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
    paddingTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray[200],
    padding: 24,
  },
  orderSummary: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  summaryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: Colors.light.gray[400],
  },
  createButtonText: {
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.light.gray[600],
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});