"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import type { Note } from "@/types/prisma";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Handle auth state
  useEffect(() => {
    // Check initial auth state
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      }
    };

    checkSession();
  }, [supabase.auth]);

  // Fetch notes when user changes
  useEffect(() => {
    async function fetchNotes() {
      if (!user) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setNotes([]);
          return;
        }

        const response = await fetch("/api/notes", {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch notes: ${response.status}`);
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes. Please try refreshing the page.");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [user, supabase.auth]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent
            notes={notes}
            loading={loading}
            isAuthenticated={!!user}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
