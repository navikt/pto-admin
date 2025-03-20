package no.nav.pto_admin.pdl_pip

import no.nav.common.token_client.client.AzureAdMachineToMachineTokenClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PdlPipClientConfig(
	@Value("\${app.env.pdlpipUrl}") val pdlpipUrl: String,
	@Value("\${app.env.pdlpipScope}") val pdlpipScope: String,
) {

	@Bean
    fun pdlpipClient(tokenClient: AzureAdMachineToMachineTokenClient): PdlPipClient {
		return PdlPipClientImpl(
			baseUrl = pdlpipUrl,
			tokenProvider = { tokenClient.createMachineToMachineToken(pdlpipScope) }
		)
	}
}
