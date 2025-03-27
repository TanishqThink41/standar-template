
import { Template, Theme } from './types';

// Predefined slide templates
export const templates: Template[] = [
  {
    id: 'title-slide',
    name: 'Title Slide',
    description: 'Title slide with a large title and subtitle',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxyZWN0IHg9IjIwIiB5PSI4MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2UxZTFlMSIvPjxyZWN0IHg9IjIwIiB5PSIxMzAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNlMWUxZTEiLz48cmVjdCB4PSIxNjAiIHk9IjYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZDFkNWRiIi8+PC9zdmc+',
  },
  {
    id: 'content-slide',
    name: 'Content Slide',
    description: 'Standard content slide with title and content',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2UxZTFlMSIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWUxZTEiLz48cmVjdCB4PSIxNjAiIHk9IjYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZDFkNWRiIi8+PC9zdmc+',
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Two column layout with content on both sides',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2UxZTFlMSIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWUxZTEiLz48cmVjdCB4PSIxNjAiIHk9IjYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==',
  },
  {
    id: 'table-slide',
    name: 'Table Slide',
    description: 'Slide with a table and chart',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2UxZTFlMSIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWVlZWUiIHN0cm9rZT0iI2QxZDVkYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHJlY3QgeD0iMTYwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2QxZDVkYiIvPjxsaW5lIHgxPSIyMCIgeTE9IjgwIiB4Mj0iMTQwIiB5Mj0iODAiIHN0cm9rZT0iI2QxZDVkYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9IjIwIiB5MT0iMTAwIiB4Mj0iMTQwIiB5Mj0iMTAwIiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMSIvPjxsaW5lIHgxPSIyMCIgeTE9IjEyMCIgeDI9IjE0MCIgeTI9IjEyMCIgc3Ryb2tlPSIjZDFkNWRiIiBzdHJva2Utd2lkdGg9IjEiLz48bGluZSB4MT0iNjAiIHkxPSI2MCIgeDI9IjYwIiB5Mj0iMTYwIiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMSIvPjxsaW5lIHgxPSIxMDAiIHkxPSI2MCIgeDI9IjEwMCIgeTI9IjE2MCIgc3Ryb2tlPSIjZDFkNWRiIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=',
  },
  {
    id: 'image-focus',
    name: 'Image Focus',
    description: 'Slide with a large image and minimal text',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2UxZTFlMSIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2UxZTFlMSIvPjxyZWN0IHg9IjE0MCIgeT0iMjAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZDFkNWRiIi8+PC9zdmc+',
  },
];

// Predefined themes
export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Modern Light',
    primary: '#3B82F6',
    secondary: '#E5E7EB',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  {
    id: 'dark',
    name: 'Modern Dark',
    primary: '#60A5FA',
    secondary: '#374151',
    background: '#111827',
    text: '#F9FAFB',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primary: '#000000',
    secondary: '#F3F4F6',
    background: '#FFFFFF',
    text: '#111827',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    primary: '#8B5CF6',
    secondary: '#F5F3FF',
    background: '#FFFFFF',
    text: '#4B5563',
  },
  {
    id: 'warm',
    name: 'Warm',
    primary: '#F97316',
    secondary: '#FFEDD5',
    background: '#FFFBEB',
    text: '#7C2D12',
  },
];

// Get a default slide for a template
export const getDefaultSlide = (templateId: string) => {
  switch (templateId) {
    case 'title-slide':
      return {
        title: 'Presentation Title',
        subtitle: 'Subtitle or Author Name',
        content: '',
        hasTitle: true,
        hasSubtitle: true,
      };
    case 'content-slide':
      return {
        title: 'Slide Title',
        content: 'Add your content here...',
        hasTitle: true,
        hasSubtitle: false,
      };
    case 'two-column':
      return {
        title: 'Two Column Slide',
        content: 'Left column content...',
        image: '',
        hasTitle: true,
        hasSubtitle: false,
      };
    case 'table-slide':
      return {
        title: 'Data Table',
        content: '',
        table: {
          headers: ['Header 1', 'Header 2', 'Header 3'],
          rows: [
            ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
            ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3'],
            ['Row 3, Cell 1', 'Row 3, Cell 2', 'Row 3, Cell 3'],
          ],
        },
        hasTitle: true,
        hasSubtitle: false,
      };
    case 'image-focus':
      return {
        title: 'Image Slide',
        subtitle: 'Description of the image',
        image: '',
        hasTitle: true,
        hasSubtitle: true,
      };
    default:
      return {
        title: 'New Slide',
        content: '',
        hasTitle: true,
        hasSubtitle: false,
      };
  }
};
