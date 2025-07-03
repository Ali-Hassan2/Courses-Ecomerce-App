import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../src/Pages/Home'
import Courses from '../src/Pages/Courses'
import AboutUs from '../src/Pages/AboutUs'
import Blogs from '../src/Pages/Blogs'
import ContactUs from '../src/Pages/ContactUs'
import Login from '../src/Pages/Login'
import Signup from '../src/Pages/Signup'
import Notfound from './Pages/Notfound'
import Buycourse from './Pages/Buycourse'
import Cart from './Pages/Cart'
import Adminlogin from './Pages/Adminlogin'
import AdminSignup from './Pages/AdminSignup'
import Admindash from './Pages/Admindash'
import Admindashboardroute from './ProtectedRoutes/Admindashboardroute'
import Admincoursemgmt from './Pages/Admincoursemgmt'
import AdminPurcahescourse from './Pages/AdminPurcahescourse'
import Adminaddcourse from './Pages/Adminaddcourse'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/Courses',
      element: <Courses />
    },
    {
      path: '/Aboutus',
      element: <AboutUs />
    },
    {
      path: '/blogs',
      element: <Blogs />
    },
    {
      path: '/ContactUs',
      element: <ContactUs />
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'*',
      element:<Notfound/>
    },
    {
      path:'/buycourse/:id',
      element:<Buycourse/>
    },
    {
      path:'/cart',
      element:<Cart/>
    },
    {
      path:'/adminlogin',
      element:<Adminlogin/>
    },
    {
      path:'/adminsignup',
      element:<AdminSignup/>
    },
    {
      path:'/admindashboard',
      element:(
        <Admindashboardroute>
          <Admindash/>
        </Admindashboardroute>
      ),
      // children:[
      //   {
      //     path:'addingcourse',
      //     element:<Adminaddcourse/>
      //   },
      //   {
      //     path:'coursemgmt',
      //     element: <Admincoursemgmt/>
      //   },
      //   {
      //     path:'purchasemgmt',
      //     element:<AdminPurcahescourse/>
      //   }
      // ]
    },
    {
      path:'/admindashboard/addingcourse',
      element:<Adminaddcourse/>
    },
    {
      path:'/admindashboard/coursemgmt',
      element:<Admincoursemgmt/>
    },
    {
      path:'/admindashboard/purchasemgmt',
      element:<AdminPurcahescourse/>
    }
  ]);

  return (
    <>
    <RouterProvider router={router} />
    <div class="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    </>
  );
}

export default App;
  