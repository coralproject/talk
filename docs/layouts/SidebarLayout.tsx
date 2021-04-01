import cn from "classnames";
import Link from "next/link";
import { forwardRef, FunctionComponent, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

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

const NavItem = forwardRef<HTMLLIElement, NavItemProps>(
  ({ active, title, url }, ref) => (
    <li ref={ref}>
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
  )
);

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
  navIsOpen: boolean;
  setNavIsOpen: (open: boolean) => void;
}

const SidebarLayout: FunctionComponent<SidebarNavProps> = ({
  nav,
  currentPagePath,
  navIsOpen,
  setNavIsOpen,
}) => {
  const activeItemRef = useRef<HTMLLIElement>(null);
  const scrollRef = useRef<HTMLElement>(null);

  // This will scroll to the active menu element. This was copied from how
  // Tailwind CSS's documentation does the same thing.
  //
  // https://github.com/tailwindlabs/tailwindcss.com/blob/205d003aded3de506a633c4eb00eab094555888e/src/layouts/SidebarLayout.js#L40-L53
  //
  useIsomorphicLayoutEffect(() => {
    if (!activeItemRef.current || !scrollRef.current) {
      return;
    }

    const scrollRect = scrollRef.current.getBoundingClientRect();
    const activeItemRect = activeItemRef.current.getBoundingClientRect();

    const top = activeItemRef.current.offsetTop;

    // For some reason, the heights of the rectangle are not being read as
    // numbers by eslint.
    //
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const bottom = top - scrollRect.height + activeItemRect.height;

    if (
      scrollRef.current.scrollTop > top ||
      scrollRef.current.scrollTop < bottom
    ) {
      scrollRef.current.scrollTop =
        activeItemRef.current.offsetTop -
        scrollRect.height / 2 +
        activeItemRect.height / 2;
    }
  }, [currentPagePath, navIsOpen]);

  return (
    <>
      <button
        type="button"
        // fixed z-50 bottom-4 right-4 w-16 h-16 rounded-full bg-gray-900 text-white block lg:hidden
        className="bg-coral hover:bg-coral-dark text-white rounded-full p-4 fixed bottom-4 right-4 z-50 lg:hidden"
        // className="bg-coral hover:bg-coral-dark z-20 text-white rounded-full p-4 fixed bottom-4 right-4 lg:hidden"
        onClick={() => {
          setNavIsOpen(!navIsOpen);
        }}
      >
        {navIsOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
      <aside
        className={cn(
          "flex-none fixed lg:static z-40 inset-0 h-full bg-black bg-opacity-25 w-full lg:bg-transparent lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-80 lg:block",
          {
            hidden: !navIsOpen,
          }
        )}
      >
        <nav
          ref={scrollRef}
          className="h-full overflow-y-auto scrolling-touch bottom-0 lg:h-auto lg:block lg:fixed lg:w-80 lg:bg-transparent overflow-hidden lg:top-24 bg-white mr-24 lg:mr-0 text-sm border-r"
        >
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
                          ref={
                            currentPagePath === subItem.href
                              ? activeItemRef
                              : undefined
                          }
                        />
                      ))}
                    </NavItemGroup>
                  ) : (
                    <NavItem
                      key={item.href}
                      title={item.title}
                      url={item.href}
                      active={currentPagePath === item.href}
                      ref={
                        currentPagePath === item.href
                          ? activeItemRef
                          : undefined
                      }
                    />
                  )
                )}
              </NavGroup>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarLayout;
