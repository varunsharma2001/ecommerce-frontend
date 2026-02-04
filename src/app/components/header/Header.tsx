import Navbar from './Navbar';
import CategoryBar from './CategoryBar';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <Navbar />
      <CategoryBar />
    </header>
  );
};
export default Header;
