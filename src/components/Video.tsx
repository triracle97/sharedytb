import YouTube from "react-youtube";
import {useEffect, useState} from "react";

export default function ({
  path,
  name,
  sharedBy
}: Readonly<{
  path: string;
  name: string;
  sharedBy: string
}>) {
  const id = path.split("?v=")[1]?.split('&')[0];

  const embedlink = "https://www.youtube.com/embed/" + id; //www.youtube.com/embed/sGbxmsDFVnE

  return (
    <div className={"mt-5"}>
      <iframe
        width="560"
        height="315"
        src={embedlink}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <p className={"font-bold text-2xl"}>{name}</p>
      <p className={"text-xs"}>Shared by {sharedBy}</p>
    </div>
  );
}
