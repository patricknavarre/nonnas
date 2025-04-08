import mongoose from 'mongoose';

export interface ISetting {
  _id?: string;
  key: string;
  value: any;
  group: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'color';
  options?: string[];
  updatedAt?: Date;
}

const settingSchema = new mongoose.Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  group: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['text', 'textarea', 'number', 'boolean', 'image', 'color'] 
  },
  options: [{ type: String }]
}, {
  timestamps: true,
});

export const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', settingSchema);

// Default settings that should exist in the database
export const defaultSettings: ISetting[] = [
  {
    key: 'site_title',
    value: "Nonna & Rue's",
    group: 'general',
    label: 'Site Title',
    type: 'text'
  },
  {
    key: 'site_description',
    value: 'Unique Finds for Your Home',
    group: 'general',
    label: 'Site Description',
    type: 'textarea'
  },
  {
    key: 'primary_color',
    value: '#8B9D83',
    group: 'appearance',
    label: 'Primary Color',
    type: 'color'
  },
  {
    key: 'secondary_color',
    value: '#4A3D3D',
    group: 'appearance',
    label: 'Secondary Color',
    type: 'color'
  },
  {
    key: 'hero_heading',
    value: 'Discover Unique Treasures',
    group: 'home',
    label: 'Hero Heading',
    type: 'text'
  },
  {
    key: 'hero_subheading',
    value: 'Curated vintage & handcrafted home goods with southern charm',
    group: 'home',
    label: 'Hero Subheading',
    type: 'text'
  },
  {
    key: 'contact_email',
    value: 'contact@nonnaandrues.com',
    group: 'contact',
    label: 'Contact Email',
    type: 'text'
  },
  {
    key: 'contact_phone',
    value: '(318) 555-1234',
    group: 'contact',
    label: 'Contact Phone',
    type: 'text'
  },
  {
    key: 'about_header',
    value: 'Our Story',
    group: 'about',
    label: 'About Page Header',
    type: 'text'
  },
  {
    key: 'about_subheader',
    value: 'A mother-daughter journey of passion, creativity, and Southern hospitality',
    group: 'about',
    label: 'About Page Subheader',
    type: 'text'
  },
  {
    key: 'about_section_header',
    value: 'The Heart Behind Nonna & Rue\'s',
    group: 'about',
    label: 'About Section Header',
    type: 'text'
  },
  {
    key: 'about_text',
    value: 'Nonna & Rue\'s began as a dream shared between a mother and daughter in the heart of Shreveport, Louisiana. Rhonda "Nonna" and her daughter Lauren "Rue" always shared a special bond through their love of unique, handcrafted treasures.',
    group: 'about',
    label: 'About Us First Paragraph',
    type: 'textarea'
  },
  {
    key: 'about_text_2',
    value: 'What started as weekend adventures hunting for one-of-a-kind pieces at local markets and estate sales soon blossomed into something more. In early 2024, they took a leap of faith and opened their shop in The Grove, a charming district in Shreveport\'s historic downtown.',
    group: 'about',
    label: 'About Us Second Paragraph',
    type: 'textarea'
  },
  {
    key: 'about_text_3',
    value: '"We wanted to create a space that felt like an extension of our home," Lauren recalls. "A place where people could find gifts that tell stories and bring joy, regardless of their age."',
    group: 'about',
    label: 'About Us Third Paragraph',
    type: 'textarea'
  },
  {
    key: 'about_text_4',
    value: 'Rhonda, affectionately known as "Nonna" to her grandchildren and now to their loyal customers, brings decades of Southern hospitality and an eye for timeless elegance to their collection. Lauren, or "Rue" as she\'s been called since childhood, contributes a contemporary perspective that keeps their offerings fresh and exciting.',
    group: 'about',
    label: 'About Us Fourth Paragraph',
    type: 'textarea'
  },
  {
    key: 'about_text_5',
    value: 'Together, they\'ve curated a boutique that seamlessly blends vintage charm with modern sensibilities, offering everything from handcrafted home décor to artisanal kitchenware, unique jewelry, and whimsical gifts that bring smiles to faces young and old.',
    group: 'about',
    label: 'About Us Fifth Paragraph',
    type: 'textarea'
  },
  {
    key: 'footer_text',
    value: '© 2024 Nonna & Rue\'s. All rights reserved.',
    group: 'general',
    label: 'Footer Text',
    type: 'text'
  }
]; 