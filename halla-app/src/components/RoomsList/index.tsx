import * as React from 'react';
import * as R from 'ramda';

import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import './style.less';

export namespace RoomsListTypes {
  export interface Props {
    rooms: any[];
	}
	export interface State {
  }
}

class RoomsListClass extends React.Component<RoomsListTypes.Props, RoomsListTypes.State> {
	constructor(props) {
		super(props)
	}

  render() {
    const { rooms } = this.props;
    return (
      <div>
        <List>
					{R.map(({name}) => <ListItem
						className="list-item"
						key={name}
						primaryText={name}
						leftAvatar={<Avatar>{R.pipe(R.head, R.toUpper)(name)}</Avatar>}
						rightIcon={<CommunicationChatBubble />}
					/>)(rooms)}
					
					{R.isEmpty(rooms) && 
						<ListItem
						className="list-item"
						primaryText={"No channels found"}/>
					}
				</List>
				<Divider />
      </div>
    );
  }
}

export const RoomsList = RoomsListClass;
