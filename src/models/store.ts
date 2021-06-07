export interface BubbleI {
  type: "WARNING" | "ERROR" | "INFORMATION" | "SUCCESS";
  title: string;
  message?: string;
  when?: Date;
}

export interface SearchI {
  searching: boolean;
  shouldFocus: boolean;
  searchText?: string;
  searchingAll?: boolean;
}

export interface ProgressFileI {
  name: string;
  total: number;
  progress: number;
  cwd: string;
}
