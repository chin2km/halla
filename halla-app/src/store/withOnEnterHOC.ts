
// import * as React from 'react';

// export const withOnEnter = (onEnter, BaseComponent) =>
//     class Abc extends React.Component{
//         componentWillMount() {
//             onEnter(this.props);
//         }

//         componentWillReceiveProps(nextProps) {
//             if (nextProps !== this.props) {
//                 onEnter(nextProps);
//             }
//         }

//         render() {
//             return <BaseComponent {...this.props}/>;
//         }
//     };