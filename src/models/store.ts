export interface BubbleI {
  type: "WARNING" | "ERROR" | "INFORMATION" | "SUCCESS";
  title: string;
  message?: string;
  when?: Date;
}