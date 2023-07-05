import React, { FunctionComponent } from "react";
import { Helmet } from "react-helmet";

import favicon120 from "./assets/favicon120.png";
import favicon128 from "./assets/favicon128.png";
import favicon152 from "./assets/favicon152.png";
import favicon180 from "./assets/favicon180.png";
import favicon196 from "./assets/favicon196.png";
import favicon228 from "./assets/favicon228.png";
import favicon32 from "./assets/favicon32.png";
import favicon57 from "./assets/favicon57.png";
import favicon76 from "./assets/favicon76.png";
import favicon96 from "./assets/favicon96.png";

const Head: FunctionComponent = () => (
  <Helmet>
    <link rel="icon" href={favicon32} sizes="32x32" />
    <link rel="icon" href={favicon57} sizes="57x57" />
    <link rel="icon" href={favicon76} sizes="76x76" />
    <link rel="icon" href={favicon96} sizes="96x96" />
    <link rel="icon" href={favicon128} sizes="128x128" />
    <link rel="icon" href={favicon228} sizes="228x228" />
    <link rel="shortcut icon" sizes="196x196" href={favicon196} />
    <link rel="apple-touch-icon" href={favicon120} sizes="120x120" />
    <link rel="apple-touch-icon" href={favicon152} sizes="152x152" />
    <link rel="apple-touch-icon" href={favicon180} sizes="180x180" />
  </Helmet>
);

export default Head;
