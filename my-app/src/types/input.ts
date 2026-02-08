import { SlideType, TargetAudience, DensityMode } from './slide';

export interface SlideInput {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType: SlideType;
  audience: TargetAudience;
  density: DensityMode;
  isRegeneration?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  created_at: string;
  daily_generation_count: number;
  last_generation_date?: string;
  tier: 'free' | 'pro' | 'enterprise';
}

export interface SlideRecord {
  id: string;
  user_id: string;
  context_input: string;
  message_input: string;
  data_input?: string;
  file_input_url?: string;
  slide_type: string;
  target_audience: string;
  density_mode: string;
  llm_blueprint: object;
  selected_template: string;
  template_props: object;
  feedback?: 'thumbs_up' | 'thumbs_down';
  regeneration_count: number;
  llm_model_used?: string;
  generation_time_ms?: number;
  created_at: string;
}
