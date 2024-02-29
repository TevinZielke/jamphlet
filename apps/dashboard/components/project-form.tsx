import { CategoriesWithFeatures } from "@jamphlet/database";
import { cn } from "lib/utils";
import { Category } from "./category-view";
import { CategoryForm } from "./category-form";
import { Separator } from "./ui/separator";
// import { useMutationState } from "@tanstack/react-query";

type ProjectFormProps = {
  categories: CategoriesWithFeatures;
  projectId: number;
  projectName: string;
};

export function ProjectForm({
  categories,
  projectId,
  projectName,
}: ProjectFormProps) {
  return (
    <div className={cn("w-fit flex flex-col  mb-28")}>
      {categories!.map((category) => {
        return (
          <div className=" p-3" key={category.id}>
            <Category category={category} projectName={projectName} />
          </div>
        );
      })}
      {}

      <div
        className={cn(
          "flex flex-col gap-3 place-self-center justify-center place-items-center pt-4"
        )}
      >
        <span>Add category</span>
        <Separator />
        <div className={cn(" border rounded-lg w-fit p-2")}>
          <CategoryForm projectId={projectId} projectName={projectName} />
        </div>
      </div>
    </div>
  );
}
