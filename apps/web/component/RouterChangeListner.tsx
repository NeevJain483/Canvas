"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "../lib/store/authStore";

const RouterChangeListner = () => {
  const params = useParams();
  const search = useSearchParams();
  const clearMessage = useAuthStore((state) => state.clearMessage);
  React.useEffect(() => {
    clearMessage();
  }, [params, search, clearMessage]);
  return null;
};

export default RouterChangeListner;
