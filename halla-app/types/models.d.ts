/** TodoMVC model definitions **/

declare type TodoItemId = number;

declare type TodoFilterType = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';

declare type UserStoreState = {
  error?: boolean,
  user?: LoginData
};

declare type LoginData = {
  username?: string;
  password?: string;
  _id?: string;
}

declare type SignUpData = {
  emailId: string;
  username: string;
  password: string;
}
