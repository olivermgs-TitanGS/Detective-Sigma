'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Content Rating Slider for Admin Panel
 *
 * Singapore IMDA Video Game Classification compliant
 * Controls what content is allowed in image generation and story content
 *
 * Ratings:
 * - GENERAL: Suitable for all ages (P4-P6 primary school)
 * - PG13: Parental guidance for below 13 (Secondary school)
 * - ADV16: Advisory for 16+ (IMDA video game rating)
 * - M18: Mature 18+ (IMDA restricted rating)
 */

type ContentRating = 'GENERAL' | 'PG13' | 'ADV16' | 'M18';

interface RatingInfo {
  rating: ContentRating;
  label: string;
  shortLabel: string;
  description: string;
  minAge: number;
  color: string;
  bgColor: string;
  borderColor: string;
  isRestricted: boolean;
  allowedContent: string[];
  blockedContent: string[];
}

const RATING_INFO: RatingInfo[] = [
  {
    rating: 'GENERAL',
    label: 'General',
    shortLabel: 'G',
    description: 'Suitable for all ages. Safe for primary school children (P4-P6).',
    minAge: 0,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    isRestricted: false,
    allowedContent: [
      'Mystery themes',
      'Non-violent crimes (theft, fraud)',
      'Clean crime scenes',
      'Cartoon/mild violence only',
    ],
    blockedContent: [
      'Blood and gore',
      'Weapons',
      'Death references',
      'Horror/scary content',
      'Alcohol/drugs',
      'Strong language',
    ],
  },
  {
    rating: 'PG13',
    label: 'PG13',
    shortLabel: 'PG13',
    description: 'Parental guidance advised for children below 13.',
    minAge: 13,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    isRestricted: false,
    allowedContent: [
      'Murder mysteries',
      'Blood evidence (not graphic)',
      'Weapons as evidence',
      'Death references',
      'Mild language ("damn", "hell")',
      'Suspenseful atmosphere',
    ],
    blockedContent: [
      'Graphic gore',
      'Satanic/occult themes',
      'Drug use',
      'Strong language',
    ],
  },
  {
    rating: 'ADV16',
    label: 'Advisory 16',
    shortLabel: 'ADV16',
    description: 'Advisory for persons 16 and above. IMDA video game rating.',
    minAge: 16,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    isRestricted: false,
    allowedContent: [
      'Realistic violence',
      'Horror elements',
      'Mature themes',
      'Drug references',
      'Moderate language',
      'Dark atmospheres',
    ],
    blockedContent: [
      'Excessive gore',
      'Strong language (f-word)',
      'Drug use depiction',
    ],
  },
  {
    rating: 'M18',
    label: 'Mature 18',
    shortLabel: 'M18',
    description: 'Restricted to persons 18 years and above. Requires age verification.',
    minAge: 18,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    isRestricted: true,
    allowedContent: [
      'Realistic violence and gore',
      'Strong language',
      'Drug use depiction',
      'Mature themes',
      'Horror content',
      'Artistic nudity (non-sexual)',
    ],
    blockedContent: [
      'Sexual/explicit content',
      'Extreme violence (torture)',
      'Child abuse content',
      'Terrorism content',
    ],
  },
];

interface ContentRatingSliderProps {
  initialRating?: ContentRating;
  onRatingChange?: (rating: ContentRating) => void;
  disabled?: boolean;
  showDetails?: boolean;
}

export default function ContentRatingSlider({
  initialRating = 'GENERAL',
  onRatingChange,
  disabled = false,
  showDetails = true,
}: ContentRatingSliderProps) {
  const [rating, setRating] = useState<ContentRating>(initialRating);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRating, setPendingRating] = useState<ContentRating | null>(null);

  const currentIndex = RATING_INFO.findIndex((r) => r.rating === rating);
  const currentInfo = RATING_INFO[currentIndex];

  // Fetch current rating on mount
  useEffect(() => {
    fetchCurrentRating();
  }, []);

  const fetchCurrentRating = async () => {
    try {
      const response = await fetch('/api/admin/content-rating');
      if (response.ok) {
        const data = await response.json();
        setRating(data.rating);
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
    }
  };

  const handleSliderChange = (newIndex: number) => {
    if (disabled) return;

    const newRating = RATING_INFO[newIndex].rating;

    // Show confirmation for restricted ratings
    if (RATING_INFO[newIndex].isRestricted) {
      setPendingRating(newRating);
      setShowConfirm(true);
    } else {
      applyRating(newRating);
    }
  };

  const applyRating = async (newRating: ContentRating) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating }),
      });

      if (response.ok) {
        setRating(newRating);
        onRatingChange?.(newRating);
      } else {
        console.error('Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
      setPendingRating(null);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Content Rating (Singapore IMDA)
          </h3>
          <p className="text-sm text-stone-400 mt-1">
            Controls what content is allowed in generated images and stories
          </p>
        </div>

        {/* Current Rating Badge */}
        <div
          className={`px-4 py-2 rounded-lg border-2 ${currentInfo.bgColor} ${currentInfo.borderColor}`}
        >
          <span className={`font-bold text-lg ${currentInfo.color}`}>
            {currentInfo.shortLabel}
          </span>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative mb-8">
        {/* Background Track */}
        <div className="h-3 bg-stone-700 rounded-full relative">
          {/* Colored Progress */}
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444)`,
            }}
            initial={false}
            animate={{
              width: `${(currentIndex / (RATING_INFO.length - 1)) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Rating Markers */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {RATING_INFO.map((info, index) => (
              <button
                key={info.rating}
                onClick={() => handleSliderChange(index)}
                disabled={disabled || isLoading}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  index <= currentIndex
                    ? `${info.bgColor} ${info.borderColor} ${info.color}`
                    : 'bg-stone-600 border-stone-500 text-stone-400'
                } ${
                  index === currentIndex
                    ? 'scale-125 shadow-lg'
                    : 'hover:scale-110'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold`}
              >
                {info.shortLabel === 'General' ? 'G' : info.shortLabel.charAt(0)}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-xs">
          {RATING_INFO.map((info) => (
            <span
              key={info.rating}
              className={`${
                info.rating === rating ? info.color : 'text-stone-500'
              } font-medium`}
            >
              {info.shortLabel}
            </span>
          ))}
        </div>
      </div>

      {/* Current Rating Details */}
      {showDetails && (
        <AnimatePresence mode="wait">
          <motion.div
            key={rating}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`border rounded-lg p-4 ${currentInfo.borderColor} bg-stone-800/50`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className={`font-bold ${currentInfo.color}`}>
                  {currentInfo.label}
                  {currentInfo.isRestricted && (
                    <span className="ml-2 text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded">
                      RESTRICTED
                    </span>
                  )}
                </h4>
                <p className="text-sm text-stone-400 mt-1">
                  {currentInfo.description}
                </p>
              </div>
              <span className="text-stone-500 text-sm">
                Age: {currentInfo.minAge === 0 ? 'All' : `${currentInfo.minAge}+`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Allowed Content */}
              <div>
                <h5 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Allowed
                </h5>
                <ul className="text-xs text-stone-300 space-y-1">
                  {currentInfo.allowedContent.map((item) => (
                    <li key={item} className="flex items-start gap-1">
                      <span className="text-green-500">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blocked Content */}
              <div>
                <h5 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Blocked
                </h5>
                <ul className="text-xs text-stone-300 space-y-1">
                  {currentInfo.blockedContent.map((item) => (
                    <li key={item} className="flex items-start gap-1">
                      <span className="text-red-500">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-amber-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Updating rating...
        </div>
      )}

      {/* Confirmation Modal for Restricted Ratings */}
      <AnimatePresence>
        {showConfirm && pendingRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-800 border border-red-500 rounded-lg p-6 max-w-md m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400">
                    Restricted Rating Warning
                  </h3>
                  <p className="text-sm text-stone-400">
                    {pendingRating} content requires age verification
                  </p>
                </div>
              </div>

              <p className="text-stone-300 mb-6">
                You are about to enable <strong>{pendingRating}</strong> rated content.
                This content is restricted to persons{' '}
                <strong>
                  {RATING_INFO.find((r) => r.rating === pendingRating)?.minAge}+ years
                </strong>{' '}
                old under Singapore IMDA regulations.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => applyRating(pendingRating)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
                >
                  Confirm {pendingRating}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Singapore IMDA Compliance Notice */}
      <div className="mt-4 pt-4 border-t border-stone-700">
        <p className="text-xs text-stone-500 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Compliant with Singapore IMDA Video Game Classification Guidelines
        </p>
      </div>
    </div>
  );
}
