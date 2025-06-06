export const graphqlPayload = (query: string, fnr: string) => {
	return {
		query,
		variables: { fnr }
	}
}