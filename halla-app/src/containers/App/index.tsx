import * as React from 'react';
import { 
  Router, Route, Switch, RouteComponentProps 
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import {Header, LoginForm} from '../../components';
import Login from '../Login'
import * as WebsocketActions from '../../actions/websocket';
import './style.less';

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    connect: any;
  }

  export interface State {
  }
}

class App extends React.Component<App.Props, App.State> {

  componentDidMount() {
    this.props.connect();
  }
  
  render() {
    const { children } = this.props;
    const test = () => <h1>LOGIN (FAKE) SUCCESS!</h1>;
    return (
        <div className={"enthoo"}>
          <Header title="Halla"/>
          <Switch>
                <Route exact path={'/'} component={Login}/>
                <Route path={'/login'} component={Login}/>
                <Route path={'/home'} component={test}/>
            </Switch>
        </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    connect: bindActionCreators(WebsocketActions.connect, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);