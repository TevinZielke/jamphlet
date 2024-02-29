"use server";

import { revalidatePath } from "next/cache";
import { createServerClientAction } from "../storage";

const bucketName = "images";

export type ImageUploadProps = {
  file: File;
  path: string;
};

export async function uploadImage(formData: FormData): Promise<string> {
  const supabase = createServerClientAction();

  const image = formData.get("image") as File;
  const path = formData.get("path") as string;

  const { data, error } = await (await supabase).storage
    .from(bucketName)
    .upload(path, image);

  if (error) {
    return error.message;
  } else {
    return data.path;
  }
}

export async function getImageURL(filePath: string) {
  const supabase = createServerClientAction();

  const publicUrl = (await supabase).storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function createSignedUrlAndUploadAction(formData: FormData) {
  const supabase = createServerClientAction();

  const file = formData.get("image") as File;
  const path = formData.get("path") as string;

  console.log("path", path);

  const { data: signedUrldata, error: signedUrlError } = await (
    await supabase
  ).storage
    .from(bucketName)
    .createSignedUploadUrl(path);
  if (signedUrlError) {
    console.log("signedUrlError: ", signedUrlError);
    return signedUrlError.message;
  } else {
    return await uploadAction(signedUrldata.path, signedUrldata.token, file);
  }
}

export async function uploadAction(path: string, token: string, file: File) {
  const supabase = createServerClientAction();

  const { data, error } = await (await supabase).storage
    .from(bucketName)
    .uploadToSignedUrl(path, token, file);

  if (error) {
    console.log("uploadError: ", error);
    return error.message;
  } else {
    return data;
  }

  // revalidatePath('/')
}

export async function revalidateItemPath(itemId: number) {
  revalidatePath(`/items/${itemId}`);
}
