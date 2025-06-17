import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Order } from '@/types/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOrders();
      setOrders(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    customer_id: number;
    size_id: number[];
    quantity: number[];
    price: number;
  }) => {
    try {
      const response = await apiService.createOrder(orderData);
      await fetchOrders(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create order');
    }
  };

  const updateOrder = async (id: string, orderData: {
    customer_id: number;
    size_id: number[];
    quantity: number[];
    price: number;
    status?: string;
  }) => {
    try {
      const response = await apiService.updateOrder(id, orderData);
      await fetchOrders(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update order');
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await apiService.updateOrderStatus(id, status);
      await fetchOrders(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update order status');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await apiService.deleteOrder(id);
      await fetchOrders(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
  };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOrder(id);
      setOrder(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  return {
    order,
    loading,
    error,
    fetchOrder,
  };
};