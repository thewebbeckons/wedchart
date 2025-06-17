import { defineStore } from 'pinia'
import type { Guest, Table, GuestFormData, TableFormData, CSVImportRow, ImportResult, GuestListGenerationResult, PublicGuestList } from '~/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export const useWeddingStore = defineStore('wedding', () => {
  // State
  const guests = ref<Guest[]>([])
  const tables = ref<Table[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const realtimeChannel = ref<RealtimeChannel | null>(null)

  // Computed
  const guestsWithTableNames = computed(() => {
    if (!guests.value || !Array.isArray(guests.value)) return []
    if (!tables.value || !Array.isArray(tables.value)) return []
    
    return guests.value.map(guest => ({
      ...guest,
      tableName: guest.tableId ? tables.value.find(t => t.id === guest.tableId)?.name || 'Unknown' : 'Unassigned'
    }))
  })

  const tableOptions = computed(() => {
    if (!tables.value || !Array.isArray(tables.value)) return [{ label: 'Unassigned', value: null }]
    
    return [
      { label: 'Unassigned', value: null },
      ...tables.value.map(table => ({
        label: table.name,
        value: table.id
      }))
    ]
  })

  const confirmedGuestsWithTables = computed(() => {
    if (!guests.value || !Array.isArray(guests.value)) return []
    if (!tables.value || !Array.isArray(tables.value)) return []
    
    console.log('Computing confirmed guests with tables...')
    console.log('All guests:', guests.value)
    console.log('All tables:', tables.value)
    
    const confirmedGuests = guests.value
      .filter(guest => {
        const isConfirmed = guest.status === 'confirmed'
        const hasTable = !!guest.tableId
        console.log(`Guest ${guest.name}: status=${guest.status}, confirmed=${isConfirmed}, tableId=${guest.tableId}, hasTable=${hasTable}`)
        return isConfirmed && hasTable
      })
      .map(guest => {
        const table = tables.value.find(t => t.id === guest.tableId)
        const tableName = table?.name || 'Unknown Table'
        console.log(`Mapping guest ${guest.name} to table ${tableName}`)
        return {
          name: guest.name,
          tableName
        }
      })
    
    console.log('Final confirmed guests with tables:', confirmedGuests)
    return confirmedGuests
  })

  // Actions
  const { $supabase } = useNuxtApp()
  const authStore = useAuthStore()

  const getCurrentProfileId = (): string | null => {
    return authStore.profile?.id || null
  }

  const generateUniqueId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateGuestListLink = async (): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      loading.value = true
      error.value = null

      const profileId = getCurrentProfileId()
      if (!profileId) {
        return { success: false, error: 'No profile found' }
      }

      // Check if guest list ID already exists
      if (authStore.profile?.guest_list_id) {
        const weddingName = authStore.profile.wedding_name || 'wedding'
        const urlFriendlyName = weddingName.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()

        const url = `${window.location.origin}/guest-list/${authStore.profile.guest_list_id}/${urlFriendlyName}`
        return { success: true, url }
      }

      // Generate new guest list ID
      const guestListId = generateUniqueId()

      const { error: updateError } = await $supabase
        .from('profiles')
        .update({ guest_list_id: guestListId })
        .eq('id', profileId)

      if (updateError) throw updateError

      // Update local profile
      await authStore.fetchProfile()

      const weddingName = authStore.profile?.wedding_name || 'wedding'
      const urlFriendlyName = weddingName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const url = `${window.location.origin}/guest-list/${guestListId}/${urlFriendlyName}`
      return { success: true, url }
    } catch (err: any) {
      console.error('Error generating guest list link:', err)
      error.value = err.message || 'Failed to generate guest list link'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const generateComprehensiveGuestList = async (): Promise<GuestListGenerationResult> => {
    try {
      loading.value = true
      error.value = null

      const profileId = getCurrentProfileId()
      if (!profileId || !authStore.profile) {
        return { success: false, error: 'No profile found' }
      }

      console.log('Starting guest list generation...')
      console.log('Profile ID:', profileId)
      console.log('Auth profile:', authStore.profile)

      // Get confirmed guests with table assignments
      const confirmedGuests = confirmedGuestsWithTables.value
      console.log('Confirmed guests for list generation:', confirmedGuests)

      if (confirmedGuests.length === 0) {
        console.log('No confirmed guests found')
        return { success: false, error: 'No confirmed guests with table assignments found' }
      }

      // Use existing guest_list_id from profile or generate a new one
      let targetUniqueId = authStore.profile.guest_list_id
      
      if (!targetUniqueId) {
        // Generate new unique ID if profile doesn't have one
        targetUniqueId = generateUniqueId()
        console.log('Generated new unique ID:', targetUniqueId)
        
        // Update profile with new guest list ID
        const { error: profileUpdateError } = await $supabase
          .from('profiles')
          .update({ guest_list_id: targetUniqueId })
          .eq('id', profileId)

        if (profileUpdateError) {
          console.error('Error updating profile with guest list ID:', profileUpdateError)
          throw profileUpdateError
        }
        
        await authStore.fetchProfile()
        console.log('Profile updated with new guest list ID')
      } else {
        console.log('Using existing guest list ID from profile:', targetUniqueId)
      }

      // Prepare guest list data
      const guestListData = {
        unique_id: targetUniqueId,
        profile_id: profileId,
        wedding_name: authStore.profile.wedding_name || `${authStore.profile.full_name}'s Wedding`,
        wedding_date: authStore.profile.wedding_date || null,
        guest_data: confirmedGuests
      }

      console.log('Guest list data to insert/update:', guestListData)

      // Check if a public guest list already exists with the target unique_id
      const { data: existingList, error: checkError } = await $supabase
        .from('public_guest_lists')
        .select('id, unique_id')
        .eq('unique_id', targetUniqueId)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing list:', checkError)
        throw checkError
      }

      console.log('Existing list check result:', existingList)

      if (existingList) {
        console.log('Updating existing list with unique_id:', targetUniqueId)
        // Update existing list
        const { error: updateError } = await $supabase
          .from('public_guest_lists')
          .update({
            wedding_name: guestListData.wedding_name,
            wedding_date: guestListData.wedding_date,
            guest_data: guestListData.guest_data
          })
          .eq('unique_id', targetUniqueId)

        if (updateError) {
          console.error('Error updating existing list:', updateError)
          throw updateError
        }
        console.log('Successfully updated existing list')
      } else {
        console.log('Creating new list with unique_id:', targetUniqueId)
        // Create new list with the target unique_id
        const { error: insertError } = await $supabase
          .from('public_guest_lists')
          .insert(guestListData)

        if (insertError) {
          console.error('Error creating new list:', insertError)
          throw insertError
        }
        console.log('Successfully created new list')
      }

      // Generate public URL
      const weddingName = authStore.profile.wedding_name || 'wedding'
      const urlFriendlyName = weddingName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const url = `${window.location.origin}/guest-list/${targetUniqueId}/${urlFriendlyName}`
      console.log('Generated URL:', url)

      return {
        success: true,
        uniqueId: targetUniqueId,
        url,
        guestCount: confirmedGuests.length
      }

    } catch (err: any) {
      console.error('Error generating comprehensive guest list:', err)
      error.value = err.message || 'Failed to generate guest list'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getPublicGuestList = async (uniqueId: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log('Fetching public guest list with unique ID:', uniqueId)
      
      const { data, error: fetchError } = await $supabase
        .from('public_guest_lists')
        .select('wedding_name, wedding_date, guest_data')
        .eq('unique_id', uniqueId)
        .maybeSingle()

      if (fetchError) {
        console.error('Database error:', fetchError)
        return { success: false, error: 'Failed to fetch guest list from database' }
      }

      console.log('Raw database result:', data)

      if (!data) {
        console.log('No guest list found for unique ID:', uniqueId)
        return { success: false, error: 'Guest list not found' }
      }

      console.log('Guest data from database:', data.guest_data)
      console.log('Guest data type:', typeof data.guest_data)
      console.log('Guest data length:', Array.isArray(data.guest_data) ? data.guest_data.length : 'not an array')

      const result = {
        success: true,
        data: {
          weddingName: data.wedding_name,
          weddingDate: data.wedding_date,
          guests: data.guest_data || []
        }
      }

      console.log('Returning result:', result)
      return result
    } catch (err: any) {
      console.error('Error fetching public guest list:', err)
      return { success: false, error: err.message || 'Failed to fetch guest list' }
    }
  }

  const validateGuestData = (guestData: GuestFormData): string[] => {
    const errors: string[] = []
    
    if (!guestData.name?.trim()) {
      errors.push('Guest name is required')
    }
    
    if (guestData.name && guestData.name.trim().length < 2) {
      errors.push('Guest name must be at least 2 characters')
    }
    
    return errors
  }

  const checkDuplicateGuest = (name: string, excludeId?: string): boolean => {
    if (!guests.value || !Array.isArray(guests.value)) return false
    
    return guests.value.some(guest => 
      guest.name.toLowerCase().trim() === name.toLowerCase().trim() && 
      guest.id !== excludeId
    )
  }

  const fetchGuests = async (): Promise<boolean> => {
    try {
      const profileId = getCurrentProfileId()
      if (!profileId) {
        error.value = 'No profile found'
        return false
      }

      console.log('Fetching guests for profile:', profileId)

      const { data, error: fetchError } = await $supabase
        .from('guests')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      console.log('Raw guest data from database:', data)

      guests.value = (data || []).map(guest => ({
        id: guest.id,
        name: guest.name,
        tableId: guest.table_id,
        status: guest.status as 'confirmed' | 'pending' | 'declined' | undefined,
        dietaryRestrictions: guest.dietary_restrictions || undefined,
        isPlusOne: guest.is_plus_one || false,
        primaryGuestId: guest.primary_guest_id || undefined,
        createdAt: new Date(guest.created_at),
        updatedAt: new Date(guest.updated_at)
      }))

      console.log('Processed guests:', guests.value)
      return true
    } catch (err: any) {
      console.error('Error fetching guests:', err)
      error.value = err.message || 'Failed to fetch guests'
      return false
    }
  }

  const fetchTables = async (): Promise<boolean> => {
    try {
      const profileId = getCurrentProfileId()
      if (!profileId) {
        error.value = 'No profile found'
        return false
      }

      console.log('Fetching tables for profile:', profileId)

      const { data, error: fetchError } = await $supabase
        .from('tables')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      console.log('Raw table data from database:', data)

      tables.value = (data || []).map(table => ({
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        location: table.location || undefined,
        description: table.description || undefined,
        createdAt: new Date(table.created_at),
        updatedAt: new Date(table.updated_at)
      }))

      console.log('Processed tables:', tables.value)
      return true
    } catch (err: any) {
      console.error('Error fetching tables:', err)
      error.value = err.message || 'Failed to fetch tables'
      return false
    }
  }

  const addGuest = async (guestData: GuestFormData): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const profileId = getCurrentProfileId()
      if (!profileId) {
        error.value = 'No profile found'
        return false
      }

      // Validate data
      const validationErrors = validateGuestData(guestData)
      if (validationErrors.length > 0) {
        error.value = validationErrors[0]
        return false
      }

      // Check for duplicates
      if (checkDuplicateGuest(guestData.name)) {
        error.value = 'A guest with this name already exists'
        return false
      }

      // Ensure tableId is properly handled - convert empty string, null, or "Unassigned" to null
      const tableId = guestData.tableId === '' || guestData.tableId === null || guestData.tableId === 'Unassigned' ? null : guestData.tableId

      // Insert primary guest
      const { data: primaryGuestData, error: insertError } = await $supabase
        .from('guests')
        .insert({
          profile_id: profileId,
          name: guestData.name.trim(),
          table_id: tableId,
          status: guestData.status || 'pending',
          dietary_restrictions: guestData.dietaryRestrictions?.trim() || null,
          is_plus_one: false,
          primary_guest_id: null
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Add to local state
      const newGuest: Guest = {
        id: primaryGuestData.id,
        name: primaryGuestData.name,
        tableId: primaryGuestData.table_id,
        status: primaryGuestData.status as 'confirmed' | 'pending' | 'declined' | undefined,
        dietaryRestrictions: primaryGuestData.dietary_restrictions || undefined,
        isPlusOne: false,
        primaryGuestId: undefined,
        createdAt: new Date(primaryGuestData.created_at),
        updatedAt: new Date(primaryGuestData.updated_at)
      }
      
      if (!guests.value) guests.value = []
      guests.value.unshift(newGuest)

      // If plus one is specified, add plus one guest
      if (guestData.hasPlusOne && guestData.plusOneName?.trim()) {
        // Check for plus one duplicate
        if (checkDuplicateGuest(guestData.plusOneName)) {
          error.value = 'A guest with the plus one name already exists'
          return false
        }

        const { data: plusOneData, error: plusOneError } = await $supabase
          .from('guests')
          .insert({
            profile_id: profileId,
            name: guestData.plusOneName.trim(),
            table_id: tableId, // Same table as primary guest
            status: guestData.status || 'pending', // Same status as primary guest
            dietary_restrictions: null, // Plus one can have their own dietary restrictions set later
            is_plus_one: true,
            primary_guest_id: primaryGuestData.id
          })
          .select()
          .single()

        if (plusOneError) {
          console.error('Error adding plus one guest:', plusOneError)
          // Don't fail the entire operation, just log the error
        } else {
          const newPlusOneGuest: Guest = {
            id: plusOneData.id,
            name: plusOneData.name,
            tableId: plusOneData.table_id,
            status: plusOneData.status as 'confirmed' | 'pending' | 'declined' | undefined,
            dietaryRestrictions: undefined,
            isPlusOne: true,
            primaryGuestId: primaryGuestData.id,
            createdAt: new Date(plusOneData.created_at),
            updatedAt: new Date(plusOneData.updated_at)
          }
          
          guests.value.unshift(newPlusOneGuest)
        }
      }

      return true
    } catch (err: any) {
      console.error('Error adding guest:', err)
      error.value = err.message || 'Failed to add guest'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateGuest = async (id: string, guestData: GuestFormData): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      // Validate data
      const validationErrors = validateGuestData(guestData)
      if (validationErrors.length > 0) {
        error.value = validationErrors[0]
        return false
      }

      // Check for duplicates (excluding current guest)
      if (checkDuplicateGuest(guestData.name, id)) {
        error.value = 'A guest with this name already exists'
        return false
      }

      // Ensure tableId is properly handled - convert empty string, null, or "Unassigned" to null
      const tableId = guestData.tableId === '' || guestData.tableId === null || guestData.tableId === 'Unassigned' ? null : guestData.tableId

      const { data, error: updateError } = await $supabase
        .from('guests')
        .update({
          name: guestData.name.trim(),
          table_id: tableId,
          status: guestData.status || 'pending',
          dietary_restrictions: guestData.dietaryRestrictions?.trim() || null
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      if (guests.value && Array.isArray(guests.value)) {
        const index = guests.value.findIndex(g => g.id === id)
        if (index !== -1) {
          guests.value[index] = {
            id: data.id,
            name: data.name,
            tableId: data.table_id,
            status: data.status as 'confirmed' | 'pending' | 'declined' | undefined,
            dietaryRestrictions: data.dietary_restrictions || undefined,
            isPlusOne: data.is_plus_one || false,
            primaryGuestId: data.primary_guest_id || undefined,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          }
        }
      }

      // If this guest has plus ones, update their table assignments too
      const plusOneGuests = guests.value.filter(g => g.primaryGuestId === id)
      if (plusOneGuests.length > 0) {
        for (const plusOne of plusOneGuests) {
          await $supabase
            .from('guests')
            .update({
              table_id: tableId,
              status: guestData.status || 'pending'
            })
            .eq('id', plusOne.id)

          // Update local state for plus one
          const plusOneIndex = guests.value.findIndex(g => g.id === plusOne.id)
          if (plusOneIndex !== -1) {
            guests.value[plusOneIndex].tableId = tableId
            guests.value[plusOneIndex].status = guestData.status as 'confirmed' | 'pending' | 'declined' | undefined
          }
        }
      }

      return true
    } catch (err: any) {
      console.error('Error updating guest:', err)
      error.value = err.message || 'Failed to update guest'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteGuest = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      // Find the guest to delete
      const guestToDelete = guests.value.find(g => g.id === id)
      if (!guestToDelete) {
        error.value = 'Guest not found'
        return false
      }

      // If this is a primary guest, also delete their plus ones
      if (!guestToDelete.isPlusOne) {
        const plusOneGuests = guests.value.filter(g => g.primaryGuestId === id)
        
        for (const plusOne of plusOneGuests) {
          const { error: deletePlusOneError } = await $supabase
            .from('guests')
            .delete()
            .eq('id', plusOne.id)

          if (deletePlusOneError) {
            console.error('Error deleting plus one guest:', deletePlusOneError)
          } else {
            // Remove from local state
            const plusOneIndex = guests.value.findIndex(g => g.id === plusOne.id)
            if (plusOneIndex !== -1) {
              guests.value.splice(plusOneIndex, 1)
            }
          }
        }
      }

      // Delete the main guest
      const { error: deleteError } = await $supabase
        .from('guests')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remove from local state
      if (guests.value && Array.isArray(guests.value)) {
        const index = guests.value.findIndex(g => g.id === id)
        if (index !== -1) {
          guests.value.splice(index, 1)
        }
      }

      return true
    } catch (err: any) {
      console.error('Error deleting guest:', err)
      error.value = err.message || 'Failed to delete guest'
      return false
    } finally {
      loading.value = false
    }
  }

  const addTable = async (tableData: TableFormData): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const profileId = getCurrentProfileId()
      if (!profileId) {
        error.value = 'No profile found'
        return false
      }

      if (!tableData.name?.trim()) {
        error.value = 'Table name is required'
        return false
      }

      // Check for duplicate table names
      if (tables.value && Array.isArray(tables.value)) {
        const exists = tables.value.some(t => 
          t.name.toLowerCase() === tableData.name.trim().toLowerCase()
        )
        
        if (exists) {
          error.value = 'A table with this name already exists'
          return false
        }
      }

      const { data, error: insertError } = await $supabase
        .from('tables')
        .insert({
          profile_id: profileId,
          name: tableData.name.trim(),
          capacity: tableData.capacity || 8,
          location: tableData.location?.trim() || null,
          description: tableData.description?.trim() || null
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Add to local state
      const newTable: Table = {
        id: data.id,
        name: data.name,
        capacity: data.capacity,
        location: data.location || undefined,
        description: data.description || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
      
      if (!tables.value) tables.value = []
      tables.value.unshift(newTable)
      return true
    } catch (err: any) {
      console.error('Error adding table:', err)
      error.value = err.message || 'Failed to add table'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteTable = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      // Check if any guests are assigned to this table
      if (guests.value && Array.isArray(guests.value)) {
        const hasGuests = guests.value.some(g => g.tableId === id)
        if (hasGuests) {
          error.value = 'Cannot delete table with assigned guests. Please reassign guests first.'
          return false
        }
      }

      const { error: deleteError } = await $supabase
        .from('tables')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remove from local state
      if (tables.value && Array.isArray(tables.value)) {
        const index = tables.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tables.value.splice(index, 1)
        }
      }

      return true
    } catch (err: any) {
      console.error('Error deleting table:', err)
      error.value = err.message || 'Failed to delete table'
      return false
    } finally {
      loading.value = false
    }
  }

  const parseCSV = (csvText: string): CSVImportRow[] => {
    const lines = csvText.trim().split('\n')
    const header = lines[0]
    
    // Validate header
    if (!header.toLowerCase().includes('guest') || !header.toLowerCase().includes('table')) {
      throw new Error('CSV must have "Guest Name" and "Table Name" columns')
    }

    const rows: CSVImportRow[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const [guestName, tableName] = line.split(',').map(s => s.trim().replace(/"/g, ''))
      const errors: string[] = []
      
      if (!guestName) {
        errors.push('Guest name is required')
      } else if (guestName.length < 2) {
        errors.push('Guest name must be at least 2 characters')
      }
      
      if (!tableName) {
        errors.push('Table name is required')
      }
      
      // Check for duplicates in existing guests
      if (guestName && checkDuplicateGuest(guestName)) {
        errors.push('Guest already exists')
      }
      
      rows.push({
        guestName: guestName || '',
        tableName: tableName || '',
        isValid: errors.length === 0,
        errors
      })
    }
    
    return rows
  }

  const importFromCSV = async (csvData: CSVImportRow[]): Promise<ImportResult> => {
    try {
      loading.value = true
      error.value = null

      const profileId = getCurrentProfileId()
      if (!profileId) {
        throw new Error('No profile found')
      }

      const result: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
        duplicates: 0
      }

      for (const row of csvData) {
        if (!row.isValid) {
          result.failed++
          result.errors.push(`${row.guestName}: ${row.errors.join(', ')}`)
          continue
        }

        try {
          // Find or create table
          let table = tables.value?.find(t => 
            t.name.toLowerCase() === row.tableName.toLowerCase()
          )
          
          if (!table) {
            const { data: tableData, error: tableError } = await $supabase
              .from('tables')
              .insert({
                profile_id: profileId,
                name: row.tableName,
                capacity: 8
              })
              .select()
              .single()

            if (tableError) throw tableError

            table = {
              id: tableData.id,
              name: tableData.name,
              capacity: tableData.capacity,
              createdAt: new Date(tableData.created_at),
              updatedAt: new Date(tableData.updated_at)
            }
            
            if (!tables.value) tables.value = []
            tables.value.push(table)
          }

          // Add guest
          const { data: guestData, error: guestError } = await $supabase
            .from('guests')
            .insert({
              profile_id: profileId,
              name: row.guestName,
              table_id: table.id,
              status: 'pending',
              is_plus_one: false,
              primary_guest_id: null
            })
            .select()
            .single()

          if (guestError) throw guestError

          const newGuest: Guest = {
            id: guestData.id,
            name: guestData.name,
            tableId: guestData.table_id,
            status: guestData.status as 'confirmed' | 'pending' | 'declined' | undefined,
            dietaryRestrictions: undefined,
            isPlusOne: false,
            primaryGuestId: undefined,
            createdAt: new Date(guestData.created_at),
            updatedAt: new Date(guestData.updated_at)
          }
          
          if (!guests.value) guests.value = []
          guests.value.push(newGuest)
          result.success++
          
        } catch (err: any) {
          result.failed++
          result.errors.push(`${row.guestName}: ${err.message}`)
        }
      }

      return result
    } catch (err: any) {
      console.error('Import error:', err)
      error.value = err.message || 'Failed to import CSV data'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setupRealtime = () => {
    if (!$supabase || realtimeChannel.value) return

    const profileId = getCurrentProfileId()
    if (!profileId) return

    realtimeChannel.value = $supabase
      .channel('wedding-data')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guests',
          filter: `profile_id=eq.${profileId}`
        },
        (payload) => {
          console.log('Guest change received:', payload)
          
          if (!guests.value) guests.value = []
          
          if (payload.eventType === 'INSERT') {
            const newGuest: Guest = {
              id: payload.new.id,
              name: payload.new.name,
              tableId: payload.new.table_id,
              status: payload.new.status,
              dietaryRestrictions: payload.new.dietary_restrictions || undefined,
              isPlusOne: payload.new.is_plus_one || false,
              primaryGuestId: payload.new.primary_guest_id || undefined,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at)
            }
            
            // Only add if not already in local state
            if (!guests.value.find(g => g.id === newGuest.id)) {
              guests.value.unshift(newGuest)
            }
          } else if (payload.eventType === 'UPDATE') {
            const index = guests.value.findIndex(g => g.id === payload.new.id)
            if (index !== -1) {
              guests.value[index] = {
                id: payload.new.id,
                name: payload.new.name,
                tableId: payload.new.table_id,
                status: payload.new.status,
                dietaryRestrictions: payload.new.dietary_restrictions || undefined,
                isPlusOne: payload.new.is_plus_one || false,
                primaryGuestId: payload.new.primary_guest_id || undefined,
                createdAt: new Date(payload.new.created_at),
                updatedAt: new Date(payload.new.updated_at)
              }
            }
          } else if (payload.eventType === 'DELETE') {
            const index = guests.value.findIndex(g => g.id === payload.old.id)
            if (index !== -1) {
              guests.value.splice(index, 1)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables',
          filter: `profile_id=eq.${profileId}`
        },
        (payload) => {
          console.log('Table change received:', payload)
          
          if (!tables.value) tables.value = []
          
          if (payload.eventType === 'INSERT') {
            const newTable: Table = {
              id: payload.new.id,
              name: payload.new.name,
              capacity: payload.new.capacity,
              location: payload.new.location,
              description: payload.new.description,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at)
            }
            
            if (!tables.value.find(t => t.id === newTable.id)) {
              tables.value.unshift(newTable)
            }
          } else if (payload.eventType === 'UPDATE') {
            const index = tables.value.findIndex(t => t.id === payload.new.id)
            if (index !== -1) {
              tables.value[index] = {
                id: payload.new.id,
                name: payload.new.name,
                capacity: payload.new.capacity,
                location: payload.new.location,
                description: payload.new.description,
                createdAt: new Date(payload.new.created_at),
                updatedAt: new Date(payload.new.updated_at)
              }
            }
          } else if (payload.eventType === 'DELETE') {
            const index = tables.value.findIndex(t => t.id === payload.old.id)
            if (index !== -1) {
              tables.value.splice(index, 1)
            }
          }
        }
      )
      .subscribe()
  }

  const cleanupRealtime = () => {
    if (realtimeChannel.value) {
      $supabase.removeChannel(realtimeChannel.value)
      realtimeChannel.value = null
    }
  }

  const initializeData = async () => {
    if (initialized.value) return

    try {
      loading.value = true
      error.value = null

      // Wait for auth to be ready
      if (!authStore.isAuthenticated || !authStore.profile) {
        return
      }

      console.log('Initializing wedding data...')

      // Initialize arrays if they don't exist
      if (!guests.value) guests.value = []
      if (!tables.value) tables.value = []

      // Fetch initial data
      await Promise.all([
        fetchTables(),
        fetchGuests()
      ])

      // Setup realtime subscriptions
      setupRealtime()
      
      initialized.value = true
      console.log('Wedding data initialization complete')
    } catch (err: any) {
      console.error('Error initializing data:', err)
      error.value = err.message || 'Failed to initialize data'
    } finally {
      loading.value = false
    }
  }

  const resetStore = () => {
    guests.value = []
    tables.value = []
    loading.value = false
    error.value = null
    initialized.value = false
    cleanupRealtime()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupRealtime()
  })

  return {
    // State
    guests: readonly(guests),
    tables: readonly(tables),
    loading: readonly(loading),
    error: readonly(error),
    initialized: readonly(initialized),
    
    // Computed
    guestsWithTableNames,
    tableOptions,
    confirmedGuestsWithTables,
    
    // Actions
    addGuest,
    updateGuest,
    deleteGuest,
    addTable,
    deleteTable,
    parseCSV,
    importFromCSV,
    initializeData,
    resetStore,
    fetchGuests,
    fetchTables,
    generateGuestListLink,
    generateComprehensiveGuestList,
    getPublicGuestList
  }
})