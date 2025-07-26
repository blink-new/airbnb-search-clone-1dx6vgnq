import { supabase, StorageSpace, Profile, Booking, Review } from './supabase'

export interface SearchFilters {
  university?: string
  storageType?: string
  sizeCategory?: string
  minPrice?: number
  maxPrice?: number
  startDate?: string
  endDate?: string
  campusArea?: string
  amenities?: string[]
}

export interface SearchResult {
  spaces: StorageSpace[]
  total: number
}

// Storage Spaces
export const createStorageSpace = async (spaceData: Omit<StorageSpace, 'id' | 'created_at' | 'updated_at' | 'host'>): Promise<StorageSpace | null> => {
  const { data, error } = await supabase
    .from('storage_spaces')
    .insert({
      ...spaceData,
      is_active: true
    })
    .select(`
      *,
      host:profiles!storage_spaces_host_id_fkey(*)
    `)
    .single()

  if (error) {
    console.error('Error creating storage space:', error)
    throw error
  }

  return data
}

export const searchStorageSpaces = async (
  filters: SearchFilters = {},
  page = 1,
  limit = 12
): Promise<SearchResult> => {
  let query = supabase
    .from('storage_spaces')
    .select(`
      *,
      host:profiles!storage_spaces_host_id_fkey(*)
    `)
    .eq('is_active', true)

  // Apply filters
  if (filters.storageType) {
    query = query.eq('storage_type', filters.storageType)
  }
  
  if (filters.sizeCategory) {
    query = query.eq('size_category', filters.sizeCategory)
  }
  
  if (filters.minPrice !== undefined) {
    query = query.gte('price_per_month', filters.minPrice)
  }
  
  if (filters.maxPrice !== undefined) {
    query = query.lte('price_per_month', filters.maxPrice)
  }
  
  if (filters.startDate) {
    query = query.lte('available_from', filters.startDate)
  }
  
  if (filters.endDate) {
    query = query.gte('available_until', filters.endDate)
  }
  
  if (filters.campusArea) {
    query = query.ilike('campus_area', `%${filters.campusArea}%`)
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    query = query.overlaps('amenities', filters.amenities)
  }

  // Get all spaces first
  const { data: allSpaces, error } = await query
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching storage spaces:', error)
    throw error
  }

  // Filter out spaces that have confirmed bookings overlapping with search dates
  let availableSpaces = allSpaces || []
  
  if (filters.startDate && filters.endDate) {
    // Get all confirmed bookings that overlap with the search period
    const { data: overlappingBookings } = await supabase
      .from('bookings')
      .select('storage_space_id')
      .eq('status', 'confirmed')
      .or(`start_date.lte.${filters.endDate},end_date.gte.${filters.startDate}`)

    const bookedSpaceIds = new Set(overlappingBookings?.map(b => b.storage_space_id) || [])
    availableSpaces = availableSpaces.filter(space => !bookedSpaceIds.has(space.id))
  }

  // Apply pagination to filtered results
  const total = availableSpaces.length
  const paginatedSpaces = availableSpaces.slice((page - 1) * limit, page * limit)

  return {
    spaces: paginatedSpaces,
    total
  }
}

export const getStorageSpaceById = async (id: string): Promise<StorageSpace | null> => {
  const { data, error } = await supabase
    .from('storage_spaces')
    .select(`
      *,
      host:profiles!storage_spaces_host_id_fkey(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching storage space:', error)
    return null
  }

  return data
}

export const getStorageSpacesByHost = async (hostId: string): Promise<StorageSpace[]> => {
  const { data, error } = await supabase
    .from('storage_spaces')
    .select(`
      *,
      host:profiles!storage_spaces_host_id_fkey(*)
    `)
    .eq('host_id', hostId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching host storage spaces:', error)
    throw error
  }

  return data || []
}

export const updateStorageSpace = async (id: string, updates: Partial<StorageSpace>): Promise<StorageSpace | null> => {
  const { data, error } = await supabase
    .from('storage_spaces')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      host:profiles!storage_spaces_host_id_fkey(*)
    `)
    .single()

  if (error) {
    console.error('Error updating storage space:', error)
    throw error
  }

  return data
}

export const deleteStorageSpace = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('storage_spaces')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error deleting storage space:', error)
    throw error
  }

  return true
}

// Profiles
export const getProfile = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export const createProfile = async (profileData: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }

  return data
}

export const ensureProfile = async (user: any): Promise<Profile | null> => {
  // First try to get existing profile
  let profile = await getProfile(user.id)
  
  if (!profile) {
    // Create new profile if it doesn't exist
    profile = await createProfile({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email.split('@')[0],
      university: 'Baylor University', // Default university
      verification_status: 'unverified',
      rating: 0,
      total_reviews: 0
    })
  }
  
  return profile
}

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  return data
}

// Bookings
export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select(`
      *,
      storage_space:storage_spaces(*),
      renter:profiles!bookings_renter_id_fkey(*),
      host:profiles!bookings_host_id_fkey(*)
    `)
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    throw error
  }

  return data
}

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      storage_space:storage_spaces(*),
      renter:profiles!bookings_renter_id_fkey(*),
      host:profiles!bookings_host_id_fkey(*)
    `)
    .or(`renter_id.eq.${userId},host_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user bookings:', error)
    throw error
  }

  return data || []
}

export const getRenterBookings = async (renterId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      storage_space:storage_spaces(*),
      host:profiles!bookings_host_id_fkey(*)
    `)
    .eq('renter_id', renterId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching renter bookings:', error)
    throw error
  }

  return data || []
}

export const getHostBookings = async (hostId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      storage_space:storage_spaces(*),
      renter:profiles!bookings_renter_id_fkey(*)
    `)
    .eq('host_id', hostId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching host bookings:', error)
    throw error
  }

  return data || []
}

export const updateBookingStatus = async (bookingId: string, status: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select(`
      *,
      storage_space:storage_spaces(*),
      renter:profiles!bookings_renter_id_fkey(*),
      host:profiles!bookings_host_id_fkey(*)
    `)
    .single()

  if (error) {
    console.error('Error updating booking status:', error)
    throw error
  }

  return data
}

// Reviews
export const getStorageSpaceReviews = async (storageSpaceId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(*)
    `)
    .eq('storage_space_id', storageSpaceId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }

  return data || []
}

export const createReview = async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(*)
    `)
    .single()

  if (error) {
    console.error('Error creating review:', error)
    throw error
  }

  return data
}

// Utility functions
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}