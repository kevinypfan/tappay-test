import {
  createBrowserRouter,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PaymentPage } from "./pages/Payment";
import { CartPage } from "./pages/CartPage";

export const useRouter = () => {
  return createBrowserRouter([{
    path: '/',
    element: <HomePage />
  },
  {
    path: '/payment',
    element: <PaymentPage />
  },
  {
    path: '/cart',
    element: <CartPage />
  }
]);
}