import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./pages/NotFound";
import OrderHistory from "./pages/OrderHistory";
import ProfileInformation from "./pages/ProfileInformation";
import ProfileSecurity from "./pages/ProfileSecurity";
import SendVerifyEmail from "./pages/SendVerifyEmail";
import VerifyEmail from "./pages/VerifyEmail";
import PersistLogin from "./features/auth/PersistLogin";
import CheckLoggedIn from "./components/CheckLoggedIn";
import ShippingAddress from "./pages/ShippingAddress";
import BookDetails from "./features/books/BookDetails";
import ProfileFavorites from "./pages/ProfileFavorites";
import SyncCart from "./components/SyncCart";
import OrderDetail from "./features/orders/OrderDetail";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SyncCart />}>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<AppLayout />}>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route index element={<Navigate replace to="books" />} />
                <Route path="books" element={<Books />} />
                <Route path="books/:slug" element={<BookDetails />} />
                <Route element={<CheckLoggedIn />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot" element={<Forgot />} />
                  <Route
                    path="send-verify-email"
                    element={<SendVerifyEmail />}
                  />
                  <Route
                    path="reset-password/:passwordResetToken"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="verify-email/:emailVerifyToken"
                    element={<VerifyEmail />}
                  />
                </Route>

                <Route path="/cart" element={<Cart />} />
              </Route>

              {/* Private routes */}
              <Route element={<PrivateRoute />}>
                <Route path="profile" element={<Profile />}>
                  <Route
                    index
                    element={<Navigate replace to="information" />}
                  />
                  <Route path="information" element={<ProfileInformation />} />
                  <Route path="security" element={<ProfileSecurity />} />
                  <Route path="favorites" element={<ProfileFavorites />} />
                  <Route path="order-history" element={<OrderHistory />} />
                  <Route path="order-history/:id" element={<OrderDetail />} />
                  <Route
                    path="shipping-address"
                    element={<ShippingAddress />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
