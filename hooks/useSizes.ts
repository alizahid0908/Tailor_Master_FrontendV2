import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Size } from '@/types/api';

export const useSizes = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSizes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSizes();
      setSizes(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sizes');
    } finally {
      setLoading(false);
    }
  };

  const createSize = async (sizeData: {
    customer_id: number;
    size_name: string;
    collar_size?: number;
    chest_size?: number;
    sleeve_length?: number;
    cuff_size?: number;
    shoulder_size?: number;
    waist_size?: number;
    shirt_length?: number;
    legs_length?: number;
    description?: string;
    category: string;
  }) => {
    try {
      const response = await apiService.createSize(sizeData);
      await fetchSizes(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create size');
    }
  };

  const updateSize = async (id: string, sizeData: {
    customer_id: number;
    size_name: string;
    collar_size?: number;
    chest_size?: number;
    sleeve_length?: number;
    cuff_size?: number;
    shoulder_size?: number;
    waist_size?: number;
    shirt_length?: number;
    legs_length?: number;
    description?: string;
    category: string;
  }) => {
    try {
      const response = await apiService.updateSize(id, sizeData);
      await fetchSizes(); // Refresh the list
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update size');
    }
  };

  const deleteSize = async (id: string) => {
    try {
      await apiService.deleteSize(id);
      await fetchSizes(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete size');
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  return {
    sizes,
    loading,
    error,
    fetchSizes,
    createSize,
    updateSize,
    deleteSize,
  };
};

export const useSizesByCustomer = (customerId: string) => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSizesByCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSizesByCustomer(customerId);
      setSizes(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer sizes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchSizesByCustomer();
    }
  }, [customerId]);

  return {
    sizes,
    loading,
    error,
    fetchSizesByCustomer,
  };
};

export const useSize = (id: string) => {
  const [size, setSize] = useState<Size | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSize = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSize(id);
      setSize(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch size');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSize();
    }
  }, [id]);

  return {
    size,
    loading,
    error,
    fetchSize,
  };
};