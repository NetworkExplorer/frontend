export interface BubbleI {
  type: "WARNING" | "ERROR" | "INFORMATION" | "SUCCESS";
  title: string;
  message?: string;
  when?: Date;
}

export interface SearchI {
  searching: boolean;
  searchText?: string;
  searchingAll?: boolean;
}
