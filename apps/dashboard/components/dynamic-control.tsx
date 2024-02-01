import { useFormContext } from "react-hook-form";
import { ItemFormFieldData } from "./item-form";
import { Input } from "./ui/input";

export const DynamicControl = ({
  type,
  featureIdString,
  defaultValue,
  config = {},
}: ItemFormFieldData) => {
  const { register } = useFormContext();

  switch (type) {
    case "text":
      //   config = {
      //     required: "This is Required",
      //     maxLength: 300 || "a",
      //     minLength: 1 || "b",
      //   };
      return (
        <Input
          type="text"
          {...register(featureIdString, config)}
          defaultValue={defaultValue}
        />
      );
    case "currency": {
      config = {
        required: "This is Required",
        validate: (value) => value >= 0 || "Must be a positive value.",
      };
      return (
        <Input
          type="number"
          {...register(featureIdString, config)}
          defaultValue={defaultValue}
        />
      );
    }
    case "quantity":
      config = {
        required: "This is Required",
        validate: (value) => value >= 0 || "Must be a positive value",
      };
      return (
        <Input
          type="number"
          {...register(featureIdString, config)}
          defaultValue={defaultValue}
        />
      );
    default:
      return <Input type="text" />;
  }
};
