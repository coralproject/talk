import cn from "classnames";
import Link from "next/link";

import { FunctionComponent, useState } from "react";

interface NavGroupProps {
  title: string;
}

const NavGroup: FunctionComponent<NavGroupProps> = ({ title, children }) => {
  return (
    <li className="border-t first:border-t-0">
      <h5 className="px-8 py-2 font-semibold text-gray-900">{title}</h5>
      <ul>{children}</ul>
    </li>
  );
};

interface NavItemGroupProps {
  title: string;
  active: boolean;
}

const NavItemGroup: FunctionComponent<NavItemGroupProps> = ({
  title,
  active,
  children,
}) => {
  const [open, setOpen] = useState(active);

  return (
    <li>
      <button
        className="block transition px-8 py-2 hover:underline text-gray-400"
        onClick={() => {
          setOpen((o) => !o);
        }}
      >
        {title}{" "}
        <span
          className={cn("ml-4", open ? "arrow-down" : "arrow-right")}
        ></span>
      </button>
      {open ? <ul>{children}</ul> : null}
    </li>
  );
};

interface NavItemProps {
  title: string;
  active: boolean;
  url: string;
}

const NavItem: FunctionComponent<NavItemProps> = ({ active, title, url }) => {
  return (
    <li>
      <Link href={url}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          className={cn(
            "block transition px-8 py-2 hover:underline",
            active
              ? "bg-gray-100 text-coral hover:text-coral-dark border-r-4 border-coral font-bold"
              : "text-gray-500 hover:text-gray-500"
          )}
          title={title}
        >
          {title}
        </a>
      </Link>
    </li>
  );
};

export type Nav = Array<{
  title: string;
  items: Array<{
    title: string;
    href: string;
    items?: Array<{
      title: string;
      href: string;
    }>;
  }>;
}>;

interface SidebarNavProps {
  nav: Nav;
  currentPagePath: string;
}

const SidebarLayout: FunctionComponent<SidebarNavProps> = ({
  nav,
  currentPagePath,
}) => {
  return (
    <aside className="flex-none w-80 overflow-x-hidden">
      <div className="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white"></div>
      <nav className="fixed top-24 bottom-0 w-80 overflow-y-auto overflow-x-hidden border-r text-sm">
        <ul className="pt-4 pb-10">
          {nav.map((group) => (
            <NavGroup key={group.title} title={group.title}>
              {group.items.map((item) =>
                item.items ? (
                  <NavItemGroup
                    key={item.href}
                    title={item.title}
                    active={currentPagePath.startsWith(item.href)}
                  >
                    {item.items.map((subItem) => (
                      <NavItem
                        key={subItem.href}
                        title={subItem.title}
                        url={subItem.href}
                        active={currentPagePath === subItem.href}
                      />
                    ))}
                  </NavItemGroup>
                ) : (
                  <NavItem
                    key={item.href}
                    title={item.title}
                    url={item.href}
                    active={currentPagePath === item.href}
                  />
                )
              )}
            </NavGroup>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarLayout;
