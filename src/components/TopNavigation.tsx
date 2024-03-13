"use client";

import React, { useState } from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";
import { Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function TopNavigation() {
  const router = useRouter();
  const session = useSession();

  return (
    <nav className="fixed top-0 left-0 w-screen z-20 dark:bg-black bg-white border-b-2">
      <div className="flex justify-between items-center px-2 md:px-7 h-16">
        <Link href="/" className="flex items-center space-x-2">
          <Youtube size={48} className="text-red-700" />
          <span className="hidden md:block text-2xl font-bold">
            Shared Youtube URL
          </span>
        </Link>
        {session.status !== "authenticated" ? (
          <LoginForm />
        ) : (
            <div className={"flex items-center"}>
              <p className={"mr-3"}>Hello {session.data?.user?.email}</p>
              <button onClick={() => signOut()}
                      className="bg-red-500 text-white font-bold cursor-pointer px-6 py-1 mr-4">
                Sign out
              </button>
              <button onClick={() => router.push('add')}
                      className="bg-red-500 text-white font-bold cursor-pointer px-6 py-1">
                Add
              </button>
            </div>
        )}
      </div>
    </nav>
  );
}
