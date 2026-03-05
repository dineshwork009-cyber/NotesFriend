import { MenuPresenter } from "@notesfriend/ui";
import { useMenuTrigger, useMenu } from "../../hooks/use-menu";
import useMobile from "../../hooks/use-mobile";

function GlobalMenuWrapper() {
  const { isOpen, closeMenu } = useMenuTrigger();
  const { items, options } = useMenu();
  const isMobile = useMobile();

  return (
    <MenuPresenter
      isOpen={isOpen}
      onClose={closeMenu}
      focusOnRender={!options.blocking}
      blocking={options.blocking}
      isMobile={isMobile}
      position={options.position || {}}
      items={items}
      title={options.title}
    />
  );
}
export default GlobalMenuWrapper;
