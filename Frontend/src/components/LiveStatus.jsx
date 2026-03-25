import { Wifi, WifiOff } from "lucide-react";
import { useSocket } from "../context/SocketContext";

const LiveStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
      isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}>
      {isConnected ? (
        <>
          <Wifi size={14} className="animate-pulse" />
          Live
        </>
      ) : (
        <>
          <WifiOff size={14} />
          Offline
        </>
      )}
    </div>
  );
};

export default LiveStatus;
