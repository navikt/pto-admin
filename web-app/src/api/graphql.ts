export const graphqlPayload = <TVariables extends Record<string, unknown>>(query: string, variables: TVariables) => {
	return {
		query,
		variables
	}
}