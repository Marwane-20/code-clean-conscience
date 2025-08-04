import { useEffect } from 'react';

interface KeyboardShortcuts {
  onEscape?: () => void;
  onCtrlS?: () => void;
  onCtrlO?: () => void;
  onCtrlE?: () => void;
  onCtrlShiftS?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key
      if (event.key === 'Escape' && shortcuts.onEscape) {
        event.preventDefault();
        shortcuts.onEscape();
      }

      // Ctrl+S (Save/Settings)
      if (event.ctrlKey && event.key === 's' && shortcuts.onCtrlS) {
        event.preventDefault();
        shortcuts.onCtrlS();
      }

      // Ctrl+O (Open)
      if (event.ctrlKey && event.key === 'o' && shortcuts.onCtrlO) {
        event.preventDefault();
        shortcuts.onCtrlO();
      }

      // Ctrl+E (Export)
      if (event.ctrlKey && event.key === 'e' && shortcuts.onCtrlE) {
        event.preventDefault();
        shortcuts.onCtrlE();
      }

      // Ctrl+Shift+S (Settings)
      if (event.ctrlKey && event.shiftKey && event.key === 'S' && shortcuts.onCtrlShiftS) {
        event.preventDefault();
        shortcuts.onCtrlShiftS();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};