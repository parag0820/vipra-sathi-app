export interface Stotram {
  id: string;
  title: string;
  category: string; // e.g. Ganesh Stotras, Vishnu Stotras
  subCategory?: string;
  content: string; // The sanskrit text
  audioUrl?: string; // Optional URL for audio playback
}

export interface Aarti {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  content: string;
  imageUrl: string; // URL for Deity Image
  audioUrl?: string;
}

