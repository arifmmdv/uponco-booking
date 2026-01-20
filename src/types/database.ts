// ============================================================================
// Database Types - Matching Supabase Schema Exactly
// ============================================================================

// Base entity types
export interface Company {
  id: string;
  name: string | null;
  slug: string | null;
  billingAddress: Record<string, unknown> | null;
  businessType: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export interface Location {
  id: string;
  companyId: string;
  name: string | null;
  countryRegion: string | null;
  city: string | null;
  address: string | null;
  postalCode: string | null;
  phone: string | null;
  additional: string | null;
  created_at: string;
  locationType: 'physical' | 'online' | null;
}

export interface Profile {
  id: string;
  updatedAt: string | null;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  userId: string;
}

export interface Service {
  id: string;
  title: string | null;
  priceMin: number | null;
  priceMax: number | null;
  duration: number | null;
  technicalBreak: number | null;
  serviceType: string;
  capacity: number | null;
  categoryId: string | null;
  description: string | null;
  companyId: string | null;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  title: string | null;
  created_at: string;
  companyId: string | null;
}

export interface Role {
  id: string;
  description: string | null;
  name: string | null;
  created_at: string;
  companyId: string | null;
  permissions: string[] | null;
}

// Junction table types
export interface ProfileLocation {
  profileId: string;
  locationId: string;
}

export interface ServiceLocation {
  serviceId: string;
  locationId: string;
}

export interface ServiceAssignment {
  serviceId: string;
  profileId: string;
}

export interface RoleUser {
  id: string;
  roleId: string;
  userId: string;
  companyId: string | null;
}

// Work hours and breaks
export interface UsersWorkHours {
  id: string;
  profileId: string | null;
  companyId: string | null;
  dayOfWeek: number | null; // 0-6 (Sunday-Saturday)
  startTime: string | null; // HH:MM:SS format
  endTime: string | null;
  created_at: string;
}

export interface UsersWorkBreaks {
  id: string;
  workHourId: string | null;
  startTime: string | null;
  endTime: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  companyId: string;
  specialistId: string;
  locationId: string | null;
  time: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  comment: string | null;
  created_at: string;
}

// ============================================================================
// Supabase Query Response Types - Nested structure from the query
// ============================================================================

export interface SupabaseProfileLocation {
  profileId: string;
}

export interface SupabaseServiceLocation {
  locationId: string;
}

export interface SupabaseServiceAssignment {
  profileId: string;
}

export interface SupabaseServiceCategory {
  id: string;
  title: string | null;
}

export interface SupabaseWorkBreak {
  startTime: string | null;
  endTime: string | null;
  workHourId: string | null;
}

export interface SupabaseWorkHours {
  dayOfWeek: number | null;
  startTime: string | null;
  endTime: string | null;
  companyId: string | null;
  users_work_breaks: SupabaseWorkBreak[];
}

export interface SupabaseProfile {
  id: string;
  fullName: string | null;
  email: string;
  users_work_hours: SupabaseWorkHours[];
}

export interface SupabaseRoleUser {
  profiles: SupabaseProfile | null;
}

export interface SupabaseLocation {
  id: string;
  name: string | null;
  profile_locations: SupabaseProfileLocation[];
}

export interface SupabaseService {
  id: string;
  title: string | null;
  priceMin: number | null;
  priceMax: number | null;
  duration: number | null;
  technicalBreak: number | null;
  serviceType: string;
  capacity: number | null;
  description: string | null;
  service_categories: SupabaseServiceCategory | null;
  service_locations: SupabaseServiceLocation[];
  service_assignments: SupabaseServiceAssignment[];
}

// Main query response type
export interface SupabaseCompanyResponse {
  id: string;
  name: string | null;
  locations: SupabaseLocation[];
  services: SupabaseService[];
  role_user: SupabaseRoleUser[];
}
