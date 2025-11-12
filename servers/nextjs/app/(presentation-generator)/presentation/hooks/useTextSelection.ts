import { useState, useEffect, useCallback } from 'react';

export interface TextSelection {
  text: string;
  slideId: string | null;
  slideIndex: number | null;
}

export function useTextSelection() {
  const [selection, setSelection] = useState<TextSelection>({
    text: '',
    slideId: null,
    slideIndex: null,
  });

  const handleSelectionChange = useCallback(() => {
    const windowSelection = window.getSelection();
    const selectedText = windowSelection?.toString().trim() || '';

    if (selectedText) {
      // Try to find the slide element that contains the selection
      const anchorNode = windowSelection?.anchorNode;
      if (anchorNode) {
        // Traverse up the DOM to find the slide container
        let element = anchorNode as Node;
        while (element && element.parentElement) {
          const parent = element.parentElement;

          // Check if this is a slide element (has id like "slide-0", "slide-1", etc.)
          if (parent.id && parent.id.startsWith('slide-')) {
            const slideIndex = parseInt(parent.id.replace('slide-', ''));

            // Get the slide data from the parent element's data attributes
            const slideElement = parent.querySelector('[data-slide-id]');
            const slideId = slideElement?.getAttribute('data-slide-id');

            setSelection({
              text: selectedText,
              slideId: slideId || null,
              slideIndex: isNaN(slideIndex) ? null : slideIndex,
            });
            return;
          }
          element = parent;
        }
      }

      // If we couldn't find a slide container, just store the text
      setSelection({
        text: selectedText,
        slideId: null,
        slideIndex: null,
      });
    } else {
      // Clear selection when nothing is selected
      setSelection({
        text: '',
        slideId: null,
        slideIndex: null,
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelection({
      text: '',
      slideId: null,
      slideIndex: null,
    });
    window.getSelection()?.removeAllRanges();
  }, []);

  return {
    selection,
    hasSelection: selection.text.length > 0,
    clearSelection,
  };
}
