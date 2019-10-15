import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { Table, TableBody, TableCell, TableHead, TableRow } from "./";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(
    <Table fullWidth>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Email Address</TableCell>
          <TableCell>Member Since</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>ButFirstCoffee</TableCell>
          <TableCell>coffee@mail.com</TableCell>
          <TableCell>01/27/2019</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>SneaksOnSneaks</TableCell>
          <TableCell>hisairness@mail.com</TableCell>
          <TableCell>04/27/2019</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
