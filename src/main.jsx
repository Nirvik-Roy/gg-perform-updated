import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BannerProvider } from './context/BannerContext';
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from './context/WishlistContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { BlogProvider } from './context/BlogContext';
import { TrainingProvider } from './context/TrainingContext';
import { CouponProvider } from './context/CouponContext';
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <SiteSettingsProvider>
    <BlogProvider>
      <TrainingProvider>
        <BannerProvider>
          <WishlistProvider>
            <CartProvider>
              <CouponProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CouponProvider>
            </CartProvider>
          </WishlistProvider>
        </BannerProvider>
      </TrainingProvider>
    </BlogProvider>
  </SiteSettingsProvider>
);
