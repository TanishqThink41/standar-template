
import React, { useState, useRef, useEffect } from 'react';
import { Slide, SlideContent, TableData } from '@/lib/types';
import { Input } from '@/components/powerpoint/ui/input';
import { Textarea } from '@/components/powerpoint/ui/textarea';
import { Button } from '@/components/powerpoint/ui/button';
import { Image, Upload, Trash, Bold, Italic, Underline, List, Image as ImageIcon, Table, AlignCenter } from 'lucide-react';
import { handleImageUpload } from '@/lib/export';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/powerpoint/ui/menubar";
import { ScrollArea } from "@/components/powerpoint/ui/scroll-area";

interface SlideEditorProps {
  slide: Slide;
  onContentChange: (content: Partial<SlideContent>) => void;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onContentChange }) => {
  const [content, setContent] = useState<SlideContent>(slide.content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update local content when slide changes
  useEffect(() => {
    setContent(slide.content);
  }, [slide]);
  
  // Update the parent component when content changes
  const handleChange = (updates: Partial<SlideContent>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    onContentChange(updates);
  };
  
  // Handle image upload
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Handle background image upload
  const triggerBgImageUpload = () => {
    bgImageInputRef.current?.click();
  };
  
  const processImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (base64) => {
        handleChange({ image: base64 });
      });
    }
  };
  
  const processBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (base64) => {
        handleChange({ backgroundImage: base64 });
      });
    }
  };
  
  // Text formatting functions
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);
    
    // If text is selected, wrap it with markdown
    if (selectedText) {
      const newText = 
        currentText.substring(0, start) + 
        prefix + selectedText + suffix + 
        currentText.substring(end);
      
      handleChange({ content: newText });
      
      // Reset selection position after state update
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length, 
          end + prefix.length
        );
      }, 0);
    } else {
      // If no text is selected, just insert markdown with cursor between tags
      const newText = 
        currentText.substring(0, start) + 
        prefix + suffix + 
        currentText.substring(end);
      
      handleChange({ content: newText });
      
      // Place cursor between tags
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length, 
          start + prefix.length
        );
      }, 0);
    }
  };
  
  const addBold = () => insertMarkdown('**', '**');
  const addItalic = () => insertMarkdown('*', '*');
  const addUnderline = () => insertMarkdown('<u>', '</u>');
  
  // Add bullet point
  const addBulletPoint = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const currentText = textarea.value;
    
    // Find the start of the current line
    let lineStart = start;
    while (lineStart > 0 && currentText[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // Check if we're already inside a bullet point line
    const linePrefix = currentText.substring(lineStart, start);
    let prefix = '- ';
    
    // If it's already indented, make it a nested bullet point
    if (linePrefix.startsWith('- ') || linePrefix.startsWith('  ')) {
      prefix = '  - ';
    }
    
    // Insert bullet point at the start of the line
    const newText = 
      currentText.substring(0, lineStart) + 
      prefix + 
      currentText.substring(lineStart);
    
    handleChange({ content: newText });
    
    // Move cursor after the bullet point
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }, 0);
  };
  
  // Create a new table if none exists
  const addTable = () => {
    if (!content.table) {
      const newTable: TableData = {
        headers: ['Header 1', 'Header 2', 'Header 3'],
        rows: [
          ['Cell 1', 'Cell 2', 'Cell 3'],
          ['Cell 4', 'Cell 5', 'Cell 6']
        ]
      };
      handleChange({ table: newTable });
    }
  };
  
  // Set text color
  const setTextColor = (color: string) => {
    handleChange({ textColor: color });
  };
  
  // Predefined colors for selection
  const textColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#333333' },
    { name: 'Gray', value: '#666666' },
    { name: 'Blue', value: '#0066cc' },
    { name: 'Red', value: '#cc0000' },
    { name: 'Green', value: '#008800' },
    { name: 'Purple', value: '#9900cc' },
  ];
  
  // Render table editor if the slide has a table
  const renderTableEditor = () => {
    if (!content.table) return null;
    
    return (
      <div className="mt-4 animate-fade-in">
        <h3 className="text-sm font-medium mb-2 text-gray-700">Table</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                {content.table.headers.map((header, index) => (
                  <th key={index} className="p-2 border-b border-gray-200 bg-gray-50">
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...content.table!.headers];
                        newHeaders[index] = e.target.value;
                        handleChange({
                          table: {
                            ...content.table!,
                            headers: newHeaders,
                          },
                        });
                      }}
                      className="text-sm"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2 border-b border-gray-200">
                      <Input
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...content.table!.rows];
                          newRows[rowIndex][cellIndex] = e.target.value;
                          handleChange({
                            table: {
                              ...content.table!,
                              rows: newRows,
                            },
                          });
                        }}
                        className="text-sm"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between p-2 bg-gray-50 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newRows = [...content.table!.rows];
                newRows.push(Array(content.table!.headers.length).fill(''));
                handleChange({
                  table: {
                    ...content.table!,
                    rows: newRows,
                  },
                });
              }}
            >
              Add Row
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (content.table!.rows.length > 1) {
                  const newRows = [...content.table!.rows];
                  newRows.pop();
                  handleChange({
                    table: {
                      ...content.table!,
                      rows: newRows,
                    },
                  });
                }
              }}
            >
              Remove Row
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full">
      <ScrollArea className="h-full w-full">
        <div className="p-6">
          <div className="space-y-4 animate-slide-up">
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Title</h3>
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    id="hasTitle"
                    className="mr-2"
                    checked={content.hasTitle || false}
                    onChange={(e) => handleChange({ hasTitle: e.target.checked })}
                  />
                  <label htmlFor="hasTitle" className="text-xs text-gray-500">Show Title</label>
                </div>
              </div>
              {content.hasTitle && (
                <Input
                  value={content.title || ''}
                  onChange={(e) => handleChange({ title: e.target.value })}
                  placeholder="Slide Title"
                  className="w-full mb-3"
                />
              )}
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Subtitle</h3>
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    id="hasSubtitle"
                    className="mr-2"
                    checked={content.hasSubtitle || false}
                    onChange={(e) => handleChange({ hasSubtitle: e.target.checked })}
                  />
                  <label htmlFor="hasSubtitle" className="text-xs text-gray-500">Show Subtitle</label>
                </div>
              </div>
              {content.hasSubtitle && (
                <Input
                  value={content.subtitle || ''}
                  onChange={(e) => handleChange({ subtitle: e.target.value })}
                  placeholder="Subtitle"
                  className="w-full mb-3"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Content</h3>
              <div className="bg-gray-50 p-2 rounded-t-md border border-gray-200 flex flex-wrap gap-1 items-center">
                <Button variant="ghost" size="icon" title="Bold" onClick={addBold}>
                  <Bold size={16} />
                </Button>
                <Button variant="ghost" size="icon" title="Italic" onClick={addItalic}>
                  <Italic size={16} />
                </Button>
                <Button variant="ghost" size="icon" title="Underline" onClick={addUnderline}>
                  <Underline size={16} />
                </Button>
                <Button variant="ghost" size="icon" title="Bullet List" onClick={addBulletPoint}>
                  <List size={16} />
                </Button>
                <Button variant="ghost" size="icon" title="Add Table" onClick={addTable}>
                  <Table size={16} />
                </Button>
                
                <div className="ml-auto">
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="h-8 px-2 flex items-center gap-1 text-xs">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ 
                            backgroundColor: content.textColor || '#333333',
                            border: '1px solid #ddd'
                          }}
                        />
                        Text Color
                      </MenubarTrigger>
                      <MenubarContent>
                        {textColors.map(color => (
                          <MenubarItem 
                            key={color.value}
                            onClick={() => setTextColor(color.value)}
                            className="flex items-center gap-2"
                          >
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.name}</span>
                          </MenubarItem>
                        ))}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              </div>
              <Textarea
                ref={textareaRef}
                value={content.content || ''}
                onChange={(e) => handleChange({ content: e.target.value })}
                placeholder="Add content text here... (supports Markdown)"
                className="min-h-[120px] w-full rounded-t-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                Use **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt;, and - for bullet points. Use indented - for nested bullets (e.g., two spaces before -)
              </div>
            </div>
            
            {renderTableEditor()}
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Background Image</h3>
              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center mb-4">
                {content.backgroundImage ? (
                  <div className="relative">
                    <img 
                      src={content.backgroundImage} 
                      alt="Background image" 
                      className="max-h-[100px] mx-auto object-contain rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleChange({ backgroundImage: '' })}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center h-20 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
                    onClick={triggerBgImageUpload}
                  >
                    <ImageIcon size={24} className="text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Add slide background</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={bgImageInputRef}
                  onChange={processBgImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Image</h3>
              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                {content.image ? (
                  <div className="relative">
                    <img 
                      src={content.image} 
                      alt="Slide image" 
                      className="max-h-[200px] mx-auto object-contain rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => handleChange({ image: '' })}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
                    onClick={triggerImageUpload}
                  >
                    <Image size={32} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, SVG</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={processImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SlideEditor;
