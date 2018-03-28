import { ActionsObservable, combineEpics } from 'redux-observable';
import { SEND_MESSAGE_TO_ROOM } from '../actions/constants';
import { CHATROOM_NSC, sendMessage } from '../websockets/websocket';

const sendMessageEpic = (action$: ActionsObservable<any>, store: any) =>
    action$.ofType(SEND_MESSAGE_TO_ROOM)
        .do(({payload}) => {
            sendMessage({
                route: SEND_MESSAGE_TO_ROOM,
                message: {
                    message: {
                        message: payload,
                        userId: store.getState().auth.user._id,
                        username: store.getState().auth.user.username
                    },
                    roomId: store.getState().chatRoom._id,
                }
            }, CHATROOM_NSC)
        })
        .ignoreElements();

export const chatRoomEpics = combineEpics(
    sendMessageEpic
)