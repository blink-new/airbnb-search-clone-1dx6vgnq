import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  university: string
  year_in_school: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate'
  major: string
  phone?: string
  bio?: string
  profile_image_url?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface StorageSpace {
  id: string
  host_id: string
  title: string
  description: string
  storage_type: 'dorm_room' | 'apartment' | 'garage' | 'closet' | 'basement' | 'storage_unit'
  size_category: 'small' | 'medium' | 'large' | 'extra_large'
  capacity_description?: string
  price_per_month: number
  location_address: string
  campus_area?: string
  latitude?: number
  longitude?: number
  available_from: string
  available_until: string
  amenities: string[]
  rules?: string
  images: string[]
  is_active: boolean
  can_help_move?: boolean
  has_vehicle?: boolean
  vehicle_type?: string
  move_in_time?: string
  move_out_time?: string
  created_at: string
  updated_at: string
  // Joined data
  host?: Profile
}

export interface Booking {
  id: string
  storage_space_id: string
  renter_id: string
  host_id: string
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  special_requests?: string
  created_at: string
  updated_at: string
  // Joined data
  storage_space?: StorageSpace
  renter?: Profile
  host?: Profile
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  storage_space_id: string
  rating: number
  comment?: string
  review_type: 'host_review' | 'renter_review'
  created_at: string
  // Joined data
  reviewer?: Profile
}