import * as React from 'react';
import * as R from 'ramda';
import { RouteComponentProps } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import {TextBox} from '../TextBox';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import {deepPurple500, deepPurple600, deepPurple50} from 'material-ui/styles/colors';
import {withSpinner} from '../../components'

import './style.less';

export namespace LoginForm {
  export interface Props {
    onSubmitLogin: (login: LoginData) => void;
    onSubmitSignUp: (signup: SignUpData) => void;
  }
  export interface State {
    login: LoginData,
    signup: SignUpData,
  }
}

class LoginFormClass extends React.Component<LoginForm.Props, LoginForm.State> {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                username: 'admin',
                password: 'admin'
            },
            signup: {
                emailId: '',
                username: '',
                password: ''
            }
        }
    }

    setValue = (path, value)=> {
        const newState = R.assocPath(path, value, this.state)
        this.setState({...newState});
    }

    handleSubmitLogin = () => {
        const {login} = this.state;
        if(!this.checkValuesIsEmpty(login)) {
            this.props.onSubmitLogin(login);
        }
    }
    handleSubmitSignup = () => {
        this.props.onSubmitSignUp(this.state.signup);
    }

    checkValuesIsEmpty = (data) => {
        return R.pipe(
            R.values,
            R.any(R.isEmpty)
        )(data)
    }

    render() {
        const {
            login:{
                username: loginUserName,
                password: loginPassword
            },
            signup:{
                emailId: signupEmailid,
                username: signupUserName,
                password: signupPassword
            },
        } = this.state;
        return (
            <div className={'login-form'}>
                <Tabs initialSelectedIndex={0}
                    tabItemContainerStyle={{background: deepPurple600}}
                    inkBarStyle={{background: deepPurple50}}>
                    <Tab
                        icon={<MapsPersonPin/>}
                        label="Login">
                            <form className="content">
                                <TextBox
                                    value={loginUserName}
                                    onChange={({target:{value}}) => this.setValue(['login', 'username'], value)}
                                    hintText="Username"
                                    autoComplete="username"
                                    /><br />
                                <TextBox
                                    value={loginPassword}
                                    onChange={({target:{value}}) => this.setValue(['login', 'password'], value)}
                                    hintText="Password"
                                    type="password"
                                    autoComplete="current-password"
                                /><br />
                                <RaisedButton label="Login"
                                    disabled={this.checkValuesIsEmpty({loginUserName, loginPassword})}
                                    onClick={this.handleSubmitLogin}/>
                            </form>
                    </Tab>
                    <Tab
                        icon={<MapsPersonPin />}
                        label="Sign-up">
                            <form className="content">
                                <TextBox
                                    value={signupEmailid}
                                    onChange={({target:{value}}) => this.setValue(['signup', 'emailId'], value)}
                                    hintText="Emailid"
                                /><br />
                                <TextBox
                                    value={signupUserName}
                                    onChange={({target:{value}}) => this.setValue(['signup', 'username'], value)}
                                    hintText="Username"
                                    autoComplete="username"
                                /><br />
                                <TextBox
                                    value={signupPassword}
                                    onChange={({target:{value}}) => this.setValue(['signup', 'password'], value)}
                                    hintText="Password"
                                    type="password"
                                    autoComplete="current-password"
                                /><br />
                                <RaisedButton label="Sign-up"
                                disabled={this.checkValuesIsEmpty({signupEmailid, signupUserName, signupPassword})}
                                onClick={this.handleSubmitSignup}/>
                            </form>
                    </Tab>
                </Tabs>
            </div>
    );
  }
}

export const LoginFormComponent = withSpinner(LoginFormClass);