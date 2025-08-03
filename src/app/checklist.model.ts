export interface GroupedChecklist {
  [region: string]: {
    [section: string]: ChecklistItem[];
  };
}

export interface ChecklistItem {
  id: string;
  region: string;
  section: string;
  description: string;
  bullet: string;
  checked?: boolean;
  optional?: boolean;
}
