import { FunctionComponent } from "react";

interface Props {
  title: string;
  description?: string | null;
}

const PageHeader: FunctionComponent<Props> = ({ title, description }) => {
  return (
    <header className="my-10">
      <h1 className="text-3xl font-extrabold text-gray-900 my-1">{title}</h1>
      {description && <p className="text-lg">{description}</p>}
    </header>
  );
};

export default PageHeader;
