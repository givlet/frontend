import { writeFileSync } from "fs";
import { projects } from "$lib/projects";

export async function POST({ request }) {
  try {
    const updatedProject = await request.json();

    const index = projects.findIndex((p) => p.name === updatedProject.name);
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    projects[index] = updatedProject;

    writeFileSync(
      "src/lib/projects.js",
      `export const projects = ${JSON.stringify(projects, null, 2)};`,
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating projects.js:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update projects.js" }),
      { status: 500 },
    );
  }
}
