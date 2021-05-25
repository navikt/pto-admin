package no.nav.pto_admin.config

import no.nav.common.auth.Constants
import no.nav.common.auth.context.UserRole
import no.nav.common.auth.oidc.filter.OidcAuthenticationFilter
import no.nav.common.auth.oidc.filter.OidcAuthenticator
import no.nav.common.auth.oidc.filter.OidcAuthenticatorConfig
import no.nav.common.log.LogFilter
import no.nav.common.rest.filter.SetStandardHttpHeadersFilter
import no.nav.common.utils.EnvironmentUtils
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FilterConfig {

    private fun azureAdAuthConfig(properties: EnvironmentProperties): OidcAuthenticatorConfig {
        return OidcAuthenticatorConfig()
                .withDiscoveryUrl(properties.openAmDiscoveryUrl)
                .withClientId(properties.veilarbloginOpenAmClientId)
                .withIdTokenCookieName(Constants.OPEN_AM_ID_TOKEN_COOKIE_NAME)
                .withUserRole(UserRole.INTERN)
    }

    @Bean
    fun logFilterRegistrationBean(): FilterRegistrationBean<LogFilter> {
        val registration = FilterRegistrationBean<LogFilter>()
        registration.filter = LogFilter(EnvironmentUtils.requireApplicationName(), EnvironmentUtils.isDevelopment().orElse(false))
        registration.order = 1
        registration.addUrlPatterns("/*")
        return registration
    }

    @Bean
    fun authenticationFilterRegistrationBean(properties: EnvironmentProperties): FilterRegistrationBean<OidcAuthenticationFilter> {
        val registration = FilterRegistrationBean<OidcAuthenticationFilter>()
        val authenticationFilter = OidcAuthenticationFilter(
                OidcAuthenticator.fromConfigs(azureAdAuthConfig(properties))
        )
        registration.filter = authenticationFilter
        registration.order = 2
        registration.addUrlPatterns("/api/*")
        return registration
    }

    @Bean
    fun setStandardHeadersFilterRegistrationBean(): FilterRegistrationBean<SetStandardHttpHeadersFilter> {
        val registration = FilterRegistrationBean<SetStandardHttpHeadersFilter>()
        registration.filter = SetStandardHttpHeadersFilter()
        registration.order = 3
        registration.addUrlPatterns("/*")
        return registration
    }

}