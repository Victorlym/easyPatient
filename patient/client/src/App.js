import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./components/Home";
 import Add from "./components/Add";
 import Edit from "./components/Edit";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact={true} component={Home} />
          <Route path="/add" component={Add} />
          <Route path="/edit/:id" component={Edit} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
