import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

const CARD_OPTIONS = {
  style: {
    base: {
      iconColor: '#6EE7B7',
      color: '#000',
      fontWeight: '500',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
    invalid: {
      iconColor: '#EF4444',
      color: '#EF4444',
    },
  },
};

const CardField = ({ onChange }) => (
  <div className="rounded-xl border bg-white p-4 shadow-md">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

const Field = ({ label, id, type, placeholder, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-md p-2 bg-white border border-gray-300 text-black"
    />
  </div>
);

const SubmitButton = ({ processing, children }) => (
  <button
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-300"
    type="submit"
    disabled={processing}
  >
    {processing ? 'Processing...' : children}
  </button>
);

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: billingDetails,
      },
    });

    setProcessing(false);

    if (confirmError) {
      toast.error(confirmError.message);
    } else if (paymentIntent?.status === 'succeeded') {
      toast.success('Payment successful!');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Field label="Name" id="name" type="text" placeholder="Jane Doe" value={billingDetails.name} onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })} />
      <Field label="Email" id="email" type="email" placeholder="jane@example.com" value={billingDetails.email} onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })} />
      <Field label="Phone" id="phone" type="tel" placeholder="1234567890" value={billingDetails.phone} onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })} />
      <CardField onChange={(e) => { setError(e.error); setCardComplete(e.complete); }} />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      <SubmitButton processing={processing}>Pay Now</SubmitButton>
    </motion.form>
  );
};

const StripeCheckout = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:4001/cs/course/buy/${id}`, {
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCourse(data.course);
        setClientSecret(data?.clientSecret);
        console.log("The clientSecret is:",data.clientSecret)
      } catch (err) {
        setError('Failed to load course info.');
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-xl animate-fade-in-up border border-gray-200">
        {error && <p className="text-red-500">{error}</p>}
        {course && (
          <motion.div
            className="p-6 rounded-xl border border-gray-200 bg-white shadow-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{course.title}</h2>
            <p className="mb-4 text-gray-600 text-sm">{course.description}</p>
            <p className="text-xl font-semibold text-gray-900">Price: ${course.price}</p>
          </motion.div>
        )}
        <motion.div
          className="p-6 rounded-xl border border-gray-200 bg-white shadow-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Elements stripe={stripePromise}>
            {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
          </Elements>
        </motion.div>
      </div>
    </div>
  );
};

export default StripeCheckout;
