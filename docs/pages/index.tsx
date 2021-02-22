import Link from "next/link";
import PageHeader from "../components/PageHeader";

import DocumentationLayout from "../layouts/DocumentationLayout";

export default function Index() {
  // FIXME: implement
  return (
    <DocumentationLayout title="Coral Documentation" currentPagePath="/">
      <PageHeader title="Getting started with Coral" />
      <p>
        Online comments are broken. Our open-source commenting platform, Coral,
        reimagines moderation, comment display, and conversation. Use Coral to
        add smarter, safer discussions to your site without giving away your
        data.
      </p>
      <ul className="list-disc pl-4 my-2">
        <li>
          <Link href="/installation">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="underline text-coral hover:text-coral-dark">
              Install Coral on your server
            </a>
          </Link>
        </li>
        <li>
          <Link href="/development">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="underline text-coral hover:text-coral-dark">
              Run Coral locally
            </a>
          </Link>
        </li>
        <li>
          <Link href="https://coralproject.net/pricing/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              className="underline text-coral hover:text-coral-dark"
              target="_blank"
            >
              Contact us about hosting and support
            </a>
          </Link>
        </li>
      </ul>
    </DocumentationLayout>
  );
}
