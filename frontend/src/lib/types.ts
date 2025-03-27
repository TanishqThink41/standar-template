
// Define the slide content structure
export interface SlideContent {
  title?: string;
  subtitle?: string;
  content?: string;
  table?: TableData;
  image?: string; // Base64 encoded image
  backgroundImage?: string; // Base64 encoded background image
  hasTitle?: boolean;
  hasSubtitle?: boolean;
  textColor?: string; // Added text color option
}

// Define the table data structure
export interface TableData {
  headers: string[];
  rows: string[][];
}

// Define the slide type
export interface Slide {
  id: string;
  content: SlideContent;
  template: string;
}

// Define the presentation type
export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  theme: string;
  createdAt: Date;
  updatedAt: Date;
  customThemes?: CustomTheme[];
}

// Define custom theme type
export interface CustomTheme {
  id: string;
  backgroundImage: string;
}

// Define the template type
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

// Define the theme type
export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  backgroundImage?: string;
}
