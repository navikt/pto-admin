package no.nav.pto_admin.service

import com.nimbusds.jwt.JWTClaimsSet
import no.nav.common.auth.context.AuthContextHolder
import org.springframework.stereotype.Service

@Service
class AuthService(
    val authContextHolder: AuthContextHolder
) {

    fun hentInnloggetBrukerNavn(): String {
        val navIdent = getLoggedInUserToken().getStringClaim("NAVident")
        if (navIdent == null) {
            throw RuntimeException("NAVident claim was null")
        }
        return navIdent
    }

	fun hentInnloggetBrukerAzureId(): String {
        return getLoggedInUserToken().subject
	}

    private fun getLoggedInUserToken(): JWTClaimsSet {
        return authContextHolder.idTokenClaims.orElseThrow { RuntimeException("ID token claims not found") }
    }
}
