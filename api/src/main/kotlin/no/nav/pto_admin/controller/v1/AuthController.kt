package no.nav.pto_admin.controller.v1

import no.nav.pto_admin.service.AuthService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/auth")
class AuthController(val authService: AuthService) {

    @GetMapping("/me")
    fun me(): Mono<User> {
        return authService.hentInnloggetBrukerNavn()
            .map { User(navn = it) }
    }

    data class User(val navn: String)

}