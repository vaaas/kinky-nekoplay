export type Notice = {
	readonly type: 'notice';
	readonly message: string;
}

export type Chat = {
	readonly type: 'chat';
	readonly name: string;
	readonly message: string;
}
