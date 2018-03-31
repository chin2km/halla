import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { RootState } from "../../reducers";
import SplitterLayout from "react-splitter-layout";
import LeftPane from "../LeftPane";
import RightPane from "../RightPane/";
import "./style.less";


export namespace Home {
	export interface Props extends RouteComponentProps<void> {
		leftPane: any;
	}

	export interface State {
	}
}

class Home extends React.Component<Home.Props, Home.State> {

	componentDidMount () {

	}

	render () {
		return <div className="home">
			<SplitterLayout
				percentage={true}
				primaryMinSize={10}
				secondaryMinSize={30}
				secondaryInitialSize={80}
				>
				<LeftPane show={this.props.leftPane.loading}/>
				<RightPane/>
		</SplitterLayout>
		</div>;
	}
}

function mapStateToProps (state: RootState) {
	return {
		leftPane: state.componentsStates.leftPane
	};
}

function mapDispatchToProps () {
	return {

	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);