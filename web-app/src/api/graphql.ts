export interface GraphqlResponse<T> {
	data?: T | null;
	errors?: {
		message: string;
		path?: (string | number)[];
		extensions?: { classification?: string };
	}[];
}

export function validateGraphqlResponse<T>(response: GraphqlResponse<T> | null, service: string): { data: T } {
	if (response?.errors?.length) {
		const details = response.errors
			.map(error =>
				[
					error.message,
					error.path?.length ? `felt: ${error.path.join('.')}` : undefined,
					error.extensions?.classification
				]
					.filter(Boolean)
					.join(' - ')
			)
			.join('\n');
		throw new Error(`GraphQL-feil fra ${service}:\n${details}`);
	}
	if (response?.data == null) {
		throw new Error(`Mangler data i GraphQL-svaret fra ${service}.`);
	}
	return { data: response.data };
}

export const graphqlPayload = (query: string, variables: string | Record<string, unknown>) => {
	return {
		query,
		variables: typeof variables === 'string' ? { fnr: variables } : variables
	};
};
