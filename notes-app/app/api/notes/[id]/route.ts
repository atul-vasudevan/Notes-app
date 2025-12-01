import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content } = await request.json()

    // Verify note belongs to user and is not deleted
    const { data: existingNote, error: fetchError } = await supabase
      .from('notes')
      .select('user_id, deleted')
      .eq('id', id)
      .single()

    if (fetchError || !existingNote || existingNote.user_id !== user.id) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    if (existingNote.deleted) {
      return NextResponse.json({ error: 'Cannot edit deleted note' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notes')
      .update({
        title: title || 'Untitled Note',
        content: content || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('deleted', false)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify note belongs to user
    const { data: existingNote, error: fetchError } = await supabase
      .from('notes')
      .select('user_id, deleted')
      .eq('id', id)
      .single()

    if (fetchError || !existingNote || existingNote.user_id !== user.id) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    if (existingNote.deleted) {
      return NextResponse.json({ error: 'Note already deleted' }, { status: 400 })
    }

    // Soft delete: set deleted = true instead of actually deleting
    const { error } = await supabase
      .from('notes')
      .update({
        deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

