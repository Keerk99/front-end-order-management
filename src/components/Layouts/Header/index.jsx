import { Link } from "react-router-dom";

export default function HeaderSection() {
  return (
    <header className="bg-slate-700">
      <nav className="max-w-screen-3xl flex justify-between items-center my-0 mx-auto py-12 px-40 max-sm:px-2 max-xsm:px-1 max-xsm:py-8">
        <div className="w-full flex justify-around text-white text-2xl font-sans max-xsm:text-lg">
          <Link to={"/"}>Home</Link>
          <Link to={"/my-orders"}>My Orders</Link>
        </div>
      </nav>
    </header>
  );
}
