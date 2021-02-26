import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

import Search from "./Search";

const Header: FunctionComponent = () => {
  const { basePath } = useRouter();

  return (
    <div className="flex sticky top-0 w-full bg-white">
      <div className="w-80 flex-none px-8 py-4">
        <Link href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="block" title="Go to The Coral Project homepage">
            <img
              className="h-14 mx-auto"
              src={`${basePath}/coralproject_by_voxmedia.svg`}
              alt="Coral by Vox Media"
            />
          </a>
        </Link>
      </div>
      <div className="flex-auto border-b mx-8 flex items-center justify-between">
        <Search />
      </div>
    </div>
  );
};

export default Header;
