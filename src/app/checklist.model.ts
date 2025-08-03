export interface ChecklistItem {
  id: string;
  region: string;
  section: string;
  description: string;
  page: number;
  bullet: string;
  checked?: boolean;
}
