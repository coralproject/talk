import React from 'react';
import {Layout} from 'react-mdl';
import 'material-design-lite';
import Header from 'components/Header';

export default (props) => (
  <Layout>
    <Header>
      {props.children}
    </Header>
  </Layout>
);
