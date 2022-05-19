package no.nav.pto_admin.config

import no.nav.common.abac.Pep
import no.nav.common.abac.VeilarbPepFactory
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
}
