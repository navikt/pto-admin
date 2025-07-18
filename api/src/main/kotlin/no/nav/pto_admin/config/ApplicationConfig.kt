package no.nav.pto_admin.config

import no.nav.common.auth.context.AuthContextHolder
import no.nav.common.auth.context.AuthContextHolderThreadLocal
import no.nav.common.token_client.builder.AzureAdTokenClientBuilder
import no.nav.common.token_client.client.AzureAdMachineToMachineTokenClient
import no.nav.common.token_client.client.AzureAdOnBehalfOfTokenClient
import no.nav.common.utils.EnvironmentUtils
import no.nav.poao_tilgang.client.PoaoTilgangCachedClient
import no.nav.poao_tilgang.client.PoaoTilgangClient
import no.nav.poao_tilgang.client.PoaoTilgangHttpClient
import no.nav.pto_admin.utils.AzureSystemTokenProvider
import no.nav.pto_admin.utils.SystembrukereAzure
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(EnvironmentProperties::class)
class ApplicationConfig {

    @Bean
    fun azureAdMachineToMachineTokenClient(): AzureAdMachineToMachineTokenClient {
        return AzureAdTokenClientBuilder.builder()
            .withNaisDefaults()
            .buildMachineToMachineTokenClient()
    }

    @Bean
    fun azureAdOboTokenClient(): AzureAdOnBehalfOfTokenClient {
        return AzureAdTokenClientBuilder.builder()
            .withNaisDefaults()
            .buildOnBehalfOfTokenClient()
    }

    @Bean
    fun azureSystemTokenProvider(tokenClient: AzureAdMachineToMachineTokenClient, oboClient: AzureAdOnBehalfOfTokenClient): AzureSystemTokenProvider {
        val veilarbportefoljeTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                String.format(
                    "api://%s-gcp.obo.veilarbportefolje/.default",
                    if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
                ),
                token
            )
        }
        val veilarbvedtaksstotteTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                String.format(
                    "api://%s-gcp.obo.veilarbvedtaksstotte/.default",
                    if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
                ),
                token
            )
        }
        val veilarboppfolgingTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(String.format(
                "api://%s-gcp.poao.veilarboppfolging/.default",
                if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
            ), token)
        }
        val veilarbdialogTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(String.format(
                "api://%s-gcp.dab.veilarbdialog/.default",
                if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
            ), token)
        }
        val veilarbaktivitetTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(String.format(
                "api://%s-gcp.dab.veilarbaktivitet/.default",
                if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
            ), token)
        }


        val systemTokenSuppliers: Map<SystembrukereAzure, (String) -> String> =
            mapOf(SystembrukereAzure.VEILARBPORTEFOLJE to veilarbportefoljeTokenProvider,
                SystembrukereAzure.VEILARBOPPFOLGING to veilarboppfolgingTokenProvider,
                SystembrukereAzure.VEILARBDIALOG to veilarbdialogTokenProvider,
                SystembrukereAzure.VEILARBVEDTAKSTOTTE to veilarbvedtaksstotteTokenProvider,
                SystembrukereAzure.VEILARBAKTIVITET to veilarbaktivitetTokenProvider)
        return AzureSystemTokenProvider(systemTokenSuppliers)
    }

    @Bean
    fun authContextHolder(): AuthContextHolder {
        return AuthContextHolderThreadLocal.instance()
    }

	@Bean
	fun poaoTilgangClient(
		properties: EnvironmentProperties,
		tokenClient: AzureAdMachineToMachineTokenClient
	): PoaoTilgangClient {
		return PoaoTilgangCachedClient(
			PoaoTilgangHttpClient(
				properties.poaoTilgangUrl,
				{ tokenClient.createMachineToMachineToken(properties.poaoTilgangScope) })
		)
	}
}
