export interface Guest {
  id: string
  name: string
  tableId: string | null
  tableName?: string
  status?: 'confirmed' | 'pending' | 'declined'
  createdAt: Date
  updatedAt: Date
}

export interface Table {
  id: string
  name: string
  capacity?: number
  location?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CSVImportRow {
  guestName: string
  tableName: string
  isValid: boolean
  errors: string[]
}

export interface ImportResult {
  success: number
  failed: number
  errors: string[]
  duplicates: number
}

export interface GuestFormData {
  name: string
  tableId: string | null
  status?: 'confirmed' | 'pending' | 'declined'
}

export interface TableFormData {
  name: string
  capacity?: number
  location?: string
  description?: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  wedding_name?: string
  wedding_date?: string
  guest_list_id?: string
  created_at: string
  updated_at: string
}

export interface PublicGuestListData {
  weddingName: string
  weddingDate?: string
  guests: Array<{
    name: string
    tableName: string
  }>
}

export interface PublicGuestList {
  id: string
  unique_id: string
  profile_id: string
  wedding_name: string
  wedding_date?: string
  guest_data: Array<{
    name: string
    tableName: string
  }>
  created_at: string
  updated_at: string
}

export interface GuestListGenerationResult {
  success: boolean
  uniqueId?: string
  url?: string
  guestCount?: number
  error?: string
}