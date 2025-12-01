import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_pirfxpeqwzerfnzulhjz",
  // Your tasks are in the trigger/ directory
  dirs: ["./trigger"],
  // Maximum duration for tasks (required, minimum 5 seconds)
  maxDuration: 300, // 5 minutes
});

