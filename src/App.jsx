import { Outlet, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import CommonLayout from './pages/common-layout/common-layout'
import HomePage from './pages/HomePage/HomePage'
import Training from './pages/Training/Training'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import TermsAndCondition from './pages/TermsAndCondtion/TermsAndCondition'
import RefundPolicy from './pages/RefundPolicy/RefundPolicy'
import AddToCart from './pages/AddToCart/AddToCart'
import Wishlist from './pages/Wishlist/Wishlist'
import BookingPage from './pages/BookingPage/BookingPage'
// import Blog from './pages/Blog/Blog'
import Blog1 from './pages/Blog1/Blog1'
import Auth from './pages/pages/Auth'
import EmailVerificationSent from './pages/pages/EmailVerificationSent'
import EmailVerified from './pages/pages/EmailVerified'
import EmailVerificationFailed from './pages/pages/EmailVerificationFailed'
import Accountbar from './pages/pages/MyAccount/Accountbar'
import Course from './pages/pages/MyAccount/Course'
import Purchasehistory from './pages/pages/MyAccount/Purchasehistory'
import Dashboard from './pages/pages/MyAccount/Dashboard'
import ViewSlot from './pages/pages/MyAccount/ViewSlot'
import RequireAuth from './component/RequireAuth'
import Checkout from './pages/Checkout/Checkout'
import SingleCourse from './pages/SingleCourse/SingleCourse'
import ProductDetail from './pages/ProudctDetail/ProductDetail'
import Appointments from './pages/pages/MyAccount/Appointment'
import FixedSlot from './pages/pages/MyAccount/FixedSchedule'
import MyProfile from './pages/pages/MyAccount/MyProfile'
import EditProfile from './pages/pages/MyAccount/EditProfile'
import MyAccountCommonLayout from './pages/pages/MyAccount/my-account-common-layout'
import BlogDetail from './pages/BlogDetail/BlogDetail'
import Success from './pages/success/success'
import Error from './pages/error/error'
import NewPassword from './component/NewPassword'
import ForgotPassword from './component/ForgotPassword'
import ScrollToTop from './component/ScrollToTop'
import { useEffect } from 'react';
import AboutGGPerform from './pages/AboutGGPerform/AboutGGPerform'
import FaqPage from './pages/FaqPage/FaqPage'
import { Toaster } from 'react-hot-toast'
import AllEvents from './pages/Event/AllEvents'
import EventDetails from './pages/Event/EventDetails/EventDetails'
import EventCheckout from './pages/Event/EventCheckout/EventCheckout'
import CheckoutSuccessPage from './pages/Event/EventCheckout/CheckoutSuccessPage'
import CheckoutFailedPage from './pages/Event/EventCheckout/CheckoutFailedPage'



function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home');
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Toaster toastOptions={{
        position: 'top-right'
      }} />
      <ScrollToTop />
      <div>
        <Routes>
          <Route path='/' element={<CommonLayout />}>
            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
            <Route path='/about' element={<AboutGGPerform />} />
            <Route path='/faq' element={<FaqPage />} />
            <Route index element={<HomePage />} />
            <Route path='home' element={<HomePage />} />
            {/* <Route path='training' element={<Training />} /> */}
            <Route path='training' element={<Outlet />}>
              <Route index element={<Training />} />
              <Route path=':id' element={<ProductDetail />} />
            </Route>
            <Route path='Booking' element={<BookingPage />} />
            <Route path='privacy' element={<PrivacyPolicy />} />
            <Route path='terms' element={<TermsAndCondition />} />
            <Route path='refund' element={<RefundPolicy />} />
            <Route path='cart' element={<AddToCart />} />
            <Route path='wish-list' element={<Wishlist />} />
            <Route path='events' element={<AllEvents/>}/>
            <Route path='event-details/:slug/:id' element={<EventDetails/>}/>
            <Route path='events/checkout/:id' element={<EventCheckout/>}/>
            <Route path='events/checkout/success' element={<CheckoutSuccessPage/>}></Route>
            <Route path='events/checkout/failed' element={<CheckoutFailedPage />}></Route>
            {/* <Route path='blog' element={<Blog />} /> */}
            {/* <Route path='blog1' element={<Blog1 />} /> */}
            {/* <Route path='blog-detail' element={<BlogDetail/>}/> */}
            <Route path='blog1' element={<Outlet />}>
              <Route index element={<Blog1 />} />
              <Route path=':category/:title' element={<BlogDetail />} />
              {/* <Route path=':title' element={<BlogDetail />} /> */}
            </Route>
            <Route path='checkout' element={<Outlet />}>
              <Route index element={<Checkout />} />
              <Route path='success' element={<Success />} />
              <Route path='cancel' element={<Error />} />
            </Route>
            <Route path='single' element={<SingleCourse />} />
            {/* <Route path='product' element={<ProductDetail />} /> */}
            <Route path='auth' element={<Outlet />}>
              <Route index element={<Auth />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
              <Route path='reset-password' element={<NewPassword />} />
            </Route>
            {/* Email verification flow */}
            <Route path='email-verification-sent' element={<EmailVerificationSent />} />
            <Route path='email-verified' element={<EmailVerified />} />
            <Route path='email-verification-failed' element={<EmailVerificationFailed />} />
            <Route path='new-password' element={<NewPassword />} />
            <Route path="MyAccount" element={<MyAccountCommonLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="purchase-history" element={<Purchasehistory />} />
              <Route path="courses" element={<Course />} />
              <Route path="courses/:name" element={<ViewSlot />} />
              <Route path='courses/fixed/:name' element={<FixedSlot />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="edit-profile" element={<EditProfile />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
