import { NextRequest, NextResponse } from "next/server";
import SharedLink from "@/models/sharedLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectMongoDB } from "@/lib/mongodb";
import { createSharedLink } from "@/lib/sharedLinkService";
import { pusherServer } from "@/socketi";
export const dynamic = "auto";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

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
  try {
    const sharedLink = await createSharedLink(data, session?.user?.email!);
    const res = await pusherServer.trigger(
      "video-channel",
      "evt::new-video",
      sharedLink,
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      {
        status: 503,
      },
    );
  }
  return NextResponse.json({
    ok: 1,
  });
}
