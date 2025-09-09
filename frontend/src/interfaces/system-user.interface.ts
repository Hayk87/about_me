export interface SystemUserStaffInterface {
  id: number;
  title: Record<string, string>;
  rights: string[];
}

export interface SystemUserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  staff?: SystemUserStaffInterface;
  is_blocked: boolean;
  is_deleted: boolean;
  is_root: boolean
  authenticator_enabled: boolean
  created_at: string;
  updated_at: string
}
