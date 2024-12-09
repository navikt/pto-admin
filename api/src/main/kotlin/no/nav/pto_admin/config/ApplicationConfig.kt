package no.nav.pto_admin.config

import no.nav.common.auth.context.AuthContextHolder
import no.nav.common.auth.context.AuthContextHolderThreadLocal
import no.nav.common.client.aktoroppslag.AktorOppslagClient
import no.nav.common.client.aktoroppslag.CachedAktorOppslagClient
import no.nav.common.client.aktoroppslag.PdlAktorOppslagClient
import no.nav.common.client.pdl.PdlClientImpl
import no.nav.common.sts.NaisSystemUserTokenProvider
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.utils.Credentials
import no.nav.common.utils.EnvironmentUtils
import no.nav.common.utils.NaisUtils
import no.nav.common.utils.UrlUtils
import no.nav.common.token_client.builder.AzureAdTokenClientBuilder
import no.nav.common.token_client.client.AzureAdMachineToMachineTokenClient
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
    fun aktorOppslagClient(systemUserTokenProvider: SystemUserTokenProvider): AktorOppslagClient {
        val pdlUrl =
            if (EnvironmentUtils.isProduction().orElseThrow()) UrlUtils.createProdInternalIngressUrl("pdl-api")
            else UrlUtils.createDevInternalIngressUrl("pdl-api")
        val pdlClient = PdlClientImpl(
            pdlUrl,
            systemUserTokenProvider::getSystemUserToken,
            systemUserTokenProvider::getSystemUserToken,
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
    fun azureSystemTokenProvider(tokenClient: AzureAdMachineToMachineTokenClient): AzureSystemTokenProvider {
        val veilarbportefoljeTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                String.format(
                    "api://%s-gcp.obo.veilarbportefolje/.default",
                    if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
                )
            )
        }
        val veilarbvedtaksstotteTokenProvider: () -> String = {
            tokenClient.createMachineToMachineToken(
                String.format(
                    "api://%s-gcp.obo.veilarbvedtaksstotte/.default",
                    if (EnvironmentUtils.isProduction().orElseThrow()) "prod" else "dev"
                )
            )
        }

        val systemTokenSuppliers: Map<SystembrukereAzure, () -> String> =
            mapOf(SystembrukereAzure.VEILARBPORTEFOLJE to veilarbportefoljeTokenProvider,
                SystembrukereAzure.VEILARBVEDTAKSTOTTE to veilarbvedtaksstotteTokenProvider)
        return AzureSystemTokenProvider(systemTokenSuppliers)
    }

    @Bean
    fun authContextHolder(): AuthContextHolder {
        return AuthContextHolderThreadLocal.instance()
    }

    @Bean
    fun serviceUserCredentials(): Credentials {
        return NaisUtils.getCredentials("service_user")
    }

    @Bean
    fun systemUserTokenProvider(properties: EnvironmentProperties, serviceUserCredentials: Credentials): SystemUserTokenProvider {
        return NaisSystemUserTokenProvider(properties.stsDiscoveryUrl, serviceUserCredentials.username, serviceUserCredentials.password)
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
