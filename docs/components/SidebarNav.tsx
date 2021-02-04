import cn from "classnames";
import Link from "next/link";
import { FunctionComponent, useState } from "react";

import reference from "../data/__generated__/sidebar.json";

import data from "../data/nav.yml";

/**
 * NavData stores the navigation data used for displaying navigation bars across
 * the documentation site.
 */
interface NavData {
  sidebar: Array<{
    category: string;
    items: Array<{
      title: string;
      url: string;
    }>;
  }>;
}

interface SidebarNavGroupProps {
  category: string;
}

const SidebarNavGroup: FunctionComponent<SidebarNavGroupProps> = ({
  category,
  children,
}) => {
  return (
    <li className="border-t first:border-t-0">
      <h5 className="px-8 py-2 font-semibold text-gray-900">{category}</h5>
      <ul>{children}</ul>
    </li>
  );
};

interface SidebarNavItemGroupProps {
  title: string;
  active: boolean;
  items: Array<{
    title: string;
    url: string;
    active: boolean;
  }>;
}

const SidebarNavItemGroup: FunctionComponent<SidebarNavItemGroupProps> = ({
  active,
  title,
  items,
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
      {open ? (
        <ul>
          {items.map((item) => (
            <li key={item.url}>
              <Link href={item.url}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={cn(
                    "block transition pl-8 pr-8 py-2 hover:underline text-sm",
                    item.active
                      ? "bg-gray-100 text-coral hover:text-coral-dark border-r-4 border-coral font-bold"
                      : "text-gray-500 hover:text-gray-500"
                  )}
                >
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

interface SidebarNavItemProps {
  active: boolean;
  title: string;
  url: string;
}

const SidebarNavItem: FunctionComponent<SidebarNavItemProps> = ({
  active,
  title,
  url,
}) => {
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
        >
          {title}
        </a>
      </Link>
    </li>
  );
};

interface SidebarNavProps {
  currentPagePath: string;
}

const SidebarNav: FunctionComponent<SidebarNavProps> = ({
  currentPagePath,
}) => {
  return (
    <nav className="border-r fixed w-80 overflow-y-auto">
      <ul>
        {(data as NavData).sidebar.map(({ category, items }, cdx) => (
          <SidebarNavGroup key={cdx} category={category}>
            {items.map(({ title, url }, idx) => (
              <SidebarNavItem
                key={idx}
                title={title}
                url={url}
                active={currentPagePath === url}
              />
            ))}
          </SidebarNavGroup>
        ))}
        <SidebarNavGroup category="GraphQL Reference">
          {reference.map(({ title, url, items }) =>
            items ? (
              <SidebarNavItemGroup
                key={url}
                title={title}
                active={currentPagePath.startsWith(url)}
                items={items.map((item) => ({
                  title: item.title,
                  url: item.url,
                  active: currentPagePath === item.url,
                }))}
              />
            ) : (
              <SidebarNavItem
                key={url}
                title={title}
                url={url}
                active={currentPagePath === url}
              />
            )
          )}
        </SidebarNavGroup>
      </ul>
    </nav>
  );
};

export default SidebarNav;
