import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Customer } from '@/types/api';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCustomers();
      setCustomers(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiService.createCustomer(customerData);
      await fetchCustomers(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create customer');
    }
  };

  const updateCustomer = async (id: string, customerData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiService.updateCustomer(id, customerData);
      await fetchCustomers(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update customer');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await apiService.deleteCustomer(id);
      await fetchCustomers(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

export const useCustomer = (id: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCustomer(id);
      setCustomer(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  return {
    customer,
    loading,
    error,
    fetchCustomer,
  };
};