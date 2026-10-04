export type Project = {
  slug: string;
  name: string;
  description: string;
  status: "building" | "shipped";
  stack: string[];
  repo?: string;
};

/** The cards on the Building Journey tab. */
export const projects: Project[] = [];
