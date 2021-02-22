import DocumentationLayout from "../layouts/DocumentationLayout";
import Link from "next/link";

export default function Index() {
  // FIXME: implement
  return (
    <DocumentationLayout title="Coral Documentation" currentPagePath="/">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold my-2">Getting started with Coral</h1>
        <p>
          Online comments are broken. Our open-source commenting platform,
          Coral, reimagines moderation, comment display, and conversation. Use
          Coral to add smarter, safer discussions to your site without giving
          away your data.
        </p>
        <ul className="list-disc text-blue-400 pl-4 my-2">
          <li>
            <Link href="/installation" passHref>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="text-blue-500 font-md font-bold">
                Install Coral on your server
              </a>
            </Link>
          </li>
          <li>
            <Link href="/development" passHref>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="text-blue-500 font-md font-bold">
                Run Coral locally
              </a>
            </Link>
          </li>
          <li>
            <a
              className="text-blue-500 font-md font-bold"
              href="https://coralproject.net/pricing/"
            >
              Contact us about hosting and support
            </a>
          </li>
        </ul>
      </div>
    </DocumentationLayout>
  );
}
