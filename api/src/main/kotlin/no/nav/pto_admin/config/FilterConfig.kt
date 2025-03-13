package no.nav.pto_admin.config

import no.nav.common.auth.oidc.filter.AzureAdUserRoleResolver
import no.nav.pto_admin.auth.OicdAuthFilter
import no.nav.pto_admin.auth.OidcAuthenticator
import no.nav.pto_admin.auth.OidcAuthenticatorConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.WebFluxConfigurer
import org.springframework.web.server.WebFilter
import org.springframework.web.util.pattern.PathPatternParser


@Configuration
class FilterConfig: WebFluxConfigurer {

    private fun naisAzureAdConfig(properties: EnvironmentProperties): OidcAuthenticatorConfig {
        return OidcAuthenticatorConfig(
            discoveryUrl = properties.naisAadDiscoveryUrl,
            clientIds = listOf(properties.naisAadClientId),
            userRoleResolver = AzureAdUserRoleResolver()
        )
    }

    @Bean
    fun customFilter(properties: EnvironmentProperties): WebFilter {
        val naisAzureAdConfig = naisAzureAdConfig(properties)
        val config = OidcAuthenticator.fromConfigs(naisAzureAdConfig)
        val excludePathPattern = PathPatternParser().parse("/internal/*")
        val authenticationFilter = OicdAuthFilter(config, excludePathPattern)
        return authenticationFilter
    }
}