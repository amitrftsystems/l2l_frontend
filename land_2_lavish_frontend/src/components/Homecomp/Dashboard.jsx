import Navbar from "../Navbar/Navbar";
import IdSection from "./IdSection";
import PropertyGrid from "./PropertyGrid";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
      <h1 className="text-lg text-[#272727] font-semibold text-center mt-5">
        Hello User
      </h1>
      <h2 className="text-lg text-[#272727] font-semibold text-center">
        Welcome to HL Group
      </h2>
      <div className="flex items-center bg-gray-100 space-x-4 z-10 ml-[90px]">
        <IdSection />
      </div>
      <PropertyGrid />
    </div>
  );
};

export default Dashboard;
