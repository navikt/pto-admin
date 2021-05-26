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
        val ident = authService.hentInnloggetBrukerIdent()
        return User(ident.orElseThrow())
    }

    data class User(val ident: String)

}