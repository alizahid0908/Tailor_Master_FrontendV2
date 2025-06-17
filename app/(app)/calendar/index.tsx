import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars';
import { format, addDays, parseISO } from 'date-fns';
import Colors from '@/constants/Colors';
import { ChevronLeft, ChevronRight, Clock, Check, CircleAlert as AlertCircle, Calendar as CalendarIcon } from 'lucide-react-native';

// Sample data for demonstration
const orders = [
  { id: '1', customer: 'John Smith', items: 2, deadline: '2025-06-12', status: 'pending' },
  { id: '2', customer: 'Maria Garcia', items: 1, deadline: '2025-06-12', status: 'delivered' },
  { id: '3', customer: 'Sam Lee', items: 3, deadline: '2025-06-14', status: 'overdue' },
  { id: '4', customer: 'Emily Johnson', items: 2, deadline: '2025-06-16', status: 'pending' },
  { id: '5', customer: 'David Wilson', items: 4, deadline: '2025-06-18', status: 'pending' },
  { id: '6', customer: 'Sarah Brown', items: 1, deadline: '2025-06-20', status: 'pending' },
  { id: '7', customer: 'Michael Davis', items: 2, deadline: '2025-06-22', status: 'delivered' },
];

// Calendar configuration
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};
LocaleConfig.defaultLocale = 'en';

export default function CalendarScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'));
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  
  // Create a week of dates for the horizontal slider
  const weekDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i - 3);
    return {
      date: format(date, 'yyyy-MM-dd'),
      day: format(date, 'd'),
      weekday: format(date, 'EEE')
    };
  });
  
  // Generate marked dates for the calendar
  const generateMarkedDates = () => {
    const markedDates: Record<string, any> = {};
    
    // Mark orders in the calendar
    orders.forEach(order => {
      if (markedDates[order.deadline]) {
        markedDates[order.deadline].dots.push({
          key: order.id,
          color: getStatusColor(order.status),
        });
      } else {
        markedDates[order.deadline] = {
          dots: [{
            key: order.id,
            color: getStatusColor(order.status),
          }],
        };
      }
    });
    
    // Mark selected date
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: Colors.light.primary,
    };
    
    return markedDates;
  };
  
  const getStatusColor = (status: string) => {
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
  
  const getStatusIcon = (status: string) => {
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
  
  // Filter orders for the selected date
  const filteredOrders = orders.filter(order => order.deadline === selectedDate);
  
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.orderCard,
        { borderLeftColor: getStatusColor(item.status) }
      ]}
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
        <Text style={styles.orderDetailText}>{item.items} items</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Calendar</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              view === 'daily' && styles.viewToggleButtonActive
            ]}
            onPress={() => setView('daily')}
          >
            <Text
              style={[
                styles.viewToggleText,
                view === 'daily' && styles.viewToggleTextActive
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              view === 'monthly' && styles.viewToggleButtonActive
            ]}
            onPress={() => setView('monthly')}
          >
            <Text
              style={[
                styles.viewToggleText,
                view === 'monthly' && styles.viewToggleTextActive
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {view === 'daily' ? (
        <>
          <View style={styles.daysContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysScrollContent}
            >
              {weekDates.map((item) => (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.dayItem,
                    selectedDate === item.date && styles.selectedDayItem
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text
                    style={[
                      styles.dayWeekday,
                      selectedDate === item.date && styles.selectedDayText
                    ]}
                  >
                    {item.weekday}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumber,
                      selectedDate === item.date && styles.selectedDayText
                    ]}
                  >
                    {item.day}
                  </Text>
                  
                  {/* Add dots for orders on this day */}
                  <View style={styles.dayDots}>
                    {orders
                      .filter(order => order.deadline === item.date)
                      .slice(0, 3)
                      .map((order, index) => (
                        <View
                          key={index}
                          style={[
                            styles.dayDot,
                            { backgroundColor: getStatusColor(order.status) }
                          ]}
                        />
                      ))}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.selectedDateContainer}>
            <CalendarIcon size={18} color={Colors.light.gray[500]} />
            <Text style={styles.selectedDateText}>
              {format(parseISO(selectedDate), 'MMMM d, yyyy')}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.calendarContainer}>
          <RNCalendar
            markingType={'multi-dot'}
            markedDates={generateMarkedDates()}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              calendarBackground: Colors.light.background,
              textSectionTitleColor: Colors.light.gray[600],
              selectedDayBackgroundColor: Colors.light.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.light.primary,
              dayTextColor: Colors.light.text,
              textDisabledColor: Colors.light.gray[400],
              dotColor: Colors.light.primary,
              selectedDotColor: '#ffffff',
              arrowColor: Colors.light.primary,
              monthTextColor: Colors.light.text,
              indicatorColor: Colors.light.primary,
              textDayFontFamily: 'Poppins-Regular',
              textMonthFontFamily: 'Poppins-SemiBold',
              textDayHeaderFontFamily: 'Poppins-Medium',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13
            }}
            renderArrow={(direction) => 
              direction === 'left' 
                ? <ChevronLeft size={20} color={Colors.light.primary} /> 
                : <ChevronRight size={20} color={Colors.light.primary} />
            }
          />
        </View>
      )}
      
      <View style={styles.ordersContainer}>
        <View style={styles.ordersHeader}>
          <Text style={styles.ordersTitle}>
            Orders {filteredOrders.length > 0 ? `(${filteredOrders.length})` : ''}
          </Text>
        </View>
        
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CalendarIcon size={48} color={Colors.light.gray[300]} />
            <Text style={styles.emptyText}>No orders for this date</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.ordersList}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.light.gray[100],
    borderRadius: 8,
    padding: 4,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.light.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[500],
  },
  viewToggleTextActive: {
    color: Colors.light.text,
  },
  daysContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  daysScrollContent: {
    paddingHorizontal: 16,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: Colors.light.gray[100],
  },
  selectedDayItem: {
    backgroundColor: Colors.light.primary,
  },
  dayWeekday: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.gray[600],
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.light.text,
  },
  selectedDayText: {
    color: 'white',
  },
  dayDots: {
    flexDirection: 'row',
    marginTop: 4,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  calendarContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  selectedDateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  ordersTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
  },
  ordersList: {
    paddingBottom: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    alignItems: 'center',
  },
  orderDetailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.light.gray[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.light.gray[500],
    marginTop: 16,
  },
});