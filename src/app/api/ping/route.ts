import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // this is for testing purpose, will not be in production, for the shake of simplicity I put it here to test on free hosting service
  return NextResponse.json({
    mongo: process.env.MONGODB_URI,
  });
}
