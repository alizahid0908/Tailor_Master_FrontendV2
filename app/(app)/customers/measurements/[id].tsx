import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';

// Sample data for demonstration - in a real app, this would come from your backend
const measurementTypes = [
  { 
    id: 'shirt', 
    label: 'Shirt',
    fields: [
      { id: 'collar', label: 'Collar' },
      { id: 'chest', label: 'Chest' },
      { id: 'waist', label: 'Waist' },
      { id: 'hip', label: 'Hip' },
      { id: 'shoulder', label: 'Shoulder Width' },
      { id: 'sleeve', label: 'Sleeve Length' },
      { id: 'length', label: 'Shirt Length' },
      { id: 'band', label: 'Band Style', type: 'select', options: ['Regular', 'Mandarin', 'Band'] }
    ]
  },
  { 
    id: 'pants', 
    label: 'Pants',
    fields: [
      { id: 'waist', label: 'Waist' },
      { id: 'hip', label: 'Hip' },
      { id: 'inseam', label: 'Inseam' },
      { id: 'outseam', label: 'Outseam' },
      { id: 'thigh', label: 'Thigh' },
      { id: 'knee', label: 'Knee' },
      { id: 'bottom', label: 'Bottom Width' }
    ]
  },
  { 
    id: 'suit', 
    label: 'Suit',
    fields: [
      { id: 'collar', label: 'Collar' },
      { id: 'chest', label: 'Chest' },
      { id: 'waist', label: 'Waist' },
      { id: 'hip', label: 'Hip' },
      { id: 'shoulder', label: 'Shoulder Width' },
      { id: 'sleeve', label: 'Sleeve Length' },
      { id: 'jacketLength', label: 'Jacket Length' },
      { id: 'pantWaist', label: 'Pant Waist' },
      { id: 'inseam', label: 'Inseam' },
      { id: 'outseam', label: 'Outseam' }
    ]
  },
  { 
    id: 'kurta', 
    label: 'Kurta',
    fields: [
      { id: 'collar', label: 'Collar' },
      { id: 'chest', label: 'Chest' },
      { id: 'waist', label: 'Waist' },
      { id: 'hip', label: 'Hip' },
      { id: 'shoulder', label: 'Shoulder Width' },
      { id: 'sleeve', label: 'Sleeve Length' },
      { id: 'length', label: 'Kurta Length' },
      { id: 'band', label: 'Band Style', type: 'select', options: ['Regular', 'Mandarin', 'Band'] }
    ]
  },
  { 
    id: 'shalwar', 
    label: 'Shalwar/Kameez',
    fields: [
      { id: 'collar', label: 'Collar' },
      { id: 'chest', label: 'Chest' },
      { id: 'waist', label: 'Waist' },
      { id: 'hip', label: 'Hip' },
      { id: 'shoulder', label: 'Shoulder Width' },
      { id: 'sleeve', label: 'Sleeve Length' },
      { id: 'kameezLength', label: 'Kameez Length' },
      { id: 'shalwarLength', label: 'Shalwar Length' },
      { id: 'shalwarBottom', label: 'Shalwar Bottom' },
      { id: 'band', label: 'Band Style', type: 'select', options: ['Regular', 'Mandarin', 'Band'] }
    ]
  }
];

export default function MeasurementDetailsScreen() {
  const router = useRouter();
  const { id, customerId, type: initialType } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState(initialType || '');
  const [measurements, setMeasurements] = useState({});
  const [notes, setNotes] = useState('');
  const [expandedField, setExpandedField] = useState(null);

  // In a real app, fetch the measurement data from your backend
  useEffect(() => {
    // Simulated data fetch
    if (id) {
      // Sample data for demonstration
      setMeasurements({
        chest: '42',
        waist: '34',
        sleeve: '25',
        notes: 'Prefer looser fit around chest'
      });
      setNotes('Prefer looser fit around chest');
      setSelectedType(initialType || 'shirt');
    }
  }, [id]);

  const handleSave = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a measurement type');
      return;
    }
    
    if (Object.keys(measurements).length === 0) {
      Alert.alert('Error', 'Please add at least one measurement');
      return;
    }
    
    // In a real app, you would save the measurements to your backend here
    Alert.alert(
      'Success',
      'Measurements saved successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleMeasurementChange = (fieldId, value) => {
    setMeasurements(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderMeasurementField = (field) => {
    const isExpanded = expandedField === field.id;
    
    return (
      <View key={field.id} style={styles.measurementField}>
        <TouchableOpacity
          style={styles.fieldHeader}
          onPress={() => setExpandedField(isExpanded ? null : field.id)}
        >
          <Text style={styles.fieldLabel}>{field.label}</Text>
          {field.type === 'select' ? (
            <View style={styles.selectValue}>
              <Text style={styles.selectText}>
                {measurements[field.id] || field.options[0]}
              </Text>
              {isExpanded ? (
                <ChevronUp size={20} color={Colors.light.gray[500]} />
              ) : (
                <ChevronDown size={20} color={Colors.light.gray[500]} />
              )}
            </View>
          ) : (
            <View style={styles.measurementValue}>
              <TextInput
                style={styles.inlineInput}
                placeholder="0.0"
                placeholderTextColor={Colors.light.gray[400]}
                keyboardType="numeric"
                value={measurements[field.id]}
                onChangeText={(value) => handleMeasurementChange(field.id, value)}
                editable={isEditing}
              />
              <Text style={styles.unitText}>in</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {field.type === 'select' && isExpanded && isEditing && (
          <View style={styles.optionsContainer}>
            {field.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  measurements[field.id] === option && styles.selectedOption
                ]}
                onPress={() => {
                  handleMeasurementChange(field.id, option);
                  setExpandedField(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    measurements[field.id] === option && styles.selectedOptionText
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const selectedTypeData = measurementTypes.find(t => t.id === selectedType);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {id ? 'Measurement Details' : 'Add Measurements'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.light.gray[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.typeHeader}>
            <Text style={styles.sectionTitle}>
              {selectedTypeData?.label || 'Select Type'}
            </Text>
            {id && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Text style={styles.editButtonText}>
                  {isEditing ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {!id && (
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
          )}
          
          {selectedType && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Measurements
              </Text>
              
              <View style={styles.measurementsContainer}>
                {selectedTypeData?.fields.map(renderMeasurementField)}
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
                  value={notes}
                  onChangeText={setNotes}
                  editable={isEditing || !id}
                />
              </View>
            </>
          )}
        </ScrollView>

        {(isEditing || !id) && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  router.back();
                }
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Measurements</Text>
            </TouchableOpacity>
          </View>
        )}
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
  typeHeader: {
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
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 6,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.primary,
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
  },
  unitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[500],
    marginLeft: 4,
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  optionsContainer: {
    backgroundColor: Colors.light.gray[50],
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray[200],
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  selectedOption: {
    backgroundColor: Colors.light.primary + '10',
  },
  optionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedOptionText: {
    color: Colors.light.primary,
    fontFamily: 'Poppins-Medium',
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
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});