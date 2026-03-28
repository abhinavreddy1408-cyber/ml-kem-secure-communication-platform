// src/hooks/useSubmission.ts
import { useState, useCallback } from 'react';

export function useSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: any) => {
    setSubmitting(true);
    setSuccess(false);
    setError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
      } else {
        setError('Failed to submit');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, success, error };
}
