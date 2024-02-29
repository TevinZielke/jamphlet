import { CategoryWithFeatures, deleteCategoryAction } from "@jamphlet/database";
import { cn } from "lib/utils";
import { FeatureForm } from "./feature-form";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type CategoryProps = {
  category: CategoryWithFeatures;
  projectName: string;
};

export function Category({ category, projectName }: CategoryProps) {
  const [showAddFeature, setShowAddFeature] = useState(false);

  async function handleDelete(categoryId: number) {
    const deletedCategory = await deleteCategoryAction(categoryId);
    const deletedCategoryName = deletedCategory.at(0)?.categoryName;
    deletedCategoryName &&
      toast("New feature type added.", {
        description: `${deletedCategoryName} has been added to ${projectName}.`,
      });
  }

  return (
    <div className=" flex flex-col">
      <div className="flex justify-between">
        <h3 className=" text-l font-medium pt-1">{category.name}</h3>
        <Button variant={"ghost"} onClick={() => handleDelete(category.id)}>
          <Trash2 color="grey" className="h-4 w-4" />
        </Button>
      </div>
      <div className={cn("border rounded-lg p-2 w-[660px]")}>
        {/* Map over each feature within category */}
        {category.features.map((feature, index) => {
          return (
            <div className={cn("pb-2")} key={index}>
              <FeatureForm feature={feature} showlabel={index === 0} />
            </div>
          );
        })}

        <div className={cn("")}>
          {showAddFeature && (
            <div className=" pb-2">
              <FeatureForm
                categoryId={category.id}
                categoryName={category.name!}
              />
            </div>
          )}
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setShowAddFeature(!showAddFeature)}
          >
            {showAddFeature ? (
              <p className="text-sm">Cancel</p>
            ) : (
              <p className=" text-sm">Add feature</p>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
