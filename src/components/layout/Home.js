import React, { Component } from 'react';
import { NavBar, Graph} from '../../components'

class Home extends Component {
  render() {
    return (
      <div>
        {/* <NavBar /> */}
        <Graph />
      </div>
    );
  }
}

export default Home;