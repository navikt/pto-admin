package no.nav.pto_admin.service

import no.nav.common.auth.context.AuthContextHolder
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import java.util.*



@Service
class AuthService(
    private val authContextHolder: AuthContextHolder) {

    fun hentInnloggetBrukerNavn(): Mono<String?> {
        return getLoggedInUserToken()
            .mapNotNull { it?.let { getOidcUser(it.principal) } }
            .mapNotNull { it?.let { getOidcUser(it) } }
            .mapNotNull { it?.let { getName(it.claims) } }
    }

    private fun getLoggedInUserToken(): Mono<OAuth2AuthenticationToken?> {
        return ReactiveSecurityContextHolder.getContext()
            .map { it.authentication }
            .filter { it is OAuth2AuthenticationToken }
            .map { it as OAuth2AuthenticationToken }
    }

    private fun getOidcUser(oauthUser: OAuth2User): DefaultOidcUser? {
        return if (oauthUser is DefaultOidcUser) {
            oauthUser
        } else {
            null
        }
    }

    private fun getName(claims: Map<String, Any>): String? {
        return claims.getOrDefault("name", null) as String?
    }
    fun getInnloggetAnsattUUID(): UUID =
        authContextHolder
            .idTokenClaims.flatMap { authContextHolder.getStringClaim(it, "oid") }
            .map { UUID.fromString(it) }
            .orElseThrow { ResponseStatusException(HttpStatus.FORBIDDEN, "Fant ikke oid for innlogget ansatt") }
}
