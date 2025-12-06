'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

// Keyboard navigation hook for modal-like components
export function useKeyboardNavigation({
  isActive,
  onClose,
  onNext,
  onPrevious,
  onSelect,
}: {
  isActive: boolean;
  onClose?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSelect?: () => void;
}) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          onPrevious?.();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onClose, onNext, onPrevious, onSelect]);
}

// Focus trap for modals
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive]);

  return containerRef;
}

// Skip to content link
export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[200]
        focus:bg-amber-600 focus:text-black focus:px-4 focus:py-2
        focus:font-mono focus:font-bold focus:tracking-wider
        focus:outline-none focus:ring-2 focus:ring-white
      "
    >
      Skip to main content
    </a>
  );
}

// Announce changes to screen readers
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }, []);

  return announce;
}

// Screen reader only announcer component
export function ScreenReaderAnnouncer() {
  return (
    <div
      id="sr-announcer"
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    />
  );
}

// Reduced motion preference hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// High contrast mode hook
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

// Focus visible style utilities
export const focusVisibleStyles = `
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-amber-500
  focus-visible:ring-offset-2
  focus-visible:ring-offset-black
`;

// Accessible button wrapper with keyboard support
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  label,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
  [key: string]: unknown;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
      className={`${focusVisibleStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Progress announcer for screen readers
export function useProgressAnnounce() {
  const lastAnnounced = useRef(0);
  const announce = useAnnounce();

  const announceProgress = useCallback(
    (current: number, total: number, label: string) => {
      const percentage = Math.round((current / total) * 100);
      // Only announce at 25% intervals to avoid spam
      if (percentage - lastAnnounced.current >= 25) {
        lastAnnounced.current = percentage;
        announce(`${label}: ${percentage}% complete`);
      }
    },
    [announce]
  );

  return announceProgress;
}

// Live region for dynamic content updates
export function LiveRegion({
  children,
  priority = 'polite',
  atomic = true,
}: {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
}) {
  return (
    <div aria-live={priority} aria-atomic={atomic}>
      {children}
    </div>
  );
}

// Keyboard shortcut display
export function KeyboardShortcut({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded font-mono text-xs text-slate-300">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="text-slate-500 mx-1">+</span>}
          </span>
        ))}
      </div>
      <span className="text-slate-400">{description}</span>
    </div>
  );
}

// Keyboard shortcuts help panel
export function KeyboardShortcutsHelp({
  shortcuts,
}: {
  shortcuts: Array<{ keys: string[]; description: string }>;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
      <h3 className="text-amber-400 font-mono font-bold tracking-wider mb-4">
        KEYBOARD SHORTCUTS
      </h3>
      <div className="space-y-3">
        {shortcuts.map((shortcut, i) => (
          <KeyboardShortcut key={i} keys={shortcut.keys} description={shortcut.description} />
        ))}
      </div>
    </div>
  );
}
