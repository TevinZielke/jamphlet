"use server";

import { createServerClientAction } from "../storage";

const supabase = createServerClientAction();
const bucketName = "images";

export type ImageUploadProps = {
  file: File;
  path: string;
};

export async function uploadImage(formData: FormData): Promise<string> {
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
  const publicUrl = (await supabase).storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function createSignedUrlAndUploadAction(formData: FormData) {
  const file = formData.get("image") as File;
  const path = formData.get("path") as string;

  const { data: signedUrldata, error: signedUrlError } = await (
    await supabase
  ).storage
    .from(bucketName)
    .createSignedUploadUrl(path);
  if (signedUrlError) {
    return signedUrlError.message;
  } else {
    return await uploadAction(signedUrldata.path, signedUrldata.token, file);
  }
}

export async function uploadAction(path: string, token: string, file: File) {
  const { data, error } = await (await supabase).storage
    .from(bucketName)
    .uploadToSignedUrl(path, token, file);

  if (error) {
    return error.message;
  } else {
    return data;
  }
}
