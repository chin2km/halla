import * as React from 'react';
import * as AuthActions from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../reducers';
import {LoginFormComponent} from '../../components';
import './style.less';

export namespace Login {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof AuthActions
    loading: typeof AuthActions
  }

  export interface State {
    /* empty */
  }
}

class Login extends React.Component<Login.Props, Login.State> {

  handleSubmitLogin = (data: LoginData) => {
    this.props.actions.submitLogin(data);
  }
  handleSubmitSignUp = (data: SignUpData) => {
    this.props.actions.submitSignUp(data);
  }
  render() {
    const {children} = this.props;
    return <LoginFormComponent
              show={this.props.loading}
              onSubmitLogin={this.handleSubmitLogin}
              onSubmitSignUp={this.handleSubmitSignUp}
            />
  }
}

function mapStateToProps(state: RootState) {
  return {
    user: state.auth.user,
    error: state.auth.error,
    loading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AuthActions as any, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);