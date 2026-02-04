const SearchBar = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
      />

      {/* Icon */}
      <span className="absolute top-2.5 right-4 text-sm text-gray-400">🔍</span>
    </div>
  );
};
export default SearchBar;
