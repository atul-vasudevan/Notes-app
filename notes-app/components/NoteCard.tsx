import Link from 'next/link'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

export default function NoteCard({ note }: { note: Note }) {
  const preview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')
  const date = new Date(note.created_at).toLocaleDateString()

  return (
    <Link
      href={`/notes/${note.id}`}
      className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
    >
      <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
        {note.title || 'Untitled Note'}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
        {preview}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        {date}
      </p>
    </Link>
  )
}

