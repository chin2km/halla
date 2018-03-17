import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import Splitter from 'm-react-splitters';
import './splitter.less';


export namespace Home {
  export interface Props extends RouteComponentProps<void> {
  }

  export interface State {
  }
}

class Home extends React.Component<Home.Props, Home.State> {

  componentDidMount() {
  }
  
  render() {
    return <Splitter
            position="vertical"
            primaryPaneMaxWidth="80%"
            primaryPaneMinWidth={0}
            primaryPaneWidth="400px"
            postPoned={false}
            >    
            <div></div>
            <div></div>
    </Splitter>;
  }
}

function mapStateToProps(state: RootState) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);