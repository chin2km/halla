import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import SplitterLayout from 'react-splitter-layout';
import LeftPane from '../LeftPane';
import RightPane from '../RightPane/';
import './style.less';


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
    return <div className="home">
        <SplitterLayout
              percentage={true}
              primaryMinSize={7}
              secondaryMinSize={30}
              secondaryInitialSize={80}
            >
            <LeftPane/>
            <RightPane/>
      </SplitterLayout>
    </div>;
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