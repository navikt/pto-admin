package no.nav.pto_admin.config

import no.nav.common.client.aktoroppslag.AktorOppslagClient
import no.nav.common.client.aktoroppslag.BrukerIdenter
import no.nav.common.health.HealthCheckResult
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.token_client.client.AzureAdMachineToMachineTokenClient
import no.nav.common.token_client.client.AzureAdOnBehalfOfTokenClient
import no.nav.common.types.identer.*
import no.nav.common.utils.Credentials
import no.nav.poao_tilgang.client.PoaoTilgangClient
import no.nav.pto_admin.utils.AzureSystemTokenProvider
import no.nav.pto_admin.utils.SystembrukereAzure
import org.mockito.Mockito.mock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

@Configuration
@Import(value = [TestConfig::class])
class ApplicationTestConfig {

    @Bean
    fun aktorOppslagClient(): AktorOppslagClient {
        return object : AktorOppslagClient {
            override fun checkHealth(): HealthCheckResult {
                TODO("Not yet implemented")
            }

            override fun hentFnr(aktorId: AktorId): Fnr {
                return Fnr.of("123456789")
            }

            override fun hentAktorId(fnr: Fnr): AktorId {
                return AktorId.of("11122223456789")
            }

            override fun hentFnrBolk(p0: MutableList<AktorId>?): MutableMap<AktorId, Fnr> {
                TODO("Not yet implemented")
            }

            override fun hentAktorIdBolk(p0: MutableList<Fnr>?): MutableMap<Fnr, AktorId> {
                TODO("Not yet implemented")
            }

            override fun hentIdenter(p0: EksternBrukerId?): BrukerIdenter {
                TODO("Not yet implemented")
            }
        }
    }

    @Bean
    fun serviceUserCredentials(): Credentials {
        return Credentials("username", "password")
    }

    @Bean
    fun systemUserTokenProvider(): SystemUserTokenProvider {
        return SystemUserTokenProvider { "SYSTEM_USER_TOKEN" }
    }

    @Bean
    fun azureAdMachineToMachineTokenClient(): AzureAdMachineToMachineTokenClient {
        return mock(AzureAdMachineToMachineTokenClient::class.java)
    }

    @Bean
    fun azureAdOnBehalfOfTokenClient(): AzureAdOnBehalfOfTokenClient {
        return mock(AzureAdOnBehalfOfTokenClient::class.java)
    }

    @Bean
    fun azureSystemTokenProvider(): AzureSystemTokenProvider {
        return AzureSystemTokenProvider(mapOf(SystembrukereAzure.VEILARBPORTEFOLJE to { "SYSTEM_USER_TOKEN_AZURE" }))
    }

    @Bean
    fun poaoTilgangClient(): PoaoTilgangClient {
        return mock(PoaoTilgangClient::class.java)
    }

}
