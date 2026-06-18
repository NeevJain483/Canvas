"use client";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.push(`${id}/review`);
  }, [router,id]);

  return null;
};

export default Page;
