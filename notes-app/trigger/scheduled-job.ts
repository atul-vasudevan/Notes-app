import { task } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";

/**
 * Scheduled job to clean up old notes
 * This runs daily and deletes notes older than 90 days
 * 
 * To set up:
 * 1. Create a Trigger.dev account at https://trigger.dev
 * 2. Get your API key and add it to .env.local as TRIGGER_SECRET_KEY
 * 3. Configure the schedule in your Trigger.dev dashboard
 */
export const cleanupOldNotes = task({
  id: "cleanup-old-notes",
  run: async (payload, { ctx }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin operations
    );

    // Delete notes older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data, error } = await supabase
      .from("notes")
      .delete()
      .lt("created_at", ninetyDaysAgo.toISOString())
      .select();

    if (error) {
      console.error("Error cleaning up old notes:", error);
      throw error;
    }

    console.log(`Cleaned up ${data?.length || 0} old notes`);
    return { deletedCount: data?.length || 0 };
  },
});

