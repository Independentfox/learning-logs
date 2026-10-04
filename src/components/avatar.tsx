import Image from "next/image";
import { cn, rem } from "@/lib/utils";

export function Avatar({
  name,
  image,
  size = 36,
  className,
}: {
  name?: string | null;
  image?: string | null;
  size?: number;
  className?: string;
}) {
  const initial = name?.trim()[0]?.toUpperCase() ?? "?";
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-tint font-medium text-link ring-1 ring-line",
        className,
      )}
      style={{ width: rem(size), height: rem(size), fontSize: rem(size * 0.42) }}
    >
      {image ? (
        <Image src={image} alt="" width={size} height={size} className="size-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
