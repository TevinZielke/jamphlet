import {
  useForm,
  RegisterOptions,
  FormProvider,
  FieldValues,
} from "react-hook-form";
import { Button } from "./ui/button";
import { DynamicControl } from "./dynamic-control";
import { Label } from "./ui/label";
import { ErrorMessage } from "@hookform/error-message";
import {
  FeaturesOnItems,
  NewFeaturesOnItems,
  NewItemFeature,
  updateItemFeatures,
  upsertFeatureOnItemAction,
} from "@jamphlet/database";
import { toast } from "sonner";
import { cn } from "lib/utils";
import { reject } from "lodash";

type ControlType = "currency" | "quantity" | "text" | "boolean";

type ItemFormProps = {
  item: {
    id: number;
    name: string;
    features: FeaturesOnItems[];
  };
  formCategories: ItemFormCategory[];
};

export type ItemFormCategory = {
  category: FieldCategory;
  fields: ItemFormFieldData[];
};

export type FieldCategory = {
  categoryId: number;
  categoryName: string;
};

export type ItemFormFieldData = {
  featureIdString: string;
  label: string;
  type: ControlType;
  fieldName: string;
  defaultValue: string | number;
  config?: RegisterOptions;
  value?: string | number;
};

export function ItemForm({ item, formCategories }: ItemFormProps) {
  const formMethods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = formMethods;

  const featureList = [
    {
      id: 1,
      categoryId: 1,
    },
    {
      id: 2,
      categoryId: 2,
    },
    {
      id: 3,
      categoryId: 2,
    },
    {
      id: 4,
      categoryId: 4,
    },
    {
      id: 5,
      categoryId: 5,
    },
    {
      id: 6,
      categoryId: 3,
    },
    {
      id: 7,
      categoryId: 2,
    },
  ];

  const onSubmit = async (data: FieldValues) => {
    let newItemFeatures: NewFeaturesOnItems[] = [];
    let upsertPromises: Promise<number>[] = [];

    const upsertPromise = async (
      input: NewFeaturesOnItems
    ): Promise<number> => {
      const result = await upsertFeatureOnItemAction(input);
      const featureId = result.at(0)?.upsertedFeature;
      if (!featureId) return -1;
      return featureId;
    };

    Object.entries(data).forEach(([key, value]) => {
      const featureId = +key;
      const featureCategoryId = featureList.find(
        (feature) => feature.id === featureId
      )?.categoryId!;
      const itemInput: NewFeaturesOnItems = {
        itemId: item.id,
        featureId: featureId,
        value: value,
        categoryId: featureCategoryId,
      };

      // const upsertedFeature = awaitupsertFeatureOnItemAction(itemInput)
      // newItemFeatures.push(itemInput);
      // const upsertPromise = new Promise(async (resolve, reject) => {
      //   return await upsertFeatureOnItemAction(itemInput);
      // });

      upsertPromises.push(upsertPromise(itemInput));
    });

    // TODO
    Promise.allSettled(upsertPromises)
      .then((results: any) => {
        console.log("Promises resolved: ", results);
        toast("Update successful", {
          description: `Features for ${item.name} are now up to date.`,
        });
      })
      .catch((error) => {
        console.error("At least one upsert rejected: ", error);
      });

    // const updatedItem = await updateItemFeatures(newItemFeatures);
    // let isSuccess = false;
    // newItemFeatures.map(async (itemFeature) => {
    //   const upsertedId = await upsertFeatureOnItemAction(itemFeature);
    //   if (upsertedId) isSuccess = true;
    // });

    // isSuccess &&
    //   toast("Update successful", {
    //     description: `Features for ${item.name} are now up to date.`,
    //   });

    // updatedItem &&
    //   toast("Update successful", {
    //     description: `Features for ${item.name} are now up to date.`,
    //   });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <div className={cn("flex flex-col gap-2")}>
          {formCategories.map((formCategory, i) => {
            const category = formCategory.category;
            const categoryFeatures = item.features.filter(
              (feature) => feature.categoryId === category.categoryId
            );
            return (
              <div key={i}>
                <p className="text-m font-medium">{category.categoryName}</p>
                <div
                  className={cn(
                    " flex flex-col gap-2 border rounded-lg p-2 w-[400px]"
                  )}
                >
                  {formCategory.fields.map((field) => {
                    const itemFieldValue = categoryFeatures.find(
                      (feature) =>
                        feature.featureId.toString() === field.featureIdString
                    )?.value;
                    field.value = itemFieldValue;
                    return (
                      <div
                        key={field.featureIdString}
                        className={cn("flex flex-col gap-2")}
                      >
                        <div className={"flex justify-between"}>
                          <Label
                            htmlFor={field.featureIdString}
                            className={cn("my-auto font-medium")}
                          >
                            {field.label}
                          </Label>
                          <div className={cn("w-[250px]")}>
                            <DynamicControl {...field} />
                          </div>
                        </div>
                        <ErrorMessage
                          errors={errors}
                          name={field.featureIdString}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </FormProvider>
      <div className={cn("pt-2")}>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
