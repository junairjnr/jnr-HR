import { RiLoaderLine } from "react-icons/ri";

export default function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center absolute z-10">
      <RiLoaderLine className="loading-icon" size={50} />
    </div>
  );
}
