import { CategoryWithFeatures } from "@jamphlet/database";
import { cn } from "lib/utils";
import { FeatureForm } from "./feature-form";
import { Button } from "./ui/button";
import { useState } from "react";

type CategoryProps = {
  category: CategoryWithFeatures;
};

export function Category({ category }: CategoryProps) {
  const [showAddFeature, setShowAddFeature] = useState(false);

  return (
    <div>
      <h3 className=" text-l font-medium pb-1">{category.name}</h3>
      <div className={cn("border rounded-lg p-2")}>
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
            {showAddFeature ? <p>Cancel</p> : <p>Add feature</p>}
          </Button>
        </div>
      </div>
    </div>
  );
}
