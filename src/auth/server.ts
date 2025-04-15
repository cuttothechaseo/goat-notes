import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getUser() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
   