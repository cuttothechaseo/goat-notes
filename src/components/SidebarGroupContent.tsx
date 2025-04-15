"use client";

import { Note } from "@prisma/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Props = {
  notes: Note[];
  loading: boolean;
  isAuthenticated: boolean;
};

function SidebarGroupContent({ notes, loading, isAuthenticated }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-muted-foreground px-4 py-2 text-sm">
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>{" "}
        to see your notes
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-muted-foreground px-4 py-2 text-sm">
        No notes yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notes.map((note) => (
        <Link
          key={note.id}
          href={`/notes/${note.id}`}
          className="hover:bg-accent hover:text-accent-foreground block px-4 py-2 text-sm"
        >
          {note.text}
        </Link>
      ))}
    </div>
  );
}

export default SidebarGroupContent;
