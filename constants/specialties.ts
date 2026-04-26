// Freelancing Specialties Constants (Alphabetically Ordered)
export const FREELANCING_SPECIALTIES = [
  { value: '', label: 'Select your specialty...', category: '' },
  { value: '3d-modeling', label: '3D Modeling', category: 'Design' },
  { value: 'ai-ml-development', label: 'AI/ML Development', category: 'Development' },
  { value: 'animation', label: 'Animation', category: 'Media' },
  { value: 'audio-editing', label: 'Audio Editing', category: 'Media' },
  { value: 'backend-development', label: 'Backend Development', category: 'Development' },
  { value: 'blockchain-development', label: 'Blockchain Development', category: 'Development' },
  { value: 'blog-writing', label: 'Blog Writing', category: 'Writing' },
  { value: 'business-consulting', label: 'Business Consulting', category: 'Business' },
  { value: 'content-marketing', label: 'Content Marketing', category: 'Marketing' },
  { value: 'content-writing', label: 'Content Writing', category: 'Writing' },
  { value: 'copywriting', label: 'Copywriting', category: 'Writing' },
  { value: 'customer-support', label: 'Customer Support', category: 'Other' },
  { value: 'data-analysis', label: 'Data Analysis', category: 'Business' },
  { value: 'data-entry', label: 'Data Entry', category: 'Other' },
  { value: 'digital-marketing', label: 'Digital Marketing', category: 'Marketing' },
  { value: 'ecommerce-development', label: 'E-Commerce Development', category: 'Development' },
  { value: 'editing-proofreading', label: 'Editing & Proofreading', category: 'Writing' },
  { value: 'email-marketing', label: 'Email Marketing', category: 'Marketing' },
  { value: 'financial-consulting', label: 'Financial Consulting', category: 'Business' },
  { value: 'frontend-development', label: 'Frontend Development', category: 'Development' },
  { value: 'full-stack-development', label: 'Full-Stack Development', category: 'Development' },
  { value: 'game-development', label: 'Game Development', category: 'Development' },
  { value: 'ghostwriting', label: 'Ghostwriting', category: 'Writing' },
  { value: 'graphic-design', label: 'Graphic Design', category: 'Design' },
  { value: 'hr-recruiting', label: 'HR & Recruiting', category: 'Business' },
  { value: 'illustration', label: 'Illustration', category: 'Design' },
  { value: 'influencer-marketing', label: 'Influencer Marketing', category: 'Marketing' },
  { value: 'logo-design', label: 'Logo & Brand Identity Design', category: 'Design' },
  { value: 'mobile-app-development', label: 'Mobile App Development', category: 'Development' },
  { value: 'motion-graphics', label: 'Motion Graphics', category: 'Design' },
  { value: 'music-production', label: 'Music Production', category: 'Media' },
  { value: 'other', label: 'Other', category: 'Other' },
  { value: 'podcast-production', label: 'Podcast Production', category: 'Media' },
  { value: 'ppc-advertising', label: 'PPC Advertising', category: 'Marketing' },
  { value: 'product-design', label: 'Product Design', category: 'Design' },
  { value: 'project-management', label: 'Project Management', category: 'Business' },
  { value: 'qa-testing', label: 'QA Testing', category: 'Other' },
  { value: 'seo-specialist', label: 'SEO Specialist', category: 'Marketing' },
  { value: 'seo-writing', label: 'SEO Writing', category: 'Writing' },
  { value: 'social-media-marketing', label: 'Social Media Marketing', category: 'Marketing' },
  { value: 'technical-writing', label: 'Technical Writing', category: 'Writing' },
  { value: 'transcription', label: 'Transcription', category: 'Other' },
  { value: 'translation', label: 'Translation Services', category: 'Other' },
  { value: 'ui-ux-design', label: 'UI/UX Design', category: 'Design' },
  { value: 'video-editing', label: 'Video Editing', category: 'Media' },
  { value: 'video-production', label: 'Video Production', category: 'Media' },
  { value: 'virtual-assistant', label: 'Virtual Assistant', category: 'Business' },
  { value: 'voice-over', label: 'Voice Over Artist', category: 'Media' },
  { value: 'web-design', label: 'Web Design', category: 'Design' },
  { value: 'wordpress-development', label: 'WordPress Development', category: 'Development' },
];

// Helper function to get specialty label by value
export const getSpecialtyLabel = (value: string): string => {
  const specialty = FREELANCING_SPECIALTIES.find(s => s.value === value);
  return specialty ? specialty.label : value;
};

// Helper function to get specialties by category
export const getSpecialtiesByCategory = (category: string) => {
  return FREELANCING_SPECIALTIES.filter(s => s.category === category);
};

// Get all unique categories
export const SPECIALTY_CATEGORIES = [
  'Development',
  'Design',
  'Writing',
  'Marketing',
  'Media',
  'Business',
  'Other',
];

export const categoryApolloFilters: Record<string, { industries: string[]; jobTitles: string[]; companySize: string[]; signals: string[] }> = {
  Development: {
    industries: [
      "Computer Software",
      "Internet",
      "Artificial Intelligence",
      "E-Commerce",
      "HealthTech",
      "EdTech",
      "Fintech",
      "Information Technology & Services",
      "SaaS",
      "Financial Services",
    ],
    companySize: ["1-10", "11-50", "51-200"],
    jobTitles: [
      "Founder",
      "Co-Founder",
      "CEO",
      "CTO",
      "Head of Engineering",
      "VP Engineering",
      "Technical Lead",
      "Product Manager",
      "Head of Product"
    ],
    signals: [
      "Hiring software engineers",
      "New product launch",
      "Startup scaling team",
      "Growing engineering team"
    ]
  },

  Design: {
    industries: [
      "Marketing & Advertising",
      "E-Commerce",
      "Media Production",
      "Retail",
      "Consumer Goods",
      "SaaS",
      "Internet",
      "Hospitality",
      "Fashion & Apparel"
    ],
    companySize: ["1-10", "11-50", "51-200"],
    jobTitles: [
      "Founder",
      "CEO",
      "Creative Director",
      "Head of Design",
      "Marketing Director",
      "Brand Manager",
      "Head of Marketing",
      "Product Manager"
    ],
    signals: [
      "Launching new brand",
      "Running marketing campaigns",
      "Website redesign",
      "New product launch",
      "Scaling marketing team"
    ]
  },

  Writing: {
    industries: [
      "Media & Publishing",
      "Marketing & Advertising",
      "Online Media",
      "Information Services",
      "SaaS",
      "E-Commerce",
      "Education",
      "Technology"
    ],
    companySize: ["1-10", "11-50", "51-200"],
    jobTitles: [
      "Content Manager",
      "Content Director",
      "Head of Marketing",
      "SEO Manager",
      "Marketing Manager",
      "Founder",
      "CMO",
      "Editorial Director"
    ],
    signals: [
      "Active company blog",
      "Content marketing campaigns",
      "SEO growth initiatives",
      "Expanding marketing team",
      "Publishing frequent content"
    ]
  },

  Marketing: {
    industries: [
      "E-Commerce",
      "Retail",
      "Consumer Goods",
      "SaaS",
      "Education",
      "Hospitality",
      "Travel & Tourism",
      "Health & Wellness"
    ],
    companySize: ["1-10", "11-50", "51-200"],
    jobTitles: [
      "Marketing Director",
      "Growth Manager",
      "Digital Marketing Manager",
      "CMO",
      "Head of Marketing",
      "Founder",
      "Performance Marketing Manager"
    ],
    signals: [
      "Running paid ads",
      "Scaling marketing campaigns",
      "Hiring marketing roles",
      "Expanding digital presence",
      "Launching new products"
    ]
  },

  Media: {
    industries: [
      "Media Production",
      "Entertainment",
      "Marketing & Advertising",
      "Online Media",
      "Broadcast Media",
      "Education",
      "Digital Media",
      "Content Creation"
    ],
    companySize: ["1-10", "11-50", "51-200"],
    jobTitles: [
      "Creative Director",
      "Content Director",
      "Head of Content",
      "Marketing Manager",
      "Brand Manager",
      "Founder",
      "Social Media Manager"
    ],
    signals: [
      "Launching video campaigns",
      "Active YouTube or podcast presence",
      "Producing branded content",
      "Scaling social media presence",
      "Running marketing campaigns"
    ]
  },

  Business: {
    industries: [
      "Management Consulting",
      "Financial Services",
      "Human Resources",
      "Business Services",
      "SaaS",
      "Professional Services",
      "Startups",
    ],
    companySize: ["11-50", "51-200", "201-500"],
    jobTitles: [
      "Founder",
      "CEO",
      "COO",
      "Operations Manager",
      "HR Manager",
      "Head of Operations",
      "Business Development Manager",
      "Finance Director"
    ],
    signals: [
      "Rapid company growth",
      "Hiring operations roles",
      "Scaling internal teams",
      "Process optimization initiatives",
      "New market expansion"
    ]
  },

  Other: {
    industries: [
      "Information Technology",
      "Professional Services",
      "Education",
      "E-Commerce",
      "Marketing & Advertising",
      "Business Services"
    ],
    companySize: ["1-10", "11-50", "51-200"],
    jobTitles: [
      "Founder",
      "CEO",
      "Operations Manager",
      "Office Manager",
      "Project Manager",
      "Business Manager"
    ],
    signals: [
      "Growing team",
      "Hiring administrative roles",
      "Scaling operations",
      "New projects launching"
    ]
  }
};