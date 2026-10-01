export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  linkedin?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogComment {
  id: string;
  name: string;
  role: string;
  company: string;
  date: string;
  comment: string;
  avatar?: string;
}

export interface BlogKeyMetric {
  label: string;
  value: string;
  description: string;
}

export interface BlogContentSection {
  id: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  calloutBox?: {
    type: "problem" | "solution" | "insight" | "stat";
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  city: string;
  readTime: string;
  views: number;
  likes: number;
  commentsCount: number;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  coverImage: string;
  coverImageAlt: string;
  author: BlogAuthor;
  
  // Structured Framework: Subject -> Problem -> Solution -> Our Relevant Services
  subject: {
    title: string;
    summary: string;
    metrics: BlogKeyMetric[];
  };
  
  problem: {
    headline: string;
    description: string;
    painPoints: {
      title: string;
      description: string;
      impact: string;
    }[];
  };
  
  solution: {
    headline: string;
    description: string;
    steps: {
      stepNumber: string;
      title: string;
      detail: string;
    }[];
  };
  
  relevantServices: {
    headline: string;
    description: string;
    services: {
      name: string;
      sla: string;
      description: string;
      suitableFor: string;
    }[];
  };
  
  comparisonTable: {
    title: string;
    subtitle: string;
    headers: string[];
    rows: string[][];
  };
  
  faqs: BlogFaq[];
  comments: BlogComment[];
  tags: string[];
  seoKeywords: string[];
  cta?: {
    title: string;
    subtitle: string;
    primaryText: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryLink?: string;
  };
}
