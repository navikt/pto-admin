package no.nav.pto_admin.config

import no.nav.common.abac.Pep
import no.nav.common.abac.VeilarbPepFactory
import no.nav.common.auth.context.AuthContextHolder
import no.nav.common.auth.context.AuthContextHolderThreadLocal
import no.nav.common.client.aktoroppslag.AktorOppslagClient
import no.nav.common.client.aktorregister.AktorregisterHttpClient
import no.nav.common.sts.NaisSystemUserTokenProvider
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.utils.Credentials
import no.nav.common.utils.NaisUtils
import no.nav.pto_admin.proxy.PreRequestZuulFilter
import no.nav.pto_admin.service.AuthService
import no.nav.pto_admin.utils.AllowedUsers
import no.nav.pto_admin.utils.parseAllowedUsersStr
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.cloud.netflix.zuul.EnableZuulProxy
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@EnableZuulProxy
@Configuration
@EnableConfigurationProperties(EnvironmentProperties::class)
class ApplicationConfig {

   companion object {
       const val APPLICATION_NAME = "pto-admin"
   }

    @Bean
    fun preRequestZuulFilter(systemUserTokenProvider: SystemUserTokenProvider): PreRequestZuulFilter {
        return PreRequestZuulFilter(systemUserTokenProvider)
    }

    @Bean
    fun aktorOppslagClient(properties: EnvironmentProperties, systemUserTokenProvider: SystemUserTokenProvider): AktorOppslagClient {
        return AktorregisterHttpClient(
                properties.aktorregisterUrl, APPLICATION_NAME, systemUserTokenProvider::getSystemUserToken
        )
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
    fun veilarbPep(properties: EnvironmentProperties, serviceUserCredentials: Credentials): Pep {
        return VeilarbPepFactory.get(properties.abacUrl, serviceUserCredentials.username, serviceUserCredentials.password)
    }

    @Bean
    fun allowedUsers(properties: EnvironmentProperties): AllowedUsers {
        return parseAllowedUsersStr(properties.allowedAdminUsers)
    }

}