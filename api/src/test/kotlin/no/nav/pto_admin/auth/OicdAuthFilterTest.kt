package no.nav.pto_admin.auth

import com.nimbusds.jose.proc.BadJOSEException
import com.nimbusds.jwt.JWT
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import com.nimbusds.openid.connect.sdk.claims.IDTokenClaimsSet
import com.nimbusds.openid.connect.sdk.validators.BadJWTExceptions
import no.nav.common.auth.context.AuthContext
import no.nav.common.auth.context.UserRole
import no.nav.common.auth.oidc.OidcTokenValidator
import no.nav.common.auth.oidc.filter.UserRoleResolver
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.doThrow
import org.mockito.kotlin.mock
import org.mockito.kotlin.verifyNoInteractions
import org.mockito.kotlin.whenever
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.mock.http.server.reactive.MockServerHttpRequest
import org.springframework.mock.web.server.MockServerWebExchange
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilterChain
import org.springframework.web.util.pattern.PathPatternParser
import reactor.core.publisher.Mono
import java.time.Instant
import java.util.Date

class OicdAuthFilterTest {

    @Test
    fun filter_skips_authentication_for_excluded_paths() {
        val chain = CapturingWebFilterChain()
        val filter = OicdAuthFilter(
            oidcAuthenticators = emptyList(),
            excludePathPattern = PathPatternParser().parse("/internal/**")
        )

        val exchange = MockServerWebExchange.from(
            MockServerHttpRequest.get("/internal/health").build()
        )

        filter.filter(exchange, chain).block()

        assertTrue(chain.wasCalled)
    }

    @Test
    fun filter_returns_unauthorized_when_no_token_is_found() {
        val chain = CapturingWebFilterChain()
        val authenticator = authenticator(
            clientIds = listOf("expected-client"),
            token = null
        )
        val filter = OicdAuthFilter(
            oidcAuthenticators = listOf(authenticator.oidcAuthenticator),
            excludePathPattern = PathPatternParser().parse("/internal/**")
        )

        val exchange = MockServerWebExchange.from(
            MockServerHttpRequest.get("/api/test").build()
        )

        filter.filter(exchange, chain).block()

        assertFalse(chain.wasCalled)
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.response.statusCode)
    }

    @Test
    fun filter_returns_unauthorized_when_audience_does_not_match() {
        val chain = CapturingWebFilterChain()
        val tokenValidator = mock<OidcTokenValidator>()
        val token = jwtWithAudience("wrong-client")

        val authConfig = OidcAuthenticatorConfig(
            discoveryUrl = "http://localhost/.well-known/openid-configuration",
            clientIds = listOf("expected-client"),
            userRoleResolver = mock<UserRoleResolver>(),
            idTokenFinder = TokenFinder { token }
        )

        val filter = OicdAuthFilter(
            oidcAuthenticators = listOf(OidcAuthenticator(tokenValidator, authConfig)),
            excludePathPattern = PathPatternParser().parse("/internal/**")
        )

        val exchange = MockServerWebExchange.from(
            MockServerHttpRequest.get("/api/test")
                .header(HttpHeaders.AUTHORIZATION, "Bearer $token")
                .build()
        )

        filter.filter(exchange, chain).block()

        assertFalse(chain.wasCalled)
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.response.statusCode)
        verifyNoInteractions(tokenValidator)
    }

    @Test
    fun filter_adds_auth_context_when_token_is_valid() {
        val chain = CapturingWebFilterChain()
        val token = jwtWithAudience("expected-client")
        val setup = authenticator(
            clientIds = listOf("expected-client"),
            token = token,
            userRole = UserRole.INTERN
        )

        val filter = OicdAuthFilter(
            oidcAuthenticators = listOf(setup.oidcAuthenticator),
            excludePathPattern = PathPatternParser().parse("/internal/**")
        )

        val exchange = MockServerWebExchange.from(
            MockServerHttpRequest.get("/api/test")
                .header(HttpHeaders.AUTHORIZATION, "Bearer $token")
                .build()
        )

        filter.filter(exchange, chain).block()

        assertTrue(chain.wasCalled)
        assertNotNull(chain.capturedAuthContext)
        assertEquals(UserRole.INTERN, chain.capturedAuthContext?.role)
    }

    @Test
    fun filter_returns_unauthorized_when_token_is_expired() {
        val chain = CapturingWebFilterChain()
        val token = jwtWithAudience("expected-client")
        val setup = authenticator(
            clientIds = listOf("expected-client"),
            token = token,
            userRole = UserRole.INTERN
        )

        doThrow(BadJWTExceptions.EXPIRED_EXCEPTION).whenever(setup.tokenValidator).validate(any<JWT>())

        val filter = OicdAuthFilter(
            oidcAuthenticators = listOf(setup.oidcAuthenticator),
            excludePathPattern = PathPatternParser().parse("/internal/**")
        )

        val exchange = MockServerWebExchange.from(
            MockServerHttpRequest.get("/api/test")
                .header(HttpHeaders.AUTHORIZATION, "Bearer $token")
                .build()
        )

        filter.filter(exchange, chain).block()

        assertFalse(chain.wasCalled)
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.response.statusCode)
    }

    private fun authenticator(
        clientIds: List<String>,
        token: String?,
        userRole: UserRole = UserRole.INTERN
    ): AuthenticatorSetup {
        val tokenValidator = mock<OidcTokenValidator>()
        whenever(tokenValidator.validate(any<JWT>())).thenReturn(mock<IDTokenClaimsSet>())

        val userRoleResolver = mock<UserRoleResolver>()
        whenever(userRoleResolver.resolve(any<JWTClaimsSet>())).thenReturn(userRole)

        val authConfig = OidcAuthenticatorConfig(
            discoveryUrl = "http://localhost/.well-known/openid-configuration",
            clientIds = clientIds,
            userRoleResolver = userRoleResolver,
            idTokenFinder = TokenFinder { token }
        )

        return AuthenticatorSetup(
            oidcAuthenticator = OidcAuthenticator(tokenValidator, authConfig),
            tokenValidator = tokenValidator
        )
    }

    private fun jwtWithAudience(audience: String): String {
        val claims = JWTClaimsSet.Builder()
            .subject("test-user")
            .audience(audience)
            .expirationTime(Date.from(Instant.now().plusSeconds(3600)))
            .build()

        return PlainJWT(claims).serialize()
    }

    private data class AuthenticatorSetup(
        val oidcAuthenticator: OidcAuthenticator,
        val tokenValidator: OidcTokenValidator
    )

    private class CapturingWebFilterChain : WebFilterChain {
        var wasCalled: Boolean = false
        var capturedAuthContext: AuthContext? = null

        override fun filter(exchange: ServerWebExchange): Mono<Void> {
            wasCalled = true
            return Mono.deferContextual { contextView ->
                if (contextView.hasKey("authContext")) {
                    capturedAuthContext = contextView.get("authContext")
                }
                Mono.empty<Void>()
            }
        }
    }
}
