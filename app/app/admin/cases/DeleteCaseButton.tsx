'use client';

import { useState } from 'react';
import { deleteCase } from './actions';

interface DeleteCaseButtonProps {
  caseId: string;
  caseTitle: string;
}

export function DeleteCaseButton({ caseId, caseTitle }: DeleteCaseButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCase(caseId);
    } catch (error) {
      console.error('Failed to delete case:', error);
      alert('Failed to delete case');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-900/50 hover:bg-red-800 text-red-300 px-3 py-1 rounded text-sm transition-colors"
    >
      Delete
    </button>
  );
}
