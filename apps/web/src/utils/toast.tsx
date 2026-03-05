import { Button, Flex, Text } from "@theme-ui/components";
import { ScopedThemeProvider } from "../components/theme-provider";
import { Error, Warn, Success, Info } from "../components/icons";
import toast from "react-hot-toast";

type ToastType = "success" | "error" | "warn" | "info";
type ToastAction = {
  text: string;
  onClick: () => void;
  type?: "accent" | "paragraph";
};

const ToastIcons = {
  error: Error,
  success: Success,
  warn: Warn,
  info: Info
};

export function showToast(
  type: ToastType,
  message: string,
  actions?: ToastAction[],
  hideAfter = 5000
): { hide: () => void } {
  const id = toast(<ToastContainer message={message} actions={actions} />, {
    duration: hideAfter || Infinity,
    icon: <ToastIcon type={type} />,
    id: message,
    position: "bottom-right",
    style: {
      maxWidth: "auto",
      backgroundColor: "var(--background)"
    }
  });
  return { hide: () => toast.dismiss(id) };
}

type ToastContainerProps = {
  message: string;
  actions?: ToastAction[];
};

function ToastContainer(props: ToastContainerProps) {
  const { message, actions } = props;
  return (
    <ScopedThemeProvider>
      <Flex
        bg={"background"}
        data-test-id="toast"
        sx={{
          borderRadius: "default",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          data-test-id="toast-message"
          variant="body"
          mr={2}
          sx={{ fontSize: "body", color: "paragraph" }}
        >
          {message}
        </Text>
        {actions?.map((action) => (
          <Button
            variant="dialog"
            sx={{
              py: "7px",
              m: 0,
              flexShrink: 0,
              fontSize: "body",
              color: action.type || "accent"
            }}
            key={action.text}
            onClick={action.onClick}
          >
            {action.text}
          </Button>
        ))}
      </Flex>
    </ScopedThemeProvider>
  );
}

function ToastIcon({ type }: { type: ToastType }) {
  const IconComponent = ToastIcons[type];
  return (
    <IconComponent
      size={24}
      color={type === "info" ? "blue" : `var(--icon-${type})`}
    />
  );
}
