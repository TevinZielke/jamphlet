import { useFormContext } from "react-hook-form";
import { ItemFormFieldData } from "./item-form";
import { Input } from "./ui/input";

export const DynamicControl = ({
  type,
  featureIdString,
  defaultValue,
  config = {},
  value,
}: ItemFormFieldData) => {
  console.log("value", value);
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
          defaultValue={value || defaultValue}
          // value={value}
          style={{
            color: value ? "" : "grey",
          }}
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
          defaultValue={value || defaultValue}
          // value={value}
          style={{
            color: value ? "" : "grey",
          }}
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
          defaultValue={value || defaultValue}
          // value={value}
          style={{
            color: value ? "" : "grey",
          }}
        />
      );
    default:
      return <Input type="text" />;
  }
};
