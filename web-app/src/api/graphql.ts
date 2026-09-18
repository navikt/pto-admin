export const graphqlPayload = (query: string, variables: string | Record<string, unknown>) => {
	return {
		query,
		variables: typeof variables === 'string' ? { fnr: variables } : variables
	}
}