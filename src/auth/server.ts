import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            console.error('Error setting cookies:', error)
            throw error // Re-throw the error to handle it properly
          }
        },
      },
    }
  )

  return client
}

export async function getUser() {
  const client = await createClient()
  const userObject = await client.auth.getUser()
  
  if (userObject.error) {
    console.error(userObject.error)
    return null
  }

  return userObject.data.user
}
   