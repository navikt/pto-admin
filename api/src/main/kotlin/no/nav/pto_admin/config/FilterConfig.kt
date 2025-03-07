package no.nav.pto_admin.config

import no.nav.common.auth.oidc.filter.AzureAdUserRoleResolver
import no.nav.common.auth.oidc.filter.OidcAuthenticationFilter
import no.nav.common.auth.oidc.filter.OidcAuthenticator.fromConfigs
import no.nav.common.auth.oidc.filter.OidcAuthenticatorConfig
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FilterConfig {

    private fun naisAzureAdConfig(properties: EnvironmentProperties): OidcAuthenticatorConfig? {
        return OidcAuthenticatorConfig()
            .withDiscoveryUrl(properties.naisAadDiscoveryUrl)
            .withClientId(properties.naisAadClientId)
            .withUserRoleResolver(AzureAdUserRoleResolver())
    }

    @Bean
    fun filters(properties: EnvironmentProperties): FilterRegistrationBean<OidcAuthenticationFilter> {
        val authenticationFilter = OidcAuthenticationFilter(fromConfigs(naisAzureAdConfig(properties)))
        return FilterRegistrationBean<OidcAuthenticationFilter>()
            .also { it.setFilter(authenticationFilter) }
            .also { it.setOrder(1) }
            .also { it.addUrlPatterns("/api/*") }
    }
}