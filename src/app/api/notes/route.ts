import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/db/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No user found' },
        { status: 401 }
      )
    }

    const notes = await prisma.note.findMany({
      where: {
        authorId: user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error in notes API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 