package no.nav.pto_admin.auth

import no.nav.common.auth.oidc.filter.UserRoleResolver
import org.springframework.http.server.reactive.ServerHttpRequest
import java.net.http.HttpHeaders

fun interface TokenFinder {
    fun findToken(request: ServerHttpRequest): String?
}

data class OidcAuthenticatorConfig(
    // OIDC discovery URL
    var discoveryUrl: String,

    // Is used to validate the audience claim (if the token has multiple audiences and the AZP claim is set, then AZP will also be validated against this list of IDs)
    var clientIds: List<String>,

    // What type of user is being authenticated
    var userRoleResolver: UserRoleResolver,

    // Retrieves the id token from incoming requests (optional)
    var idTokenFinder: TokenFinder = TokenFinder { request ->
        request.headers.get("Authorization")?.single()?.removePrefix("Bearer ")
    }
)