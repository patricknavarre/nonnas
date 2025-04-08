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
    key: 'about_text',
    value: 'Nonna & Rue\'s is a boutique home goods store specializing in unique vintage finds and handcrafted items with southern charm. Our carefully curated collection brings character and warmth to your home.',
    group: 'about',
    label: 'About Us Text',
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