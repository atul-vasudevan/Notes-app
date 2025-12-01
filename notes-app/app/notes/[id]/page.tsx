import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NoteForm from '@/components/NoteForm'

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let note = null
  if (id !== 'new') {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('deleted', false)
      .single()

    if (error || !data) {
      redirect('/notes')
    }
    note = data
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <NoteForm note={note} />
      </div>
    </div>
  )
}

