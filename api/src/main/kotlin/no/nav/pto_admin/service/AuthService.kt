package no.nav.pto_admin.service

import no.nav.common.auth.context.AuthContextHolder
import no.nav.pto_admin.utils.AllowedUsers
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class AuthService(
    private val allowedUsers: AllowedUsers,
    private val authContextHolder: AuthContextHolder
) {

    fun sjekkTilgangTilPtoAdmin() {
        if (!harTilgangTilPtoAdmin()) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Bruker har ikke tilgang til PTO Admin")
        }
    }

    fun harTilgangTilPtoAdmin(): Boolean {
        val loggedInUser = hentInnloggetBrukerIdent()
            .orElseThrow{ return@orElseThrow ResponseStatusException(HttpStatus.UNAUTHORIZED) }

        return allowedUsers.users.contains(loggedInUser)
    }

    fun hentInnloggetBrukerIdent(): Optional<String> {
        return authContextHolder.navIdent.map{ it.get() }.or{ authContextHolder.subject }
    }

}