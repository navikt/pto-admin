package no.nav.pto_admin.auth

import no.nav.common.auth.oidc.OidcTokenValidator
import org.springframework.http.server.reactive.ServerHttpRequest

data class OidcAuthenticator(
    val tokenValidator: OidcTokenValidator,
    val config: OidcAuthenticatorConfig
) {

    fun findIdToken(request: ServerHttpRequest): String? {
        return config.idTokenFinder.findToken(request)
    }

    companion object {
        fun fromConfig(config: OidcAuthenticatorConfig): OidcAuthenticator {

            val validator = OidcTokenValidator(config.discoveryUrl, config.clientIds)
            return OidcAuthenticator(validator, config)
        }

        fun fromConfigs(vararg configs: OidcAuthenticatorConfig): List<OidcAuthenticator> {
            return configs.map { config -> fromConfig(config) }
        }
    }
}