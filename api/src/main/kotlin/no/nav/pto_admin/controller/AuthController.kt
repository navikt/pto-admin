package no.nav.pto_admin.controller

import no.nav.pto_admin.service.AuthService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(val authService: AuthService) {

    @GetMapping("/me")
    fun me(): User {
        val brukerNavn = authService.hentInnloggetBrukerNavn()
        return User(brukerNavn.orElse("Ukjent"))
    }

    data class User(val navn: String)

}