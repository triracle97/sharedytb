import { NextRequest, NextResponse } from "next/server";
import SharedLink from "@/models/sharedLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import {createSharedLink} from "@/lib/sharedLinkService";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5,
};

export async function GET(req: NextRequest) {
  const _page = parseInt(
    !!req.nextUrl.searchParams.get("_page")
      ? req.nextUrl.searchParams.get("_page")!
      : "0",
  );
  const _limit = parseInt(
    !!req.nextUrl.searchParams.get("_limit")
      ? req.nextUrl.searchParams.get("_limit")!
      : "0",
  );
  await connectMongoDB();
  const sharedLink = await SharedLink.find()
    .sort({ _id: -1 })
    .skip(_page * _limit)
    .limit(_limit);
  return NextResponse.json({
    sharedLink,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();
  await createSharedLink(data, session?.user?.email!);
  return NextResponse.json({
    ok: 1,
  });
}
