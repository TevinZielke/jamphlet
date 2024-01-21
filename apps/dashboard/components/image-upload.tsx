import Image from "next/image";

type ImageUploadProps = {
  name: string;
  size: number;
  url: string;
};

// ->forwardRef
export function ImageUpload({ name, size, url }: ImageUploadProps) {
  return (
    <div className=" flex border">
      <Image src={url} width={100} height={100} alt={""} />
      <div>
        <p>Name {name}</p>
        <p>Size {size}</p>
      </div>
    </div>
  );
}
