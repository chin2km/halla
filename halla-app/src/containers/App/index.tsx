import * as React from "react";
import {
  Route, Switch, RouteComponentProps
} from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RootState } from "../../reducers";
import { Header, Toastr } from "../../components";
import Login from "../Login";
import Home from "../Home";
import * as WebsocketActions from "../../actions/websocket";
import * as ReactTooltip from "react-tooltip";

import "./style.less";
import "react-redux-toastr/src/styles/index.scss";

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    connect: any;
  }

  export interface State {
  }
}

class App extends React.Component<App.Props, App.State> {

  componentDidMount () {
    this.props.connect();
  }

  render () {
    return (
        <div className="app">
          <Header title="Halla"/>
          <Switch>
                <Route exact path={"/"} component={Login}/>
                <Route path={"/login"} component={Login}/>
                <Route path={"/home"} component={Home}/>
          </Switch>
          <ReactTooltip  border place={"right"} effect="solid" delayShow={500}/>
          <Toastr/>
        </div>
    );
  }
}

function mapStateToProps (state: RootState) {
  return {
    user: state.auth
  };
}

function mapDispatchToProps (dispatch) {
  return {
    connect: bindActionCreators(WebsocketActions.connect, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);