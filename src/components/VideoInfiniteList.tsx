"use client";

import useSWRInfinite from "swr/infinite";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Video from "@/components/Video";
import { pusherClient } from "../socketi";
import { toast } from "react-toastify";
import { ArrowUp } from "lucide-react";
//@ts-ignore
import _ from "lodash";

const fetcher = (url: string) => {
  return fetch(url).then(async (r) => {
    const data = await r.json();
    if (!!data) return data.sharedLink;
    return [];
  });
};

const getVideo = (pageIndex: number, previousPageData: Array<any>) => {
  if (pageIndex && !previousPageData.length) return null;
  return `api/sharedLink?_page=${pageIndex}&_limit=6`;
};

type SharedLinkObj = {
  link: string;
  sharedBy: string;
  name: string;
  _id: string;
};

export default function VideoInfiniteList() {
  const router = useRouter();
  const session = useSession();

  const [sharedLink, setSharedLink] = useState<Array<SharedLinkObj>>([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const cachedNewVideoRef = useRef<Array<SharedLinkObj>>([]);

  const {
    data: sharedLinkData,
    size,
    setSize,
  } = useSWRInfinite(getVideo, fetcher);

  useEffect(() => {
    const channel = pusherClient
      .subscribe("video-channel")
      .bind("evt::new-video", (data: SharedLinkObj) => {
        toast.success(`New video added ${data.name} by ${data.sharedBy}`);
        setShowScrollToTop(true);
        cachedNewVideoRef.current.push(data);
      });

    return () => {
      channel.unbind();
    };
  }, []);

  useEffect(() => {
    const newSharedLink: Array<SharedLinkObj> = [];
    sharedLinkData?.forEach((data: Array<SharedLinkObj>) => {
      if (data)
        newSharedLink.push(...data);
    });
    setSharedLink(newSharedLink);
  }, [sharedLinkData]);

  const refresh = () => {
    setSharedLink(_.uniqBy([...cachedNewVideoRef.current, ...sharedLink], '_id'));
    setShowScrollToTop(false);
    window.scrollTo(0, 0)
  };

  return (
    <div className={"min-h-screen bg-white flex justify-center"}>
      {showScrollToTop && (
        <div
          onClick={refresh}
          className={"fixed top-20 bg-gray-500 mt-4 z-10 rounded p-2 flex"}
        >
          <ArrowUp />
          <p className={"text-white"}>Go to top and reload</p>
        </div>
      )}
      <div className={"max-w-md pt-10 pb-8"}>
        <InfiniteScroll
          dataLength={sharedLink?.length ? sharedLink.length : 0} //This is important field to render the next data
          next={() => setSize(size + 1)}
          hasMore={true}
          loader={<></>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
          refreshFunction={refresh}
          pullDownToRefresh={false}
        >
          {!sharedLink || sharedLink?.length === 0 ? (
            <div className={"flex flex-col justify-center items-center video mt-10"}>
              <p>
                There is no shared link now
                {session.status === "authenticated"
                  ? ", start by adding 1"
                  : ", Login to add 1"}
              </p>
              {session.status === "authenticated" && (
                <button
                  onClick={() => router.push("/add")}
                  className="bg-red-500 text-white font-bold cursor-pointer px-6 py-1 mt-2"
                >
                  Add
                </button>
              )}
            </div>
          ) : (
            sharedLink?.map((item, index) => {
              return (
                <Video
                  key={item._id}
                  path={item.link}
                  name={item.name}
                  sharedBy={item.sharedBy}
                />
              );
            })
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
}
