import { useEffect } from "react";

const useKeepAlive = () => {
  useEffect(() => {
    const ping = () => {
      // Ping AI service
      fetch("https://quiz-app-ai-service.onrender.com/ping")
        .then((res) => console.log("AI Service Ping:", res.status))
        .catch((err) => console.error("AI Service Ping Error:", err));

      // Ping backend
      fetch("https://quiz-app-backend-y3rr.onrender.com/ping")
        .then((res) => console.log("Backend Ping:", res.status))
        .catch((err) => console.error("Backend Ping Error:", err));
    };

    // Ping immediately on mount
    ping();

    // Set interval to ping every 4 minutes
    const interval = setInterval(ping, 1000 * 60 * 4);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
};

export default useKeepAlive;
