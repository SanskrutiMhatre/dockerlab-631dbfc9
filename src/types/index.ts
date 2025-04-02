
export interface DockerImage {
  id: string;
  semester: string;
  subject: string;
  pullCommand: string;
  runCommand: string;
  instructions: string;
  notes: string;
}

export interface DocumentField {
  id: string;
  type: 'heading' | 'content' | 'command' | 'image';
  value: string;
}

export interface Document {
  id: string;
  title: string;
  fields: DocumentField[];
}

export type Semester = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
