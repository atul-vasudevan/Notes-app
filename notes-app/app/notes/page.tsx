import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NoteCard from '@/components/NoteCard'
import Link from 'next/link'

export default async function NotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch notes for the current user (excluding deleted ones)
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">My Notes</h1>
          <div className="flex gap-4">
            <Link
              href="/notes/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              + New Note
            </Link>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-black dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {notes && notes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">No notes yet. Create your first note!</p>
            <Link
              href="/notes/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Note
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

