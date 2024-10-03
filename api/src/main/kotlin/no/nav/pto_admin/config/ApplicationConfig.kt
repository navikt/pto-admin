package no.nav.pto_admin.config

import no.nav.common.auth.context.AuthContextHolder
import no.nav.common.auth.context.AuthContextHolderThreadLocal
import no.nav.common.client.aktoroppslag.AktorOppslagClient
import no.nav.common.client.aktoroppslag.CachedAktorOppslagClient
import no.nav.common.client.aktoroppslag.PdlAktorOppslagClient
import no.nav.common.client.pdl.PdlClientImpl
import no.nav.common.token_client.builder.AzureAdTokenClientBuilder
import no.nav.common.token_client.client.AzureAdMachineToMachineTokenClient
import no.nav.common.token_client.client.AzureAdOnBehalfOfTokenClient
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

   companion object {
       const val APPLICATION_NAME = "pto-admin"
   }

    @Bean
    fun aktorOppslagClient(
        properties: EnvironmentProperties,
        tokenClient: AzureAdMachineToMachineTokenClient,
        aadOboToken: AzureAdOnBehalfOfTokenClient,
        authContextHolder: AuthContextHolder
    ): AktorOppslagClient {
        val pdlClient = PdlClientImpl(properties.pdlApiUrl,
            { aadOboToken.exchangeOnBehalfOfToken(properties.pdlApiScope, authContextHolder.requireIdTokenString());},
            { tokenClient.createMachineToMachineToken(properties.pdlApiScope) },
            null
        )
        return CachedAktorOppslagClient(PdlAktorOppslagClient(pdlClient))
    }

    @Bean
    fun azureAdMachineToMachineTokenClient(): AzureAdMachineToMachineTokenClient {
        return AzureAdTokenClientBuilder.builder()
            .withNaisDefaults()
            .buildMachineToMachineTokenClient()
    }

    @Bean
    fun azureAdOnBehalfOfTokenClient(): AzureAdOnBehalfOfTokenClient {
        return AzureAdTokenClientBuilder.builder()
            .withNaisDefaults()
            .buildOnBehalfOfTokenClient()
    }

    @Bean
    fun azureSystemTokenProvider(tokenClient: AzureAdMachineToMachineTokenClient, properties: EnvironmentProperties): AzureSystemTokenProvider {
        val veilarbportefoljeTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                properties.veilarbportefoljeScope
            )
        }
        val veilarbvedtaksstotteTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                properties.veilarbvedtaksstotteScope
            )
        }

        val veilarboppfolgingTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                properties.veilarboppfolgingScope
            )
        }

        val veilarbarenaTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                properties.veilarbarenaScope
            )
        }

        val veilarbdialogTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                properties.veilarbdialogScope
            )
        }

        val systemTokenSuppliers: Map<SystembrukereAzure, () -> String> =
            mapOf(
                SystembrukereAzure.VEILARBPORTEFOLJE to veilarbportefoljeTokenProvider,
                SystembrukereAzure.VEILARBVEDTAKSTOTTE to veilarbvedtaksstotteTokenProvider,
                SystembrukereAzure.VEILARBOPPFOLGING to veilarboppfolgingTokenProvider,
                SystembrukereAzure.VEILARBARENA to veilarbarenaTokenProvider,
                SystembrukereAzure.VEILARBDIALOG to veilarbdialogTokenProvider
            )
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
