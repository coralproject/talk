import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { Typography } from "talk-ui/components";

const Stories: StatelessComponent = ({ children }) => (
  <MainLayout>
    <Typography variant="heading3">Stories</Typography>
  </MainLayout>
);

export default Stories;
