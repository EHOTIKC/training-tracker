import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export interface SessionFormData {
  title: string;
  category: string;
  durationMinutes: number;
  isCompleted: boolean;
  tags: string[];
}

interface SessionFormProps {
  initialData?: Partial<SessionFormData>;
  categories: string[];
  isSubmitting: boolean;
  submitButtonText: string;
  onSubmit: (data: SessionFormData) => void;
}

export default function SessionForm({
  initialData,
  categories,
  isSubmitting,
  submitButtonText,
  onSubmit,
}: SessionFormProps) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || categories[0] || 'Cardio');
  const [isCompleted, setIsCompleted] = useState(initialData?.isCompleted || false);
  const [duration, setDuration] = useState(initialData?.durationMinutes || 30);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      toast.error('Tag already added');
      return;
    }
    if (tags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
      return;
    }
    if (trimmed.length > 20) {
      toast.error('Tag cannot exceed 20 characters');
      return;
    }

    setTags([...tags, trimmed]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a session title');
      return;
    }
    if (title.length > 100) {
      toast.error('Title cannot exceed 100 characters');
      return;
    }
    if (isNaN(duration) || duration < 5 || duration > 180) {
      toast.error('Duration must be between 5 and 180 minutes');
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      durationMinutes: duration,
      isCompleted,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title:</label>
          <small className="text-xs text-gray-400 dark:text-gray-500">{title.length} / 100</small>
        </div>
        <input
          type="text"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value.slice(0, 100))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
          placeholder="e.g. Morning Run"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))
          ) : (
            <option value="">No categories available</option>
          )}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          min={5}
          max={180}
          onChange={(e) => setDuration(e.target.valueAsNumber || 0)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</label>
          <small className="text-xs text-gray-400 dark:text-gray-500">{tags.length} / 5 tags</small>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            maxLength={20}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="e.g. outdoor, hiit"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 px-2.5 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-900 dark:hover:text-blue-100 focus:outline-none text-xs font-bold leading-none cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="completed-check"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded cursor-pointer"
        />
        <label htmlFor="completed-check" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          Is completed
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}