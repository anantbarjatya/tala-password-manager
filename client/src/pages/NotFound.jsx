import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-4">
      <div>
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-gray-400 mb-6">This page doesn't exist</p>
        <Link
          to="/dashboard"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}