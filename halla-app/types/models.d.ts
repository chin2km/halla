/** TodoMVC model definitions **/

declare type TodoItemId = number;

declare type TodoFilterType = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';

declare type UserStoreState = LoginData;

declare type LoginData = {
  username?: string;
  password?: string;
}

declare type SignUpData = {
  emailid: string;
  username: string;
  password: string;
}
