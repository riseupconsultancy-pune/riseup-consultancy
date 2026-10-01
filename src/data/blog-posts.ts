import { BlogPost } from "@/types/blog";
import { CLUSTER_A_POSTS } from "./blog-clusters/cluster-a";
import { CLUSTER_B_POSTS } from "./blog-clusters/cluster-b";
import { CLUSTER_C_POSTS } from "./blog-clusters/cluster-c";
import { CLUSTER_D_POSTS } from "./blog-clusters/cluster-d";
import { CLUSTER_E_POSTS } from "./blog-clusters/cluster-e";
import { CLUSTER_F_POSTS } from "./blog-clusters/cluster-f";
import { CLUSTER_G_POSTS } from "./blog-clusters/cluster-g";
import { SPECIALIZED_POSTS } from "./blog-clusters/specialized";

/**
 * Master Riseup Consultancy Blog Directory
 * Aggregated 77 industry-grade, SEO-optimized, human-written blog publications:
 * - Cluster A (15): Pune & Maharashtra Regional Domination
 * - Cluster B (15): Pan-India Metro Expansion
 * - Cluster C (8): Authority Rankings & Listicles
 * - Cluster D (7): Specialized Operational Playbooks
 * - Cluster E (10): Expanded Pan-India BPO & Tier-2 Hubs
 * - Cluster F (10): Student & Fresher BPO Careers, Skills & AI Landscape
 * - Cluster G (10): IT Transitions, Salaries, WFH, Night Safety & Top Q&As
 * - Specialized (2): International Voice & Non-Voice Chat Deep-Dives
 */
export const BLOG_POSTS: BlogPost[] = [
  ...CLUSTER_A_POSTS,
  ...CLUSTER_B_POSTS,
  ...CLUSTER_C_POSTS,
  ...CLUSTER_D_POSTS,
  ...CLUSTER_E_POSTS,
  ...CLUSTER_F_POSTS,
  ...CLUSTER_G_POSTS,
  ...SPECIALIZED_POSTS,
];
