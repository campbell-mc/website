export default function TodoPage() {
  return (
    <div className="px-4 py-12 max-w-lg mx-auto text-center mb-24">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E8F5EE] flex items-center justify-center">
        <span className="text-2xl">✓</span>
      </div>
      <h2 className="text-xl font-semibold text-[#1B4332] mb-2">To-Do</h2>
      <p className="text-sm text-gray-500">Your pending actions — DON queue items, loop reflections, and practice commitments.</p>
      <p className="text-xs text-gray-400 mt-4">Coming with UX build</p>
    </div>
  );
}
