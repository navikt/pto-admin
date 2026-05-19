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
import no.nav.pto_admin.utils.AzureOboTokenProvider
import no.nav.pto_admin.utils.AppName
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
    fun azureOboTokenProvider(oboClient: AzureAdOnBehalfOfTokenClient): AzureOboTokenProvider {
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
        val aoKontorTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(String.format(
                "api://%s-gcp.dab.ao-oppfolgingskontor/.default",
                if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
            ), token)
        }
        val veilarbarenaTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(String.format(
                "api://%s-fss.pto.veilarbarena/.default",
                if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
            ), token)
        }


        val oboTokenSuppliers: Map<AppName, (String) -> String> =
            mapOf(AppName.VEILARBPORTEFOLJE to veilarbportefoljeTokenProvider,
                AppName.VEILARBOPPFOLGING to veilarboppfolgingTokenProvider,
                AppName.VEILARBARENA to veilarbarenaTokenProvider,
                AppName.VEILARBDIALOG to veilarbdialogTokenProvider,
                AppName.VEILARBVEDTAKSTOTTE to veilarbvedtaksstotteTokenProvider,
                AppName.VEILARBAKTIVITET to veilarbaktivitetTokenProvider,
                AppName.AO_OPPFOLGINGSKONTOR to aoKontorTokenProvider)
        return AzureOboTokenProvider(oboTokenSuppliers)
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
