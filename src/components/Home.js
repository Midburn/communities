import React from 'react';
import { observer } from 'mobx-react';
import { state } from '../models/state';

@observer
class BaseHome extends React.Component {
  render() {
      return (
          <h1>Welcome {state.loggedUser.name}</h1>
      );
  }

}
export const Home = BaseHome;
