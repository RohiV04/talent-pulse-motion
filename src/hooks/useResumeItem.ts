
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAIGenerator } from '@/services/ai-generator';

interface UseResumeItemProps<T> {
  onUpdate: (id: string, data: Partial<T>) => any;
  onRemove: (id: string) => any;
  onGenerateAI: (id: string, params: any) => Promise<void>;
  item: T & { id: string };
}

export function useResumeItem<T>({ 
  onUpdate, 
  onRemove, 
  onGenerateAI, 
  item 
}: UseResumeItemProps<T>) {
  const [isGenerating, setIsGenerating] = useState(false);
  const dispatch = useDispatch();

  const handleUpdate = (data: Partial<T>) => {
    const action = onUpdate(item.id, { ...data });
    dispatch(action);
  };

  const handleRemove = () => {
    const action = onRemove(item.id);
    dispatch(action);
  };

  const handleGenerateAI = async (params: any) => {
    setIsGenerating(true);
    try {
      await onGenerateAI(item.id, params);
    } catch (error) {
      console.error(`Error generating content:`, error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleUpdate,
    handleRemove,
    handleGenerateAI,
    isGenerating
  };
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
