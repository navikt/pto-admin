package no.nav.pto_admin.service

import com.nimbusds.jwt.JWTClaimsSet
import no.nav.common.auth.context.AuthContextHolder
import org.springframework.stereotype.Service

@Service
class AuthService(
    val authContextHolder: AuthContextHolder
) {

    fun hentInnloggetBrukerNavn(): String {
        return getLoggedInUserToken().getClaim("NAVident").toString()
    }

	fun hentInnloggetBrukerAzureId(): String {
        return getLoggedInUserToken().subject
	}

    private fun getLoggedInUserToken(): JWTClaimsSet {
        return authContextHolder.idTokenClaims.get()
    }
}
