export default function NotFound() {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold">User not found</h2>
      <p className="text-gray-600 mt-1">The requested user does not exist.</p>
    </div>
  );
}
