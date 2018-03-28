import * as React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {deepPurple500} from 'material-ui/styles/colors';
import './style.less';


interface WithSpinnerProps {
  show: boolean;
}


const withSpinner = <PropsType extends WithSpinnerProps>(InputComponent: React.ComponentType<PropsType>) => {

    return class SpinnerHOC extends React.Component<PropsType> {

        render() {
            return (
                <div className="wrapper">
                    <InputComponent {...this.props} />
                    {this.props.show && <div className="spinner">
                      <CircularProgress size={60} thickness={7} color={deepPurple500}/>
                    </div>}
                </div>
            );
        }
    }
}

export default withSpinner;