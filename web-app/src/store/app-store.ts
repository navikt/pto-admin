import { useState } from 'react';
import constate from 'constate';
import { User } from '../api';

export const [AppStoreProvider, useAppStore] = constate(() => {
	const [loggedInUser, setLoggedInUser] = useState<User>();

	return { loggedInUser, setLoggedInUser };
});
