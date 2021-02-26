import { useState } from 'react';
import constate from 'constate';

export const [AppStoreProvider, useAppStore] = constate(() => {
	const [loggedInUser, setLoggedInUser] = useState<string>();

	return { loggedInUser, setLoggedInUser };
});
