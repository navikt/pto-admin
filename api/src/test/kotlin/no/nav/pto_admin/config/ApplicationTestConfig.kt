package no.nav.pto_admin.config

import no.nav.common.abac.AbacClient
import no.nav.common.abac.Pep
import no.nav.common.abac.domain.request.ActionId
import no.nav.common.auth.context.AuthContextHolder
import no.nav.common.auth.context.AuthContextHolderThreadLocal
import no.nav.common.client.aktoroppslag.AktorOppslagClient
import no.nav.common.health.HealthCheckResult
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.types.identer.*
import no.nav.common.utils.Credentials
import no.nav.pto_admin.proxy.PreRequestZuulFilter
import no.nav.pto_admin.service.AuthService
import no.nav.pto_admin.utils.AllowedUsers
import org.springframework.cloud.netflix.zuul.EnableZuulProxy
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

@Configuration
@EnableZuulProxy
@Import(value = [TestConfig::class])
class ApplicationTestConfig {

    companion object {
        const val INNLOGGET_VEILEDER = "Z123456"
    }

    @Bean
    fun preRequestZuulFilter(systemUserTokenProvider: SystemUserTokenProvider, authService: AuthService): PreRequestZuulFilter {
        return PreRequestZuulFilter(authService, systemUserTokenProvider)
    }

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
        }
    }

    @Bean
    fun authContextHolder(): AuthContextHolder {
        return AuthContextHolderThreadLocal.instance()
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
    fun veilarbPep(): Pep {
        return object : Pep {
            override fun harVeilederTilgangTilEnhet(p0: NavIdent?, p1: EnhetId?): Boolean {
               return true
            }

            override fun harTilgangTilEnhet(p0: String?, p1: EnhetId?): Boolean {
                return true
            }

            override fun harTilgangTilEnhetMedSperre(p0: String?, p1: EnhetId?): Boolean {
                return true
            }

            override fun harVeilederTilgangTilPerson(p0: NavIdent?, p1: ActionId?, p2: EksternBrukerId?): Boolean {
                return true
            }

            override fun harTilgangTilPerson(p0: String?, p1: ActionId?, p2: EksternBrukerId?): Boolean {
                return true
            }

            override fun harTilgangTilOppfolging(p0: String?): Boolean {
                return true
            }

            override fun harVeilederTilgangTilModia(p0: String?): Boolean {
                return true
            }

            override fun harVeilederTilgangTilKode6(p0: NavIdent?): Boolean {
                return true
            }

            override fun harVeilederTilgangTilKode7(p0: NavIdent?): Boolean {
                return true
            }

            override fun harVeilederTilgangTilEgenAnsatt(p0: NavIdent?): Boolean {
                return true
            }

            override fun getAbacClient(): AbacClient {
                TODO("Not yet implemented")
            }

        }
    }

    @Bean
    fun allowedUsers(): AllowedUsers {
        return AllowedUsers(listOf(INNLOGGET_VEILEDER))
    }

}
