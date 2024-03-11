"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ShareVideoForm() {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!link) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const res = await fetch("api/sharedLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          link
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-red-400">
        <h1 className="text-xl font-bold my-4">Share a youtube video</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className={"border-2"}
            onChange={(e) => setLink(e.target.value)}
            type="text"
            placeholder="Link"
          />
          <button className="bg-red-500 text-white font-bold cursor-pointer px-6 py-1">
            Add
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
