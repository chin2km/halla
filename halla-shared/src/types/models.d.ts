declare type UserStoreState = {
	error?: boolean,
	user?: LoginData
};

declare type LoginData = {
	username?: string;
	password?: string;
	_id?: string;
};

declare type SignUpData = {
	username: string;
	password: string;
};
