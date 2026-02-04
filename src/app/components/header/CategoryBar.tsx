const CategoryBar = () => {
  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Shoes',
    'Home',
    'Beauty',
    'Sports',
    'Groceries',
  ];

  return (
    <div className="h-12 bg-white">
      <div className="scrollbar-hide mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className="text-sm font-medium whitespace-nowrap text-gray-600 transition hover:text-black"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
export default CategoryBar;
