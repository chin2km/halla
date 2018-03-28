import * as React from 'react';
import ReduxToastr from 'react-redux-toastr';

import './style.less';

export namespace Toastr {
  export interface Props {
  }
}

export class Toastr extends React.Component<Toastr.Props> {

  render() {
    return <ReduxToastr
    timeOut={3000}
    newestOnTop={false}
    preventDuplicates
    position="top-right"
    transitionIn="fadeIn"
    transitionOut="fadeOut"
    progressBar/>
  }
}
