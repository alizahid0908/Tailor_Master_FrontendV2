import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Clock, Check, CircleAlert as AlertCircle, TrendingUp, Users, ShoppingBag } from 'lucide-react-native';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: Colors.light.accent + '10' }]}>
              <Clock size={24} color={Colors.light.accent} />
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: Colors.light.success + '10' }]}>
              <Check size={24} color={Colors.light.success} />
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Delivered</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: Colors.light.error + '10' }]}>
              <AlertCircle size={24} color={Colors.light.error} />
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Overdue</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <TrendingUp size={24} color={Colors.light.primary} />
                <Text style={styles.metricValue}>$12,450</Text>
              </View>
              <Text style={styles.metricLabel}>Monthly Revenue</Text>
              <Text style={styles.metricChange}>+15% from last month</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Users size={24} color={Colors.light.primary} />
                <Text style={styles.metricValue}>156</Text>
              </View>
              <Text style={styles.metricLabel}>Total Customers</Text>
              <Text style={styles.metricChange}>+8 new this month</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <ShoppingBag size={24} color={Colors.light.primary} />
                <Text style={styles.metricValue}>34</Text>
              </View>
              <Text style={styles.metricLabel}>Orders This Month</Text>
              <Text style={styles.metricChange}>+12% from last month</Text>
            </View>
          </View>
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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[600],
    marginTop: 4,
  },
  metricsContainer: {
    gap: 16,
  },
  metricCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.light.text,
  },
  metricLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[600],
    marginBottom: 4,
  },
  metricChange: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.success,
  },
});