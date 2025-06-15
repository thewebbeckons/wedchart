import { defineStore } from 'pinia'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  const { $supabase } = useNuxtApp()

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    weddingName?: string | null, 
    weddingDate?: string | null
  ) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await $supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            wedding_name: weddingName,
            wedding_date: weddingDate
          }
        }
      })

      if (signUpError) throw signUpError

      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await $supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await $supabase.auth.signOut()
      if (signOutError) throw signOutError

      user.value = null
      profile.value = null
      session.value = null

      // Reset wedding store
      const weddingStore = useWeddingStore()
      weddingStore.resetStore()

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      loading.value = true
      error.value = null

      // First verify current password by attempting to sign in
      if (user.value?.email) {
        const { error: verifyError } = await $supabase.auth.signInWithPassword({
          email: user.value.email,
          password: currentPassword
        })
        
        if (verifyError) {
          throw new Error('Current password is incorrect')
        }
      }

      const { error: updateError } = await $supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      if (!user.value) return

      const { data, error: fetchError } = await $supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (fetchError) throw fetchError

      profile.value = data
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      loading.value = true
      error.value = null

      if (!user.value) throw new Error('No authenticated user')

      const { data, error: updateError } = await $supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      profile.value = data
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const initialize = async () => {
    try {
      // Get initial session
      const { data: { session: initialSession } } = await $supabase.auth.getSession()
      
      if (initialSession) {
        session.value = initialSession
        user.value = initialSession.user
        await fetchProfile()
      }

      // Listen for auth changes
      $supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null

        if (event === 'SIGNED_IN' && newSession?.user) {
          await fetchProfile()
          // Initialize wedding data after profile is loaded
          nextTick(() => {
            const weddingStore = useWeddingStore()
            weddingStore.initializeData()
          })
        } else if (event === 'SIGNED_OUT') {
          profile.value = null
          const weddingStore = useWeddingStore()
          weddingStore.resetStore()
        }
      })
    } catch (err: any) {
      console.error('Auth initialization error:', err)
      error.value = err.message
    }
  }

  return {
    // State
    user: readonly(user),
    profile: readonly(profile),
    session: readonly(session),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    isAuthenticated,

    // Actions
    signUp,
    signIn,
    signOut,
    updatePassword,
    fetchProfile,
    updateProfile,
    initialize
  }
})