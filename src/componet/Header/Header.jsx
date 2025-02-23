import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../Index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItem = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus }
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    setMenuOpen(false);
  };

  return (
    <header className="sm:py-3 py-6 shadow bg-[#bc6c25] relative z-50">
      <Container>
        <nav className="flex items-center justify-between">
          <button className="block sm:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="sm:hidden text-black px-4 font-bold text-lg hover:bg-blue-100 rounded-full duration-200">Home</Link>
          <div className="hidden sm:block">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <ul className="hidden sm:flex ml-auto space-x-4">
            {navItem.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full" onClick={() => navigate(item.slug)}>
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='rounded-4xl'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
        {menuOpen && (
          <ul className="sm:hidden bg-white absolute top-16 left-0 w-full shadow-md p-4 space-y-2 z-50">
            {navItem.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button className="block px-6 py-2 bg-gray-200 hover:bg-blue-300 rounded-md w-full text-left" onClick={() => handleNavigation(item.slug)}>
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='bg-red-500 rounded-3xl'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        )}
      </Container>
    </header>
  );
}

export default Header;