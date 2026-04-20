// Types matching the frivillig.rodekors.no API (prefix: main, v1)

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface VaktDistrict {
  id: string;
  crm_guid: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface VaktActivity {
  id: string;
  district_id: string;
  crm_guid: string | null;
  name: string;
  slug: string;
  active: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface VaktDepartment {
  id: string;
  activity_id: string;
  local_union_name: string;
  name: string;
  slug: string;
  description: string | null;
  location: string;
  address: string;
  photo: string | null;
  photo_credit_name: string | null;
  photo_credit_url: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VaktSubactivity {
  id: string;
  department_id: string;
  name: string;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VaktTemplate {
  id: string;
  subactivity_id: string;
  title: string;
  address: string;
  information: string | null;
  message: string | null;
  reminder: number | null;
  start_at: string;
  end_at: string;
  ends_past_midnight: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface VaktShiftBlock {
  id: string;
  subactivity_id: string;
  created_by_user_id: string | null;
  template_id: string | null;
  title: string;
  address: string;
  information: string | null;
  message: string | null;
  reminder: number | null;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
}

export interface VaktShift {
  id: string;
  shift_block_id: string;
  created_by_user_id: string | null;
  user_id: string | null;
  last_user_id: string | null;
  user_role_id: string | null;
  signed_up_by_user_id: string | null;
  reserved_role_id: string | null;
  note: string | null;
  attendance_type: string;
  attendance: string | null;
  batch: number;
  signed_up_at: string | null;
  signed_off_at: string | null;
  reminded_at: string | null;
  notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VaktRole {
  id: string;
  name: string;
}

export interface VaktUser {
  id: string;
  okta_id: string | null;
  active: boolean;
  username: string;
  relation_number: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  about: string | null;
  locale: string;
  last_active_at: string | null;
  informed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pruned_at: string | null;
}

export interface VaktChange {
  id: string;
  activity_id: string;
  department_id: string;
  shift_id: string | null;
  user_id: string | null;
  created_by_user_id: string | null;
  action: string;
  created_at: string;
}
