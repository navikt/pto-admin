package no.nav.pto_admin.service

import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.util.*

@Service
class AuthService {

    fun hentInnloggetBrukerNavn(): Mono<String?> {
        return getLoggedInUserToken()
            .mapNotNull { it?.let { getOidcUser(it.principal) } }
            .mapNotNull { it?.let { getOidcUser(it) } }
            .mapNotNull { it?.let { getName(it.claims) } }
    }

	fun hentInnloggetBrukerAzureId(): Mono<UUID?> {
		return getLoggedInUserToken()
			.mapNotNull { it?.let { getOidcUser(it.principal) } }
			.mapNotNull { it?.let { getOidcUser(it) } }
			.mapNotNull { it?.let { hentInnloggetVeilederUUID(it.claims) } }
            .mapNotNull { it?.let { UUID.fromString(it) } }
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

	private fun hentInnloggetVeilederUUID(claims: Map<String, Any>): String? {
		return claims.getOrDefault("oid", null) as String?
	}
}
