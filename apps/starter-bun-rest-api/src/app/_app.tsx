import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

function App() {
    useEffect(() => {
        // Small delay to show the nice UI before redirecting
        const timer = setTimeout(() => {
            window.location.href = "http://localhost:3000/api/v1/docs";
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>

            <div className="z-10 flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Redirecting to API Routers
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Please wait while we take you to the API Routers...
                    </p>
                </div>

                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]"></div>
                </div>
            </div>

            <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}

const root = document.getElementById("root");
if (root) {
    createRoot(root).render(<App />);
}