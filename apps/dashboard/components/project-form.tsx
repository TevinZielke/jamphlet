import { CategoriesWithFeatures } from "@jamphlet/database";
import { cn } from "lib/utils";
import { Category } from "./category-view";

type ProjectFormProps = {
  categories: CategoriesWithFeatures;
};

export function ProjectForm({ categories }: ProjectFormProps) {
  return (
    <div className={cn(" w-fit")}>
      {categories!.map((category) => {
        return (
          <div className=" p-3" key={category.id}>
            <Category category={category} />
          </div>
        );
      })}
    </div>
  );
}
