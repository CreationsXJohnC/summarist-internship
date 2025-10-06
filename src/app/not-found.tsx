import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 text-[#032b41] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-gray-600 mb-6">The page you are looking for doesn’t exist or has been moved.</p>
        <Link href="/for-you" className="bg-[#2bd97c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#25c470] transition-colors">
          Go to For You
        </Link>
      </div>
    </div>
  );
}