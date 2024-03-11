import VideoInfiniteList from "@/components/VideoInfiniteList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Home() {
  return (
    <main className={"container shadow-lg mx-auto bg-white min-h-screen"}>
      <ToastContainer/>
      <VideoInfiniteList/>
    </main>
  );
}
