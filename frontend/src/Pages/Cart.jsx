import React, { useContext } from 'react';
import Navbar from '../Components/Navbar';
import { CartContext } from '../../Utils/cartContext';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Utils/userContext';

const Cart = () => {
  const { user } = useContext(UserContext);
  const { cartitems, removecart, clearCart } = useContext(CartContext);
  const totalPrice = cartitems.reduce((sum, item) => sum + Number(item.price), 0);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You must be logged in to view your cart.
          </p>
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-white font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
        {cartitems.length === 0 ? (
          <p>
            Your cart is empty.{' '}
            <Link to="/Courses" className="text-blue-400 underline">
              Browse courses
            </Link>
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {cartitems.map((course) => (
                <li
                  key={course._id}
                  className="flex justify-between items-center bg-gray-800 p-4 rounded-md"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <p className="text-gray-400">{course.description}</p>
                    <p className="text-blue-400 font-semibold">Rs. {course.price}</p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removecart(course._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right text-xl font-bold">
              Total: Rs. {totalPrice}
            </div>
            <button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-white font-semibold"
              onClick={() => alert('Proceeding to payment (implement your payment logic)')}
            >
              Continue to Payment
            </button>
            <button
              className="mt-4 ml-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white font-semibold"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
