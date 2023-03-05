"use client"; // Error components must be Client components

import Button from "@/components/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      width: "26%",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      margin: "auto"
    }}>

      <h2>{`If at first you don't succeed, try`}</h2>
      <Button
        text="Try again"
        onClick={
          () => reset()
        }
      />
      <p>{`This is brought you to by some weird error I meant put in here`}</p>
    </div>
  );
}
