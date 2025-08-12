export interface Question {
  id: number;
  questionText: string;
  options: string[];
  section: string;
  correctOption: number;
  explanation: string;
}

export interface Quiz {
  questions: Question[];
}
