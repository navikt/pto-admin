import React, { ReactNode, useState } from 'react';
import { Tabs } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';

export interface UserQuery {
	ident: string;
	id: string;
	component: ReactNode;
}

interface UserQueryResultsContainerProps {
	queries: UserQuery[];
	onCloseTab: (id: string) => void;
}

export function UserQueryResultsContainer({ queries, onCloseTab }: UserQueryResultsContainerProps) {
	const [activeTabId, setActiveTabId] = useState<string | undefined>(queries[0]?.id);

	// Update active tab if current active tab is removed
	React.useEffect(() => {
		if (activeTabId && !queries.find(q => q.id === activeTabId)) {
			setActiveTabId(queries[0]?.id);
		}
	}, [queries, activeTabId]);

	if (queries.length === 0) {
		return null;
	}

	return (
		<div className="p-4 border border-gray-300 rounded-lg bg-white mt-4">
			<Tabs value={activeTabId} onChange={value => setActiveTabId(value)}>
				<Tabs.List>
					{queries.map(query => (
						<div key={query.id} className="flex justify-center items-center">
							<Tabs.Tab value={query.id} label={query.ident} />
							<button
								className=" p-1 cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded transition-colors duration-200 z-10 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
								onClick={e => {
									e.stopPropagation();
									onCloseTab(query.id);
								}}
								aria-label={`Close tab for ${query.ident}`}
								title={`Close ${query.ident}`}
							>
								<XMarkIcon aria-hidden="true" />
							</button>
						</div>
					))}
				</Tabs.List>
				{queries.map(query => {
					return (
						<Tabs.Panel key={query.id} value={query.id}>
							<div className="p-6 border-t border-gray-300">{query.component}</div>
						</Tabs.Panel>
					);
				})}
			</Tabs>
		</div>
	);
}
