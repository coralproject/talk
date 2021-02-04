import { FunctionComponent } from "react";

interface Props {
  title: string;
  description?: string | null;
}

const Header: FunctionComponent<Props> = ({ title, description }) => {
  return (
    <header className="border-b border-gray-200 my-10 pb-10">
      <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
      {description && <p className="mt-1 text-lg">{description}</p>}
    </header>
  );
};

export default Header;
