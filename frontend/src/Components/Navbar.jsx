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


  useEffect(()=>{
    const outsideclick = (event)=>{
      if(dropdownref.current && !dropdownref.current.contains(event.target)){
        setDropdownOpen(false);
      }

    }
      document.addEventListener('mousedown',outsideclick);
      return ()=> document.removeEventListener('mousedown',outsideclick)
  },[]);

  return (
    <nav className="w-full bg-gray-900 h-[80px] px-6 md:px-12 flex items-center justify-between text-white relative z-50">
      <div className="flex items-center gap-4">
        <SiWikibooks size={40} />
        <h1 className="text-xl md:text-2xl font-semibold">alito Store</h1>
      </div>

      <div className="hidden lg:flex items-center gap-10">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/AboutUs" className="hover:text-blue-400">About Tutor</Link>
        <Link to="/blogs" className="hover:text-blue-400">Blogs</Link>
        <Link to="/ContactUs" className="hover:text-blue-400">Contact Us</Link>
        <Link to="/Courses" className="hover:text-blue-400">Courses</Link>

        {user ? (
          <>
            <div className="relative" ref={dropdownref}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:text-blue-400">
                <UserCircleIcon className="w-7 h-7" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-50">
                  <Link to="/user" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-700">User Profile</Link>
                  <Link to="/purchases" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-700">Purchased</Link>
                </div>
              )}
            </div>
            <p>{user.name}</p>

            <Link to="/cart" className="relative hover:text-blue-400 ml-4">
              <ShoppingCartIcon className="w-7 h-7" />
              {cartitems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1.5 font-bold">
                  {cartitems.length}
                </span>
              )}
            </Link>

            <button onClick={() => setuser(null)} className="hover:text-red-400 ml-6">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/signup" className="hover:text-blue-400">Signup</Link>
          </>
        )}
      </div>

      <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <HiX size={30} /> : <HiOutlineMenu size={30} />}
      </button>

      {menuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-gray-800 flex flex-col items-center py-6 space-y-4 text-lg">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/AboutUs" onClick={() => setMenuOpen(false)}>About Tutor</Link>
          <Link to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</Link>
          <Link to="/ContactUs" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          <Link to="/Courses" onClick={() => setMenuOpen(false)}>Courses</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
