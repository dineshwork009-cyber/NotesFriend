import "../app.css";
import { useEffect, useState } from "react";
import { Flex } from "@theme-ui/components";
import { hardNavigate, useQueryParams } from "../navigation";
import { CheckoutEventNames, initializePaddle } from "@paddle/paddle-js";
import { CLIENT_PADDLE_TOKEN } from "../dialogs/buy-dialog/paddle";
import { Loader } from "../components/loader";
import { IS_DEV } from "../dialogs/buy-dialog/helpers";

function Payments() {
  const [{ _ptxn, priceId, email, quantity }] = useQueryParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!_ptxn && !priceId) return hardNavigate("/notes");
    (async function () {
      const paddle = await initializePaddle({
        token: CLIENT_PADDLE_TOKEN,
        environment: IS_DEV ? "sandbox" : "production",
        eventCallback: (event) => {
          if (event.name === CheckoutEventNames.CHECKOUT_CLOSED)
            window.history.back();
        }
      });
      if (!paddle) return hardNavigate("/notes");

      setIsLoading(false);
      if (_ptxn) {
        paddle.Checkout.open({
          transactionId: _ptxn,
          settings: {
            displayMode: "overlay",
            allowDiscountRemoval: true,
            showAddDiscounts: true,
            showAddTaxId: true
          }
        });
      } else if (priceId) {
        paddle.Checkout.open({
          items: [
            {
              priceId,
              quantity:
                quantity && !isNaN(parseInt(quantity)) ? parseInt(quantity) : 1
            }
          ],
          customData: { email },
          customer: email
            ? {
                email
              }
            : undefined,
          settings: { displayMode: "overlay" }
        });
      }
    })();
  }, [_ptxn, priceId, email, quantity]);

  return isLoading ? (
    <Flex
      sx={{
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Loader title="Loading" />
    </Flex>
  ) : null;
}
export default Payments;
