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
