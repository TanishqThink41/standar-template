
import PptxGenJS from 'pptxgenjs';
import { Presentation, SlideContent, Theme } from './types';
import { themes } from './templates';
import { toast } from 'sonner';

// Handle image upload and convert to base64
export const handleImageUpload = (
  file: File,
  callback: (base64: string) => void
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      callback(e.target.result as string);
    }
  };
  reader.readAsDataURL(file);
};

// Export presentation to PPTX file
export const exportToPptx = (presentation: Presentation, customThemes: Theme[] = []) => {
  // Create new presentation
  const pptx = new PptxGenJS();

  // Function to find theme by ID (including custom themes)
  const getThemeById = (themeId: string): Theme => {
    // First check custom themes
    const customTheme = customThemes.find(t => t.id === themeId);
    if (customTheme) return customTheme;
    
    // Then check default themes
    const defaultTheme = themes.find(t => t.id === themeId);
    return defaultTheme || themes[0]; // Default to first theme if not found
  };

  // Set metadata
  pptx.author = 'SlideCraft';
  pptx.company = 'SlideCraft';
  pptx.revision = '1';
  pptx.subject = presentation.title;
  pptx.title = presentation.title;

  // Get current theme
  const currentTheme = getThemeById(presentation.theme);

  // Using theme colors directly in slides instead of global theme
  // pptxgenjs uses different theme properties than what we're trying to set

  // Process each slide
  presentation.slides.forEach((slide) => {
    // Create new slide
    const pptxSlide = pptx.addSlide();

    // Set slide background
    if (currentTheme.backgroundImage) {
      pptxSlide.background = { 
        data: currentTheme.backgroundImage
      };
    } else {
      pptxSlide.background = { color: currentTheme.background };
    }
    
    // Add slide content based on template
    const content = slide.content;
    
    // Add title if it exists and is visible
    if (content.title && content.hasTitle) {
      pptxSlide.addText(content.title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        fontSize: 36,
        fontFace: 'Arial',
        color: content.textColor || currentTheme.text,
        bold: true,
        h: 1,
      });
    }

    // Add subtitle if it exists and is visible
    if (content.subtitle && content.hasSubtitle) {
      pptxSlide.addText(content.subtitle, {
        x: 0.5,
        y: content.title && content.hasTitle ? 1.7 : 0.5,
        w: '90%',
        fontSize: 24,
        fontFace: 'Arial',
        color: content.textColor || currentTheme.text,
        h: 0.8,
      });
    }

    // Add general content if it exists
    if (content.content) {
      let contentText = content.content;
      
      // Convert basic HTML formatting to text
      contentText = contentText
        .replace(/<b>|<strong>/g, '')
        .replace(/<\/b>|<\/strong>/g, '')
        .replace(/<i>|<em>/g, '')
        .replace(/<\/i>|<\/em>/g, '')
        .replace(/<u>/g, '')
        .replace(/<\/u>/g, '')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n')
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '\n')
        .replace(/<br\s*\/?>/g, '\n');
      
      pptxSlide.addText(contentText, {
        x: 0.5,
        y: content.subtitle && content.hasSubtitle 
          ? 2.5 
          : content.title && content.hasTitle 
            ? 1.7 
            : 0.5,
        w: '90%',
        fontSize: 18,
        fontFace: 'Arial',
        color: content.textColor || currentTheme.text,
        breakLine: true,
      });
    }

    // Add image if it exists
    if (content.image) {
      const imageY = content.content 
        ? 3.5 
        : content.subtitle && content.hasSubtitle 
          ? 2.5 
          : content.title && content.hasTitle 
            ? 1.7 
            : 0.5;
      
      pptxSlide.addImage({
        data: content.image,
        x: '10%',
        y: imageY,
        w: '80%',
        h: 3,
      });
    }

    // Add table if it exists
    if (content.table) {
      const tableY = content.content 
        ? 4.5 
        : content.subtitle && content.hasSubtitle 
          ? 2.5 
          : content.title && content.hasTitle 
            ? 1.7 
            : 0.5;
      
      // Add header and rows to table data
      const tableRows = [
        content.table.headers.map((header) => ({
          text: header,
          options: {
            fontFace: 'Arial',
            fontSize: 14,
            color: currentTheme.text,
            bold: true,
            fill: { color: currentTheme.secondary },
          },
        })),
        ...content.table.rows.map((row) =>
          row.map((cell) => ({
            text: cell,
            options: {
              fontFace: 'Arial',
              fontSize: 12,
              color: content.textColor || currentTheme.text,
            },
          }))
        ),
      ];

      pptxSlide.addTable(tableRows, {
        x: 0.5,
        y: tableY,
        w: '90%',
        colW: Array(content.table.headers.length).fill(
          `${90 / content.table.headers.length}%`
        ),
        border: { pt: 1, color: currentTheme.text },
      });
    }
  });

  // Save the presentation
  pptx.writeFile({ fileName: `${presentation.title}.pptx` })
    .then(() => {
      toast.success('Presentation exported successfully');
    })
    .catch((err) => {
      console.error('Export error:', err);
      toast.error('Failed to export presentation');
    });
};
