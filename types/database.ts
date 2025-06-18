export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          wedding_name: string | null
          wedding_date: string | null
          guest_list_id: string | null
          email_notifications: boolean
          marketing_emails: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          wedding_name?: string | null
          wedding_date?: string | null
          guest_list_id?: string | null
          email_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          wedding_name?: string | null
          wedding_date?: string | null
          guest_list_id?: string | null
          email_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          profile_id: string
          name: string
          capacity: number
          location: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          capacity: number
          location?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          capacity?: number
          location?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          profile_id: string
          table_id: string | null
          name: string
          status: string | null
          dietary_restrictions: string | null
          is_plus_one: boolean
          primary_guest_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          table_id?: string | null
          name: string
          status?: string | null
          dietary_restrictions?: string | null
          is_plus_one?: boolean
          primary_guest_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          table_id?: string | null
          name?: string
          status?: string | null
          dietary_restrictions?: string | null
          is_plus_one?: boolean
          primary_guest_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      public_guest_lists: {
        Row: {
          id: string
          unique_id: string
          profile_id: string
          wedding_name: string
          wedding_date: string | null
          guest_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unique_id: string
          profile_id: string
          wedding_name: string
          wedding_date?: string | null
          guest_data?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unique_id?: string
          profile_id?: string
          wedding_name?: string
          wedding_date?: string | null
          guest_data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}