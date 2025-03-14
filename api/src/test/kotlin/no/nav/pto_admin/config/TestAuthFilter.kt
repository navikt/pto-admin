package no.nav.pto_admin.config

import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import jakarta.servlet.*
import jakarta.servlet.FilterConfig
import jakarta.servlet.http.HttpServletRequest
import no.nav.common.auth.Constants
import no.nav.common.auth.context.AuthContext
import no.nav.common.auth.context.AuthContextHolderThreadLocal
import no.nav.common.auth.context.UserRole
import no.nav.common.utils.fn.UnsafeRunnable
import org.springframework.stereotype.Service

@Service
class TestAuthContextFilter : Filter {
    override fun doFilter(
        servletRequest: ServletRequest?,
        servletResponse: ServletResponse?,
        filterChain: FilterChain
    ) {
        val TEST_AUDIENCE = "test-audience"
        val TEST_ISSUER = "https://testIssuer.test"

        val testIdentHeader = "x_test_ident"
        val httpRequest = servletRequest as HttpServletRequest
        val test_ident = httpRequest.getHeader(testIdentHeader)

        val authContext = AuthContext(
            UserRole.INTERN,
            PlainJWT(veilederClaims(test_ident, "testObjectId")),
        )

        AuthContextHolderThreadLocal.instance()
            .withContext(authContext, UnsafeRunnable { filterChain.doFilter(servletRequest, servletResponse) })
    }

    private fun veilederClaims(test_ident: String, objectId: String): JWTClaimsSet {

        return JWTClaimsSet.Builder()
            .subject(test_ident)
            .audience(TEST_AUDIENCE)
            .issuer(TEST_ISSUER)
            .claim(Constants.AAD_NAV_IDENT_CLAIM, test_ident)
            .claim(Constants.AZURE_OID_CLAIM, objectId)
            .build()
    }

    private fun brukerClaims(test_ident: String): JWTClaimsSet {
        return JWTClaimsSet.Builder()
            .subject(test_ident)
            .claim("pid", test_ident)
            .claim("acr", "Level4")
            .audience(TEST_AUDIENCE)
            .issuer(TEST_ISSUER)
            .build()
    }

    override fun init(filterConfig: FilterConfig?) {
    }

    override fun destroy() {
    }

    companion object {
        const val TEST_AUDIENCE: String = "test-audience"
        const val TEST_ISSUER: String = "https://testIssuer.test"
        const val identHeder: String = "X_test_ident"
        const val typeHeder: String = "X_test_ident_type"
    }
}