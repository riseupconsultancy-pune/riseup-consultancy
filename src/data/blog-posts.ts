import { BlogPost } from "@/types/blog";
import { CLUSTER_A_POSTS } from "./blog-clusters/cluster-a";
import { CLUSTER_B_POSTS } from "./blog-clusters/cluster-b";
import { CLUSTER_C_POSTS } from "./blog-clusters/cluster-c";
import { CLUSTER_D_POSTS } from "./blog-clusters/cluster-d";
import { CLUSTER_E_POSTS } from "./blog-clusters/cluster-e";
import { SPECIALIZED_POSTS } from "./blog-clusters/specialized";

/**
 * Master Riseup Consultancy Blog Directory
 * Aggregated 57 industry-grade, SEO-optimized, human-written blog publications
 * across Pune/Maharashtra (Cluster A), Pan-India metros (Cluster B),
 * Authority rankings/listicles (Cluster C), Specialized vertical guides (Cluster D),
 * and Expanded Pan-India BPO & Tier-2 Hubs (Cluster E).
 */
export const BLOG_POSTS: BlogPost[] = [
  ...CLUSTER_A_POSTS,
  ...CLUSTER_B_POSTS,
  ...CLUSTER_C_POSTS,
  ...CLUSTER_D_POSTS,
  ...CLUSTER_E_POSTS,
  ...SPECIALIZED_POSTS,
];
