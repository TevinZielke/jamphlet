"use client";
import { setCurrentProjectAction } from "@jamphlet/database";
import { SelectItem } from "./ui/select";

type ProjectSelectorItemProps = {
  projectId: number;
  projectName: string;
  userId: number;
};

async function handleSelectProject(userId: number, projectId: number) {
  const result = await setCurrentProjectAction(userId, projectId);
}

export default function ProjectSelectorItem({
  projectId,
  projectName,
  userId,
}: ProjectSelectorItemProps) {
  return (
    <SelectItem
      key={projectId}
      value={projectName}
      onClick={() => handleSelectProject(userId, projectId)}
    >
      <span>{projectName}</span>
    </SelectItem>
  );
}
