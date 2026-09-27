import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { TrainingSession } from '../types';
import SessionForm, { type SessionFormData } from '../components/SessionForm';
import toast from 'react-hot-toast';

export default function EditSessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    const sessionPromise = fetch(`${API_BASE_URL}/sessions/${id}`).then((res) => {
      if (!res.ok) throw new Error('Session not found');
      return res.json();
    });
    const categoriesPromise = fetch(`${API_BASE_URL}/categories`).then((res) => res.json());

    Promise.all([sessionPromise, categoriesPromise])
      .then(([session, fetchedCategories]) => {
        setCurrentSession(session);
        setCategories(fetchedCategories);
      })
      .catch((err) => {
        console.error('Failed to load session details: ', err);
        toast.error('Failed to load session details');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleEditSession = async (formData: SessionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Session updated successfully!');
        navigate('/');
      } else {
        toast.error('Failed to edit session');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 animate-pulse">
          Loading session data...
        </p>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 gap-4 transition-colors">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Session not found
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm space-y-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center transition-colors">
          Edit Session
        </h2>
        <SessionForm
          initialData={currentSession}
          categories={categories}
          isSubmitting={isSubmitting}
          submitButtonText="Edit session"
          onSubmit={handleEditSession}
        />
      </div>
    </div>
  );
}