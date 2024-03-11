"use client";

import useSWRInfinite from "swr/infinite";
import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSession } from "next-auth/react";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import Video from "@/components/Video";

const fetcher = (url: string) => fetch(url).then(async (r) => {
  const data = await r.json();
  if (!!data) return data.sharedLink;
  return [];
});

const getVideo = (pageIndex: number, previousPageData: Array<any>) => {
  if (pageIndex && !previousPageData.length) return null;
  return `api/sharedLink?_page=${pageIndex}&_limit=6`;
};

type SharedLinkObj = {
  link: string;
  sharedBy: string;
  name: string;
}

export default function VideoInfiniteList() {
  const router = useRouter();
  const session = useSession();

  const [sharedLink, setSharedLink] = useState<Array<SharedLinkObj>>([]);

  const { data: sharedLinkData, size, setSize } = useSWRInfinite(getVideo, fetcher);

  useEffect(() => {
    const newSharedLink: Array<SharedLinkObj> = [];
    sharedLinkData?.forEach((data: Array<SharedLinkObj>) => {
      newSharedLink.push(...data);
    })
    setSharedLink(newSharedLink);
  }, [sharedLinkData])

  const refresh = () => {};

  return (
    <div className={"min-h-screen bg-white flex justify-center"}>
      <div className={"max-w-md pt-8 pb-8"}>
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
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: "center" }}>
              &#8595; Pull down to refresh
            </h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          }
        >
          {!sharedLink || sharedLink?.length === 0 ? (
            <div className={"flex flex-col justify-center items-center"}>
              <p>
                There is no shared link now
                {session.status === "authenticated"
                  ? ", start by adding 1"
                  : ", Login to add 1"}
              </p>
              {session.status === "authenticated" && (
                <button onClick={() => router.push('/add')} className="bg-red-500 text-white font-bold cursor-pointer px-6 py-1 mt-2">
                  Add
                </button>
              )}
            </div>
          ) : (
            sharedLink?.map((item, index) => {
              return <Video key={index} path={item.link} name={item.name} sharedBy={item.sharedBy}/>;
            })
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
}
