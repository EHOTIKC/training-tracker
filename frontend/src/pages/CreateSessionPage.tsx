import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SessionForm, { type SessionFormData } from '../components/SessionForm';
import toast from 'react-hot-toast';

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        const loadedCategories = data.length > 0 ? data : ['Cardio', 'Strength', 'Yoga'];
        setCategories(loadedCategories);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load categories');
        setCategories(['Cardio', 'Strength', 'Yoga']);
      })
      .finally(() => {
        setIsCategoriesLoaded(true);
      });
  }, []);

  const handleCreateSession = async (formData: SessionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Session created successfully!');
        navigate('/');
      } else {
        toast.error('Failed to create session');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCategoriesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm space-y-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center transition-colors">
          Create Session
        </h2>
        <SessionForm
          categories={categories}
          isSubmitting={isSubmitting}
          submitButtonText="Create session"
          onSubmit={handleCreateSession}
        />
      </div>
    </div>
  );
}