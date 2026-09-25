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
        val env = if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"

        val veilarbportefoljeTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.obo.veilarbportefolje/.default",
                token
            )
        }
        val veilarbvedtaksstotteTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.obo.veilarbvedtaksstotte/.default",
                token
            )
        }
        val veilarboppfolgingTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.poao.veilarboppfolging/.default",
                token
            )
        }
        val veilarbdialogTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.dab.veilarbdialog/.default",
                token
            )
        }
        val veilarbaktivitetTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.dab.veilarbaktivitet/.default",
                token
            )
        }
        val aoKontorTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.dab.ao-oppfolgingskontor/.default",
                token
            )
        }
        val aktivitetArenaAclTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.dab.aktivitet-arena-acl/.default",
                token
            )
        }
        val veilarbarenaTokenProvider: (token: String) -> String = { token ->
            oboClient.exchangeOnBehalfOfToken(
                "api://${env}-gcp.fss.pto.veilarbarena/.default",
                token
            )
        }


        val oboTokenSuppliers: Map<AppName, (String) -> String> =
            mapOf(AppName.VEILARBPORTEFOLJE to veilarbportefoljeTokenProvider,
                AppName.VEILARBOPPFOLGING to veilarboppfolgingTokenProvider,
                AppName.VEILARBARENA to veilarbarenaTokenProvider,
                AppName.VEILARBDIALOG to veilarbdialogTokenProvider,
                AppName.VEILARBVEDTAKSTOTTE to veilarbvedtaksstotteTokenProvider,
                AppName.VEILARBAKTIVITET to veilarbaktivitetTokenProvider,
                AppName.AO_OPPFOLGINGSKONTOR to aoKontorTokenProvider,
                AppName.AKTIVITET_ARENA_ACL to aktivitetArenaAclTokenProvider)
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
