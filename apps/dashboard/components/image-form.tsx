"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ItemImage,
  NewItemImage,
  createSignedUrlAndUploadAction,
  revalidateItemPath,
} from "@jamphlet/database";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ChangeEvent, useEffect, useReducer, useState, DragEvent } from "react";
import { ImageUpload } from "./image-upload";
import { ItemImageForm } from "./item-image-form";
import ItemImageView from "./item-image-view";
import { cn } from "lib/utils";
import { Separator } from "./ui/separator";

// type ImageFormProps = {
//   clientId: number;
// };

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ImageFormSchema = z.object({
  //   name: z
  //     .string()
  //     .min(2, {
  //       message: "Filename must be at least 2 characters.",
  //     })
  //     .max(20, { message: "Filename must be 20 characters or fewer." }),
  //   image: z
  //     .any()
  //     .refine((files) => files?.length == 1, "Image is required.")
  //     .refine(
  //       (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //       `Max file size is 5MB.`
  //     )
  //     .refine(
  //       (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //       ".jpg, .jpeg, .png and .webp files are accepted."
  //     ),
  images: z.any() as ZodType<State[]>,
  //   image: z.any() as ZodType<File>,
});

// const ImageFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, {
//       message: "Filename must be at least 2 characters.",
//     })
//     .max(20, { message: "Filename must be 20 characters or fewer." }),
//   file: z.instanceof(File),
// });

interface FileWithUrl {
  file: File;
  name: string;
  getUrl: string;
  size: number;
  error?: boolean | undefined;
}

// Reducer action(s)
const addFilesToInput = () => ({
  type: "ADD_FILES_TO_INPUT" as const,
  payload: [] as FileWithUrl[],
});

type Action = ReturnType<typeof addFilesToInput>;
type State = FileWithUrl[];

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

type ImageFormProps = {
  projectId: number;
  itemId: number;
};

export function ImageForm({ projectId, itemId }: ImageFormProps) {
  const fileAmountLimit = 5;

  const [imageFile, setFile] = useState<File>();

  useEffect(() => {
    console.log("fileState", imageFile);
  }, [imageFile]);

  const [dragActive, setDragActive] = useState<boolean>(false);

  const [input, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "ADD_FILES_TO_INPUT": {
        // do not allow more than X files to be uploaded at once
        if (state.length + action.payload.length > fileAmountLimit) {
          toast("Too many files.", {
            description: `You can only upload a maximum of ${fileAmountLimit} files at a time.`,
          });
          return state;
        }

        return [...state, ...action.payload];
      }

      // You could extend this, for example to allow removing files
    }
  }, []);

  //   const form = useForm<z.infer<ImageUploadProps>>({
  //     resolver: zodResolver(insertPamphletSchema),
  //     defaultValues: {
  //       clientId: clientId,
  //       userId: 4,
  //       personalMessage: "",
  //     },
  //     mode: "onBlur",
  //     reValidateMode: "onChange",
  //   });

  //   const form = useForm<z.infer<typeof ImageFormSchema>>({
  //     resolver: zodResolver(ImageFormSchema),
  //     defaultValues: {
  //       name: "",
  //       image: imageFile,
  //     },
  //   });
  const form = useForm<z.infer<typeof ImageFormSchema>>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      //   name: "",
      //   image: imageFile,
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof ImageFormSchema>) => {
    // console.log("Input", values);

    const uploads = input.some(async (image) => {
      const imagePath = `${projectId}/${itemId}/${image?.name}`;
      const form = new FormData();
      form.append("image", image.file);
      form.append("path", imagePath);

      const insertedImage = await createSignedUrlAndUploadAction(form);

      if (!insertedImage.error || !insertedImage.data.error) {
        toast("Image succesfully uploaded", {
          // description: `${insertedImage}`,
        });
        return true;
      } else {
        toast("Error uploading image.", {
          description: `${insertedImage.error}`,
        });
        return false;
      }
    });

    // If one upload succeeds, revalidate path
    uploads && revalidateItemPath(itemId);
  };

  // handle drag events
  function handleDrag(e: DragEvent<HTMLFormElement | HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  // triggers when file is dropped
  async function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    // validate file type
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files;

      if (files.length !== validFiles.length) {
        toast("Invalid file type", {
          description: "Only image files are allowed.",
        });
      }

      try {
        const filesWithUrl = await Promise.all(
          validFiles.map(async (file) => {
            const { name, size } = file;
            const getUrl = URL.createObjectURL(file);

            return { file, name, size, getUrl };
          })
        );

        setDragActive(false);

        // at least one file has been selected
        addFilesToState(filesWithUrl);

        e.dataTransfer.clearData();
      } catch (error) {
        // already handled
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const getUrl = URL.createObjectURL(file);

        const { name, size } = file;

        addFilesToState([{ file, name, getUrl, size }]);
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  function addFilesToState(files: FileWithUrl[]) {
    dispatch({ type: "ADD_FILES_TO_INPUT", payload: files });
  }

  return (
    <div className="w-full">
      {input.length !== 0 && (
        <div className="w-full py-2 flex flex-col gap-2">
          <Separator />
          <p className="text-sm font-medium text-center">
            {input.length} new files selected.
          </p>
        </div>
      )}
      <div className={cn("grid grid-cols-3 gap-2")}>
        {input.map((image, index) => {
          const itemImage: NewItemImage = {
            itemId: itemId,
            caption: "",
            alt: "",
            path: "",
            publicUrl: image.getUrl,
          };
          return (
            <div key={index}>
              <ItemImageView itemImage={itemImage} />
            </div>
          );
        })}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[320px]"
        >
          <div
            className="inset-0 cursor-pointer flex flex-col gap-2"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Image File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png , image/jpg , image/jpeg , image/webp"
                      multiple
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Upload</Button>
        </form>
      </Form>
    </div>
  );
}
