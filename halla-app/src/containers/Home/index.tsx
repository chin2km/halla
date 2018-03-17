import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import SplitterLayout from 'react-splitter-layout';
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
    return <SplitterLayout
            percentage={true}
            primaryMinSize={10}
            secondaryMinSize={10}
            secondaryInitialSize={80}
          >
          <div>Pane 1</div>
          <div>Pane 2</div>
    </SplitterLayout>;
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