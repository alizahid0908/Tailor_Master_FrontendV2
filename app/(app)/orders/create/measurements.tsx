import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { User, Scissors, ChevronRight, Plus } from 'lucide-react-native';
import { useSizesByCustomer } from '@/hooks/useSizes';

export default function SelectMeasurementsScreen() {
  const router = useRouter();
  const { customerId } = useLocalSearchParams();
  const [selectedMeasurements, setSelectedMeasurements] = useState<string[]>([]);
  
  const { sizes: measurements, loading, error } = useSizesByCustomer(customerId as string);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading measurements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
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

  const handleMeasurementToggle = (measurementId: string) => {
    setSelectedMeasurements(prev => {
      if (prev.includes(measurementId)) {
        return prev.filter(id => id !== measurementId);
      } else {
        return [...prev, measurementId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedMeasurements.length === 0) {
      Alert.alert('No Measurements Selected', 'Please select at least one measurement to continue.');
      return;
    }

    router.push({
      pathname: '/orders/create/details',
      params: { 
        customerId,
        measurementIds: selectedMeasurements.join(',')
      }
    });
  };

  const handleAddMeasurement = () => {
    // Navigate to add measurement with proper context
    router.push({
      pathname: '/customers/measurements/add',
      params: { 
        customerId,
        returnTo: 'order-creation' // Add context for proper back navigation
      }
    });
  };

  const renderMeasurementItem = (measurement: any) => {
    const isSelected = selectedMeasurements.includes(measurement.id.toString());
    
    return (
      <TouchableOpacity
        key={measurement.id}
        style={[
          styles.measurementCard,
          isSelected && styles.selectedMeasurementCard
        ]}
        onPress={() => handleMeasurementToggle(measurement.id.toString())}
      >
        <View style={styles.measurementHeader}>
          <View style={styles.measurementInfo}>
            <View style={[
              styles.measurementIcon,
              isSelected && styles.selectedMeasurementIcon
            ]}>
              <Scissors 
                size={20} 
                color={isSelected ? 'white' : Colors.light.primary} 
              />
            </View>
            <View style={styles.measurementDetails}>
              <Text style={[
                styles.measurementType,
                isSelected && styles.selectedMeasurementText
              ]}>
                {measurement.size_name || measurement.category}
              </Text>
              <Text style={[
                styles.measurementSummary,
                isSelected && styles.selectedMeasurementSubtext
              ]}>
                {measurement.category} • {Object.keys(measurement).filter(key => 
                  key.includes('_size') || key.includes('_length')
                ).length} measurements
              </Text>
            </View>
          </View>
          
          <View style={[
            styles.checkbox,
            isSelected && styles.checkedCheckbox
          ]}>
            {isSelected && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
        </View>
        
        {measurement.description && (
          <View style={styles.measurementNotes}>
            <Text style={[
              styles.notesText,
              isSelected && styles.selectedMeasurementSubtext
            ]}>
              {measurement.description}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <View style={styles.customerIconContainer}>
            <User size={24} color={Colors.light.primary} />
          </View>
          <View>
            <Text style={styles.customerName}>Customer #{customerId}</Text>
            <Text style={styles.headerSubtitle}>Select measurements for the order</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Available Measurements</Text>
          <Text style={styles.sectionSubtitle}>
            Select one or more measurements to include in this order
          </Text>
          
          {measurements.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Scissors size={48} color={Colors.light.gray[300]} />
              <Text style={styles.emptyText}>No measurements found</Text>
              <Text style={styles.emptySubtext}>
                Add measurements for this customer to create orders
              </Text>
            </View>
          ) : (
            measurements.map(renderMeasurementItem)
          )}
          
          <TouchableOpacity 
            style={styles.addMeasurementButton}
            onPress={handleAddMeasurement}
          >
            <Plus size={20} color={Colors.light.primary} />
            <Text style={styles.addMeasurementText}>Add New Measurement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionText}>
            {selectedMeasurements.length} measurement{selectedMeasurements.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedMeasurements.length === 0 && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={selectedMeasurements.length === 0}
        >
          <Text style={[
            styles.continueButtonText,
            selectedMeasurements.length === 0 && styles.disabledButtonText
          ]}>
            Continue
          </Text>
          <ChevronRight 
            size={20} 
            color={selectedMeasurements.length === 0 ? Colors.light.gray[400] : 'white'} 
          />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
  },
  measurementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    marginBottom: 20,
  },
  measurementCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedMeasurementCard: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '05',
  },
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  selectedMeasurementIcon: {
    backgroundColor: Colors.light.primary,
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
  selectedMeasurementText: {
    color: Colors.light.primary,
  },
  measurementSummary: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
  },
  selectedMeasurementSubtext: {
    color: Colors.light.primary + 'CC',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  measurementNotes: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray[200],
  },
  notesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
    fontStyle: 'italic',
  },
  addMeasurementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.gray[100],
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.light.gray[200],
    borderStyle: 'dashed',
  },
  addMeasurementText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  selectionSummary: {
    marginBottom: 16,
  },
  selectionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[600],
    textAlign: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: Colors.light.gray[200],
  },
  continueButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  disabledButtonText: {
    color: Colors.light.gray[400],
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