export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">
          Accessibility Audit Tool
        </h1>

        <input
          type="text"
          placeholder="Enter website URL..."
          className="w-full p-2 border rounded mb-4"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Scan Website
        </button>
      </div>
    </main>
  );
}