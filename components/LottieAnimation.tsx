"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface Props {
  src: string;
  className?: string;
  loop?: boolean;
}

export default function LottieAnimation({
  src,
  className = "",
  loop = true,
}: Props) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [src]);

  if (!data) return null;

  return (
    <div className={className}>
      <Lottie animationData={data} loop={loop} />
    </div>
  );
}
