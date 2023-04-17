import { atom } from "recoil";
import { cartData } from "../components/_data";

export const orderState = atom({
  key: "orderState", // unique ID (with respect to other atoms/selectors)
  default: [...cartData], // default value (aka initial value)
  dangerouslyAllowMutability: true
});
