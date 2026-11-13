export interface GraphqlResponse<T> {
	data?: T | null;
	errors?: {
		message: string;
		path?: (string | number)[];
		extensions?: { classification?: string };
	}[];
}

export interface GraphqlResult<T> {
	data: T | null;
	error?: string;
}

export function validateGraphqlResponse<T>(response: GraphqlResponse<T> | null, service: string): GraphqlResult<T> {
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
		return { data: response.data ?? null, error: `GraphQL-feil fra ${service}:\n${details}` };
	}
	if (response?.data == null) {
		return { data: null, error: `Mangler data i GraphQL-svaret fra ${service}.` };
	}
	return { data: response.data };
}

export const graphqlPayload = (query: string, variables: string | Record<string, unknown>) => {
	return {
		query,
		variables: typeof variables === 'string' ? { fnr: variables } : variables
	};
};
