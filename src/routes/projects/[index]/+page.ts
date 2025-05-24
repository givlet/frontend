   import { projects } from '$lib/projects';

   export async function load({ params }) {
       const index = parseInt(params.index, 10);

       // Debugging: Log the index and projects array
       console.log('Index:', index);
       console.log('Projects:', projects);

       // Validate the index and fetch the project
       if (isNaN(index) || index < 0 || index >= projects.length) {
           throw new Error('Project not found');
       }

       return {
           project: projects[index]
       };
   }
