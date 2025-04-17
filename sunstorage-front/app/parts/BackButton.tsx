"use client";

import React from "react";
import { useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <div className="d-flex justify-content-end">
      <button onClick={handleClick} className="btn btn-secondary">
        ← Indietro
      </button>
    </div>
  );
};

export default BackButton;
