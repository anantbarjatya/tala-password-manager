export default function StartupLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"></div>
        </div>

        <h1 className="text-white text-xl font-semibold">
          Waking up secure server...
        </h1>

        <p className="text-gray-400 mt-2 animate-pulse">
          Please wait while TALA prepares your vault
        </p>

        <div className="mt-5 flex justify-center gap-2">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
        </div>
      </div>
    </div>
  );
}