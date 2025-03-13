package no.nav.pto_admin.service

import com.nimbusds.jwt.JWTClaimsSet
import no.nav.common.auth.context.AuthContext
import no.nav.common.auth.context.AuthContextHolder
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.util.context.ContextView
import java.util.function.Function



@Service
class AuthService {

    fun hentInnloggetBrukerNavn(): Mono<String> {
        return getLoggedInUserToken()
            .mapNotNull { it.getStringClaim("NAVident") }
            .switchIfEmpty(Mono.error(RuntimeException("NAVident claim was null")))
    }

	fun hentInnloggetBrukerAzureId(): Mono<String> {
        return getLoggedInUserToken().map { it.subject }
	}

    private fun getLoggedInUserToken(): Mono<JWTClaimsSet> {
        return Mono.deferContextual { ctx: ContextView ->
            if (ctx.hasKey("authContext")) {
                val authContext = ctx.get<AuthContext>("authContext")
                return@deferContextual Mono.just(authContext.idToken.jwtClaimsSet)
            }
            Mono.error { RuntimeException("ID token claims not found") }
        }
    }
}
