import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useSizes } from '@/hooks/useSizes';

const measurementTypes = [
  { 
    id: 'shirt', 
    label: 'Shirt',
    fields: [
      { id: 'collar_size', label: 'Collar', type: 'number' },
      { id: 'chest_size', label: 'Chest', type: 'number' },
      { id: 'waist_size', label: 'Waist', type: 'number' },
      { id: 'shoulder_size', label: 'Shoulder Width', type: 'number' },
      { id: 'sleeve_length', label: 'Sleeve Length', type: 'number' },
      { id: 'shirt_length', label: 'Shirt Length', type: 'number' },
    ]
  },
  { 
    id: 'pants', 
    label: 'Pants',
    fields: [
      { id: 'waist_size', label: 'Waist', type: 'number' },
      { id: 'legs_length', label: 'Inseam', type: 'number' },
      { id: 'cuff_size', label: 'Cuff', type: 'number' },
    ]
  },
  { 
    id: 'suit', 
    label: 'Suit',
    fields: [
      { id: 'collar_size', label: 'Collar', type: 'number' },
      { id: 'chest_size', label: 'Chest', type: 'number' },
      { id: 'waist_size', label: 'Waist', type: 'number' },
      { id: 'shoulder_size', label: 'Shoulder Width', type: 'number' },
      { id: 'sleeve_length', label: 'Sleeve Length', type: 'number' },
      { id: 'shirt_length', label: 'Jacket Length', type: 'number' },
      { id: 'legs_length', label: 'Pant Inseam', type: 'number' },
    ]
  },
  { 
    id: 'kurta', 
    label: 'Kurta',
    fields: [
      { id: 'collar_size', label: 'Collar', type: 'number' },
      { id: 'chest_size', label: 'Chest', type: 'number' },
      { id: 'waist_size', label: 'Waist', type: 'number' },
      { id: 'shoulder_size', label: 'Shoulder Width', type: 'number' },
      { id: 'sleeve_length', label: 'Sleeve Length', type: 'number' },
      { id: 'shirt_length', label: 'Kurta Length', type: 'number' },
    ]
  },
  { 
    id: 'shalwar', 
    label: 'Shalwar/Kameez',
    fields: [
      { id: 'collar_size', label: 'Collar', type: 'number' },
      { id: 'chest_size', label: 'Chest', type: 'number' },
      { id: 'waist_size', label: 'Waist', type: 'number' },
      { id: 'shoulder_size', label: 'Shoulder Width', type: 'number' },
      { id: 'sleeve_length', label: 'Sleeve Length', type: 'number' },
      { id: 'shirt_length', label: 'Kameez Length', type: 'number' },
      { id: 'legs_length', label: 'Shalwar Length', type: 'number' },
      { id: 'cuff_size', label: 'Shalwar Bottom', type: 'number' },
    ]
  }
];

export default function AddMeasurementScreen() {
  const router = useRouter();
  const { customerId, returnTo } = useLocalSearchParams();
  const { createSize } = useSizes();
  
  const [selectedType, setSelectedType] = useState('');
  const [sizeName, setSizeName] = useState('');
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a measurement type');
      return;
    }
    
    if (!sizeName.trim()) {
      Alert.alert('Error', 'Please enter a name for this measurement');
      return;
    }
    
    if (Object.keys(measurements).length === 0) {
      Alert.alert('Error', 'Please add at least one measurement');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Convert measurements to numbers and prepare data
      const measurementData: any = {
        customer_id: parseInt(customerId as string),
        size_name: sizeName,
        category: selectedType,
        description: description || undefined,
      };
      
      // Add measurements
      Object.entries(measurements).forEach(([key, value]) => {
        if (value && value.trim()) {
          measurementData[key] = parseFloat(value);
        }
      });
      
      await createSize(measurementData);
      
      Alert.alert(
        'Success',
        'Measurement saved successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Handle different return contexts
              if (returnTo === 'order-creation') {
                // Go back to order creation measurements selection
                router.back();
              } else {
                // Go back to customer details
                router.back();
              }
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save measurement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeasurementChange = (id: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCancel = () => {
    if (returnTo === 'order-creation') {
      // Go back to order creation measurements selection
      router.back();
    } else {
      // Go back to customer details or measurements list
      router.back();
    }
  };

  const renderMeasurementField = (field: any) => {
    return (
      <View key={field.id} style={styles.measurementField}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <View style={styles.measurementValue}>
            <TextInput
              style={styles.inlineInput}
              placeholder="0.0"
              placeholderTextColor={Colors.light.gray[400]}
              keyboardType="numeric"
              value={measurements[field.id] || ''}
              onChangeText={(value) => handleMeasurementChange(field.id, value)}
            />
            <Text style={styles.unitText}>in</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Measurements</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
          >
            <X size={24} color={Colors.light.gray[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.sectionTitle}>Measurement Type</Text>
          
          <View style={styles.typeContainer}>
            {measurementTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  selectedType === type.id && styles.selectedTypeButton
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === type.id && styles.selectedTypeButtonText
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedType && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Measurement Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a name for this measurement"
                  placeholderTextColor={Colors.light.gray[400]}
                  value={sizeName}
                  onChangeText={setSizeName}
                />
              </View>
              
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Measurements</Text>
              
              <View style={styles.measurementsContainer}>
                {measurementTypes
                  .find(type => type.id === selectedType)
                  ?.fields.map(renderMeasurementField)}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add any notes about these measurements"
                  placeholderTextColor={Colors.light.gray[400]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Measurements'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  formContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.gray[100],
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.light.gray[200],
  },
  selectedTypeButton: {
    backgroundColor: Colors.light.primary + '10',
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[700],
  },
  selectedTypeButtonText: {
    color: Colors.light.primary,
  },
  formGroup: {
    marginBottom: 20,
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
  measurementsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  measurementField: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  fieldLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  measurementValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
    width: 60,
    textAlign: 'right',
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[300],
  },
  unitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    marginLeft: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray[200],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.gray[300],
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[700],
  },
  saveButton: {
    flex: 2,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.light.gray[400],
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});