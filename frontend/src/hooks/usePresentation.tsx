
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Presentation, Slide, SlideContent, CustomTheme } from '@/lib/types';
import { getDefaultSlide } from '@/lib/templates';
import { toast } from 'sonner';

// Initial empty presentation
const createEmptyPresentation = (): Presentation => ({
  id: uuidv4(),
  title: 'Untitled Presentation',
  slides: [
    {
      id: uuidv4(),
      content: getDefaultSlide('title-slide'),
      template: 'title-slide',
    },
  ],
  theme: 'default',
  createdAt: new Date(),
  updatedAt: new Date(),
  customThemes: [],
});

export function usePresentation() {
  const [presentation, setPresentation] = useState<Presentation>(createEmptyPresentation());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Get current slide
  const currentSlide = presentation.slides[currentSlideIndex];

  // Add a new slide
  const addSlide = useCallback((templateId: string) => {
    setPresentation((prev) => {
      const newSlide: Slide = {
        id: uuidv4(),
        content: getDefaultSlide(templateId),
        template: templateId,
      };

      return {
        ...prev,
        slides: [...prev.slides, newSlide],
        updatedAt: new Date(),
      };
    });
    
    // Navigate to the new slide
    setCurrentSlideIndex(presentation.slides.length);
    toast.success('Slide added');
  }, [presentation.slides.length]);

  // Delete a slide
  const deleteSlide = useCallback((slideIndex: number) => {
    if (presentation.slides.length <= 1) {
      toast.error('Cannot delete the only slide');
      return;
    }

    setPresentation((prev) => {
      const newSlides = [...prev.slides];
      newSlides.splice(slideIndex, 1);

      return {
        ...prev,
        slides: newSlides,
        updatedAt: new Date(),
      };
    });

    // Adjust current slide index if needed
    if (slideIndex <= currentSlideIndex) {
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
    
    toast.success('Slide deleted');
  }, [currentSlideIndex, presentation.slides.length]);

  // Update slide content
  const updateSlideContent = useCallback((slideIndex: number, content: Partial<SlideContent>) => {
    setPresentation((prev) => {
      const newSlides = [...prev.slides];
      
      // Fix for table deletion
      if (content.table === null) {
        const updatedContent = { ...newSlides[slideIndex].content };
        delete updatedContent.table;
        
        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          content: updatedContent,
        };
      } else {
        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          content: {
            ...newSlides[slideIndex].content,
            ...content,
          },
        };
      }

      return {
        ...prev,
        slides: newSlides,
        updatedAt: new Date(),
      };
    });
  }, []);

  // Change slide position (reorder)
  const moveSlide = useCallback((fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= presentation.slides.length ||
      toIndex < 0 ||
      toIndex >= presentation.slides.length
    ) {
      return;
    }

    setPresentation((prev) => {
      const newSlides = [...prev.slides];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);

      return {
        ...prev,
        slides: newSlides,
        updatedAt: new Date(),
      };
    });

    // Update current slide index if needed
    if (currentSlideIndex === fromIndex) {
      setCurrentSlideIndex(toIndex);
    } else if (
      currentSlideIndex > fromIndex &&
      currentSlideIndex <= toIndex
    ) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (
      currentSlideIndex < fromIndex &&
      currentSlideIndex >= toIndex
    ) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, presentation.slides.length]);

  // Update presentation title
  const updatePresentationTitle = useCallback((title: string) => {
    setPresentation((prev) => ({
      ...prev,
      title,
      updatedAt: new Date(),
    }));
  }, []);

  // Change theme
  const setTheme = useCallback((themeId: string) => {
    setPresentation((prev) => ({
      ...prev,
      theme: themeId,
      updatedAt: new Date(),
    }));
    
    toast.success('Theme updated');
  }, []);

  // Add custom theme
  const addCustomTheme = useCallback((themeId: string, backgroundImage: string) => {
    setPresentation((prev) => {
      const customThemes = prev.customThemes || [];
      const newCustomTheme: CustomTheme = {
        id: themeId,
        backgroundImage
      };
      
      return {
        ...prev,
        customThemes: [...customThemes, newCustomTheme],
        updatedAt: new Date(),
      };
    });
  }, []);

  // Reset to a new presentation
  const resetPresentation = useCallback(() => {
    setPresentation(createEmptyPresentation());
    setCurrentSlideIndex(0);
    toast.success('New presentation created');
  }, []);

  return {
    presentation,
    currentSlide,
    currentSlideIndex,
    isEditing,
    setCurrentSlideIndex,
    setIsEditing,
    addSlide,
    deleteSlide,
    updateSlideContent,
    moveSlide,
    updatePresentationTitle,
    setTheme,
    resetPresentation,
    addCustomTheme,
  };
}
