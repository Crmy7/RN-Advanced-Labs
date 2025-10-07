export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

export interface Robot {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
  created_at?: number;
  updated_at?: number;
  archived?: number;
}

export interface RobotsState {
  items: Robot[];
  loading: boolean;
  error: string | null;
}
