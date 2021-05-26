package no.nav.pto_admin.service

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService {

    fun hentInnloggetBrukerNavn(): Optional<String> {
        return getLoggedInUserToken()
            .flatMap { getOidcUser(it.principal)  }
            .flatMap { getName(it.claims) }
    }

    private fun getLoggedInUserToken(): Optional<OAuth2AuthenticationToken> {
        val auth =  SecurityContextHolder.getContext().authentication

        return if (auth is OAuth2AuthenticationToken) {
            Optional.of(auth)
        } else {
            Optional.empty()
        }
    }

    private fun getOidcUser(oauthUser: OAuth2User): Optional<DefaultOidcUser> {
        return if (oauthUser is DefaultOidcUser) {
            Optional.of(oauthUser)
        } else {
            Optional.empty()
        }
    }

    private fun getName(claims: Map<String, Any>): Optional<String> {
        return Optional.ofNullable(claims.getOrDefault("name", null) as String)
    }

}