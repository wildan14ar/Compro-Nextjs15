import { JSX, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import ButtonLogout from "./atoms/ButtonLogout";
import Link from "next/link";
import Image from "next/image";

// Menu types
type SubMenuItem = {
  name: string;
  href: string;
};
type MenuItem = {
  name: string;
  icon: JSX.Element;
  href?: string;
  submenu?: SubMenuItem[];
};

// Sidebar props
type SidebarProps = {
  menuItems: MenuItem[];
  logoSrc?: string;
  brandName?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number; // width in px
  placement?: "left" | "right";
  children?: ReactNode; // additional content inside sidebar
};

export default function Sidebar({
  menuItems,
  isOpen: controlledOpen,
  logoSrc = "/icon.png",
  brandName = "Biji Code",
  defaultOpen = true,
  onOpenChange,
  width = 256,
  placement = "left",
  children,
}: SidebarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleOpen = () => {
    const next = !open;
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setUncontrolledOpen(next);
    }
  };

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu((prev) => (prev === name ? null : name));
  };

  const offsetX = open ? 0 : placement === "left" ? -width : width;

  return (
    <>
      {!open && (
        <div
          className={`h-full ${placement}-4 p-3 bg-white dark:bg-gray-900 shadow-md`}
        >
          <div className="flex items-center justify-between sm:mb-4">
            <Link href="/" className="flex sm:hidden items-center space-x-2">
              <Image
                src={logoSrc}
                alt="Logo"
                width={60}
                height={60}
                className="h-13 w-13 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <span className="font-bold text-xl dark:text-white">
                {brandName}
              </span>
            </Link>
            <button
              onClick={toggleOpen}
              className="p-2 rounded bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md hover:shadow-lg transition"
            >
              <Menu size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <div className="hidden sm:flex flex-col items-center gap-4">
            {menuItems.map((item) => (
              <Link
                href={item.href ?? item.submenu?.[0]?.href ?? "#"}
                key={item.name}
              >
                <button className="p-2 rounded bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md hover:shadow-lg transition">
                  {item.icon}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {open && (
        <motion.aside
          initial={false}
          animate={placement === "left" ? { x: offsetX } : { x: -offsetX }}
          transition={{ duration: 0.2 }}
          className={`absolute sm:static top-0 ${placement}-0 h-full w-full sm:w-64 flex flex-col justify-between bg-white dark:bg-gray-900 shadow-xl overflow-y-auto border-r dark:border-gray-800`}
        >
          <div>
            <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-800">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={logoSrc}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-bold text-xl dark:text-white">
                  {brandName}
                </span>
              </Link>
              <button
                onClick={toggleOpen}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border dark:border-gray-700 shadow-md"
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.name} className="space-y-0.5">
                  {item.submenu ? (
                    <button
                      onClick={() => toggleSubMenu(item.name)}
                      className="w-full flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <motion.span
                        animate={{
                          rotate: openSubMenu === item.name ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="transform"
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </button>
                  ) : (
                    <Link
                      href={item.href ?? "#"}
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors space-x-2"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )}

                  <AnimatePresence>
                    {openSubMenu === item.name && item.submenu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {children && (
              <div className="px-4 py-2 border-t dark:border-gray-800">
                {children}
              </div>
            )}
          </div>

          <div className="m-3 border-t dark:border-gray-800 mt-4">
            <ButtonLogout />
          </div>
        </motion.aside>
      )}
    </>
  );
}
