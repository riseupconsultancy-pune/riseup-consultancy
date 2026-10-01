import { BlogPost } from "@/types/blog";
import { BLOG_POSTS } from "@/data/blog-posts";

/**
 * Riseup Blog Service Layer
 * 
 * DESIGNED FOR EASY FUTURE CRM INTEGRATION:
 * When you build the "Create Blog / Write Blog" section in the CRM Panel later,
 * you can simply query your Prisma database table here:
 * 
 *   const dbPost = await prisma.blogPost.findUnique({ where: { slug } });
 *   if (dbPost) return dbPost;
 *   return BLOG_POSTS.find(p => p.slug === slug);
 * 
 * This ensures that existing static blogs and new CRM-created blogs
 * will both render seamlessly with the exact same schemas and design!
 */

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Return static posts (ready to merge with database posts in future)
  return BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return post || null;
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  const featured = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0] || null;
  return featured;
}

export async function getRelatedPosts(currentSlug: string, count = 3): Promise<BlogPost[]> {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, count);
}

export async function getAllBlogCategories(): Promise<string[]> {
  const categories = new Set(BLOG_POSTS.map((p) => p.category));
  return Array.from(categories);
}
