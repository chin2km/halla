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
		joinRoom: (id: any) => void;
	}
	export interface State {
  }
}

export class RoomsList extends React.Component<RoomsListTypes.Props, RoomsListTypes.State> {
	constructor(props) {
		super(props)
	}

  render() {
    const { rooms } = this.props;
    return (
      <div>
        <List>
			{R.map(({title, _id}) => {
				const joinRoom = () => this.props.joinRoom(_id);

				return <ListItem
						onClick={joinRoom}
						className="list-item"
						key={_id}
						primaryText={title}
						leftAvatar={<Avatar>{R.pipe(R.head, R.toUpper)(title)}</Avatar>}
					/>
			}
			)(rooms.reverse())}
			
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
