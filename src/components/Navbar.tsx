import { JSX, useState, useEffect, useRef, ReactNode } from "react";
import { FaBars, FaTimes, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";
import Link from 'next/link';
import Image from "next/image";
import ButtonUser from "./atoms/ButtonUser";

export type SubNavItem = { name: string; path: string };
export type NavItem = {
  name: string;
  path?: string;
  icon?: JSX.Element; // <-- tambahkan icon opsional
  subNav?: SubNavItem[];
};

export type NavbarProps = {
  navItems: NavItem[];
  logoSrc?: string;
  brandName?: string;
  defaultTheme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
  isMenuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
  children?: ReactNode;
};

export default function Navbar({
  navItems,
  logoSrc = "/icon.png",
  brandName = "Biji Code",
  defaultTheme,
  onThemeChange,
  isMenuOpen: controlledMenu,
  defaultMenuOpen = false,
  onMenuToggle,
  children,
}: NavbarProps) {
  const [uncontrolledMenu, setUncontrolledMenu] = useState(defaultMenuOpen);
  const isControlledMenu = controlledMenu !== undefined;
  const menuOpen = isControlledMenu ? controlledMenu! : uncontrolledMenu;

  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme || "light");
  const [openSub, setOpenSub] = useState<number | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (
        desktopRef.current &&
        !desktopRef.current.contains(e.target as Node)
      ) {
        setOpenSub(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const active = saved || (prefersDark ? "dark" : "light");
    setTheme(active);
    document.documentElement.classList.toggle("dark", active === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    onThemeChange?.(next);
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    if (isControlledMenu) onMenuToggle?.(next);
    else setUncontrolledMenu(next);
  };

  const tooggleSubMenu = (index: number) => {
    if (openSub === index) {
      setOpenSub(null);
    } else {
      setOpenSub(index);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-3">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logoSrc}
            alt="Logo"
            width={60}
            height={60}
            className="h-13 w-13 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
          <span className="font-bold text-xl dark:text-white">{brandName}</span>
        </Link>

        {/* Desktop nav */}
        <nav ref={desktopRef} className="hidden md:flex items-center space-x-2">
          {navItems.map((item, idx) => (
            <div key={idx} className="relative">
              <Link href={item.path || "#"}>
                <button
                  onClick={() => setOpenSub(openSub === idx ? null : idx)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2"
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.name}</span>
                  {item.subNav && <FaChevronDown className="text-sm" />}
                </button>
              </Link>

              {item.subNav && openSub === idx && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                  {item.subNav.map((sub, sidx) => (
                    <Link
                      key={sidx}
                      href={sub.path}
                      onClick={() => setOpenSub(null)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop actions + extra children */}
        <div className="hidden md:flex items-center space-x-4">
          <ButtonUser />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          {children}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      <div
        className={`md:hidden px-5 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col space-y-2">
          {navItems.map((item, idx) => (
            <div key={idx}>
              <button
                onClick={() => {
                  if (item.subNav) {
                    tooggleSubMenu(idx);
                  } else {
                    toggleMenu();
                  }
                }}
                className="p-2 w-full text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <Link
                    href={item.path || "#"}
                    className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-200"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                  {item.subNav && (
                    <FaChevronDown
                      className={openSub === idx ? "transform rotate-180" : ""}
                    />
                  )}
                </div>
              </button>
              {item.subNav && openSub === idx && (
                <div className="pl-4 mt-1 flex flex-col space-y-1">
                  {item.subNav.map((sub, sidx) => (
                    <Link
                      key={sidx}
                      href={sub.path}
                      onClick={() => toggleMenu()}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center">
            <ButtonUser />
          </div>
        </nav>
      </div>
    </header>
  );
}