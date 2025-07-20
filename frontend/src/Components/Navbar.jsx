import React, { useState, useContext, useRef, useEffect } from 'react';
import { SiWikibooks } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { HiOutlineMenu, HiX } from 'react-icons/hi';
import { UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../../Utils/userContext';
import { CartContext } from '../../Utils/cartContext';

const Navbar = () => {
  const { user, setuser } = useContext(UserContext);
  const { cartitems } = useContext(CartContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const dropdownref = useRef();

  useEffect(() => {
    const outsideclick = (event) => {
      if (dropdownref.current && !dropdownref.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', outsideclick);
    return () => document.removeEventListener('mousedown', outsideclick);
  }, []);

  const linkStyle = "relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full";

  return (
    <nav className="w-full bg-white h-[80px] px-6 md:px-12 flex items-center justify-between text-black relative z-50 shadow-md">
      <div className="flex items-center gap-4">
        <SiWikibooks size={40} />
        <h1 className="text-xl md:text-2xl font-semibold">alito Store</h1>
      </div>

      <div className="hidden lg:flex items-center gap-10">
        <Link to="/" className={linkStyle}>Home</Link>
        <Link to="/AboutUs" className={linkStyle}>About Tutor</Link>
        <Link to="/blogs" className={linkStyle}>Blogs</Link>
        <Link to="/ContactUs" className={linkStyle}>Contact Us</Link>
        <Link to="/Courses" className={linkStyle}>Courses</Link>

        {user ? (
          <>
            <div className="relative" ref={dropdownref}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:text-gray-600">
                <UserCircleIcon className="w-7 h-7" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 border border-gray-200">
                  <Link to="/user" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">User Profile</Link>
                  <Link to="/purchases" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Purchased</Link>
                </div>
              )}
            </div>
            <p>{user.name}</p>

            <Link to="/cart" className="relative hover:text-gray-600 ml-4">
              <ShoppingCartIcon className="w-7 h-7" />
              {cartitems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full px-1.5 font-bold">
                  {cartitems.length}
                </span>
              )}
            </Link>

            <button onClick={() => setuser(null)} className="hover:text-red-600 ml-6">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkStyle}>Login</Link>
            <Link to="/signup" className={linkStyle}>Signup</Link>
          </>
        )}
      </div>

      <button className="lg:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <HiX size={30} /> : <HiOutlineMenu size={30} />}
      </button>

      {menuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white flex flex-col items-center py-6 space-y-4 text-lg text-black shadow-md">
          <Link to="/" onClick={() => setMenuOpen(false)} className={linkStyle}>Home</Link>
          <Link to="/AboutUs" onClick={() => setMenuOpen(false)} className={linkStyle}>About Tutor</Link>
          <Link to="/blogs" onClick={() => setMenuOpen(false)} className={linkStyle}>Blogs</Link>
          <Link to="/ContactUs" onClick={() => setMenuOpen(false)} className={linkStyle}>Contact Us</Link>
          <Link to="/Courses" onClick={() => setMenuOpen(false)} className={linkStyle}>Courses</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
