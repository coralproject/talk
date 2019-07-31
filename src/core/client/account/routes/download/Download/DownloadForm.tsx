import React, { FunctionComponent } from "react";

interface Props {
  token: string;
}

const DownloadForm: FunctionComponent<Props> = ({ token }) => {
  return (
    <div>
      <form method="post" action="http://localhost:8080/api/account/download">
        <input name="token" type="hidden" value={token} />
        <button type="submit">Download</button>
      </form>
    </div>
  );
};

export default DownloadForm;
