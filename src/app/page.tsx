import VideoInfiniteList from "@/components/VideoInfiniteList";

export default async function Home() {
  return (
    <main className={"container shadow-lg mx-auto bg-white min-h-screen"}>
      <VideoInfiniteList/>
    </main>
  );
}
