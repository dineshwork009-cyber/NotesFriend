import { Plan, PricingInfo } from "./types";
import { create } from "zustand";
import { create as produce } from "mutative";

interface ICheckoutStore {
  selectedPlan?: Plan;
  selectPlan: (plan?: Plan) => void;
  pricingInfo?: PricingInfo;
  updatePrice: (pricingInfo?: PricingInfo) => void;
  isApplyingCoupon: boolean;
  setIsApplyingCoupon: (isApplyingCoupon: boolean) => void;
  couponCode?: string;
  applyCoupon: (couponCode?: string) => void;
  reset: () => void;
}
export const useCheckoutStore = create<ICheckoutStore>((set) => ({
  selectedPlan: undefined,
  selectedPrice: undefined,
  pricingInfo: undefined,
  couponCode: undefined,
  isApplyingCoupon: false,
  selectPlan: (plan) =>
    set(
      produce((state: ICheckoutStore) => {
        state.selectedPlan = plan;
        state.pricingInfo = undefined;
      })
    ),
  updatePrice: (pricingInfo) =>
    set(
      produce((state: ICheckoutStore) => {
        state.pricingInfo = pricingInfo;
      })
    ),
  applyCoupon: (couponCode) =>
    set(
      produce((state: ICheckoutStore) => {
        state.couponCode = couponCode;
      })
    ),
  setIsApplyingCoupon: (isApplyingCoupon) =>
    set(
      produce((state: ICheckoutStore) => {
        state.isApplyingCoupon = isApplyingCoupon;
      })
    ),
  reset: () => {
    set(
      produce((state: ICheckoutStore) => {
        state.selectedPlan = undefined;
        state.pricingInfo = undefined;
        state.couponCode = undefined;
        state.isApplyingCoupon = false;
      })
    );
  }
}));
