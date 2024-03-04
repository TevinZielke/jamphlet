"use client";

import {
  // ItemSelection,
  ProjectStructureConfig,
  addProjectStructure,
  getProjectAction,
} from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

// type ProjectStructureConfig = {
//   sections: Section[];
// };

// type Section = {
//   name: string;
//   subtitle: string;
//   order: number;
//   components: Array<
//     | ImageComponent
//     | TextComponent
//     | StickyTextComponent
//     | TextImageComponent
//     | ItemsComponent
//     | ComparisonComponent
//   >;
// };

// type ComparisonComponent = {
//   type: "comparisonComponent";
//   data?: ItemSelection;
// };

// type ItemsComponent = {
//   type: "itemsComponent";
//   data?: ItemSelection;
// };

// type StickyTextComponent = {
//   type: "stickyTextComponent";
//   text: string;
//   order: number;
//   images: ImageComponent[];
// };

// type TextImageComponent = {
//   type: "textImageComponent";
//   order: number;
//   title: string;
//   text: string;
//   textRightImageLeft: boolean;
//   image: ImageComponent;
// };

// type ImageComponent = {
//   type: "imageComponent";
//   order: number;
//   publicUrl: string;
//   //   path: string;
//   alt: string;
//   caption: string;
//   //   id?: number | undefined;
// };

// type TextComponent = {
//   type: "textComponent";
//   text: string;
//   order: number;
// };

type ProjectStructureProps = {
  projectId: number;
};

export function ProjectStructure({ projectId }: ProjectStructureProps) {
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectAction(projectId),
  });

  const structure = project?.projectStructure;

  // console.log("Structure", structure?.json);

  // const availableComponents = project?.componentsOnProjects;

  const projectStructureConfig: ProjectStructureConfig = {
    sections: [
      {
        name: "Building",
        subtitle: "St. Beaux",
        order: 0,
        components: [
          {
            type: "textComponent",
            order: 0,
            text: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
          },
          {
            type: "imageComponent",
            order: 1,
            publicUrl:
              "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_003.jpg",
            alt: "Example alt text",
            caption: "Example caption text",
          },
          {
            type: "stickyTextComponent",
            order: 2,
            text: "Sticky Text Component sample text",
            images: [
              {
                type: "imageComponent",
                order: 0,
                publicUrl:
                  "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_003.jpg",
                alt: "Example alt text",
                caption: "Example caption text 0",
              },
              {
                type: "imageComponent",
                order: 1,
                publicUrl:
                  "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_004.jpg?t=2024-02-27T22%3A02%3A12.655Z",
                alt: "Example alt text",
                caption: "Example caption text 1",
              },
              {
                type: "imageComponent",
                order: 2,
                publicUrl:
                  "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_005.jpg?t=2024-02-27T22%3A02%3A50.049Z",
                alt: "Example alt text",
                caption: "Example caption text 2",
              },
            ],
          },
          {
            type: "textImageComponent",
            order: 3,
            title: "",
            text: "Text Image Component sample text",
            textRightImageLeft: true,
            image: {
              type: "imageComponent",
              order: 0,
              publicUrl:
                "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_002.jpg",
              alt: "Example alt text",
              caption: "Example caption text",
            },
          },
        ],
      },
      {
        name: "Items",
        subtitle: "Items Section Description",
        order: 1,
        components: [
          {
            type: "itemsComponent",
            order: 0,
          },
        ],
      },
      {
        name: "Comparison",
        subtitle: "Comparison Section Description",
        order: 2,
        components: [
          {
            type: "comparisonComponent",
            order: 0,
          },
        ],
      },
      {
        name: "Neighborhoood",
        subtitle: "Neighborhood Section Description",
        order: 3,
        components: [
          {
            type: "textImageComponent",
            order: 0,
            title: "Text Image Component Title",
            text: "TextText",
            textRightImageLeft: false,
            image: {
              type: "imageComponent",
              order: 0,
              publicUrl:
                "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_001.jpg",
              alt: "Example alt text",
              caption: "Example caption text",
            },
          },
          {
            type: "textImageComponent",
            order: 0,
            title: "Text Image Component Title",
            text: "TextText",
            textRightImageLeft: false,
            image: {
              type: "imageComponent",
              order: 0,
              publicUrl:
                "https://skoadbwgytopxdzofxgm.supabase.co/storage/v1/object/public/images/1/project_image_001.jpg",
              alt: "Example alt text",
              caption: "Example caption text",
            },
          },
        ],
      },
    ],
  };

  const projectStructureJSON = JSON.stringify(projectStructureConfig, null, 2);

  async function insertProjectStructure() {
    const structure = {
      json: projectStructureJSON,
      projectId: projectId,
    };
    const insertedProjectStrure = await addProjectStructure(structure);
  }

  return (
    <div>
      Project Structure
      <div>
        <p>TODO:</p>
        <ul>
          <li>Create UI for Section & Component</li>
          <li>Re-arrangable sections</li>
          <li>Re-arrangable components with content form</li>
        </ul>
        {projectStructureJSON && (
          <ScrollArea className=" h-96">
            <pre className=" text-sm">{projectStructureJSON}</pre>
          </ScrollArea>
        )}

        <Button onClick={insertProjectStructure} disabled>
          Add Structure
        </Button>
      </div>
    </div>
  );
}
