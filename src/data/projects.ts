export interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  year: string;
  tag: string;
  images: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Casa Lumina',
    description: 'Rezidențial modern cu accente naturale',
    location: 'Cluj',
    year: '2024',
    tag: 'Design Interior',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
    ],
  },
  {
    id: 2,
    name: 'Penthouse Noir',
    description: 'Loft urban cu finisaje premium',
    location: 'București',
    year: '2024',
    tag: 'Design Interior',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop',
    ],
  },
  {
    id: 3,
    name: 'Vila Serenity',
    description: 'Design exterior și peisagistică de lux',
    location: 'Constanța',
    year: '2025',
    tag: 'Design Exterior',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    ],
  },
];
