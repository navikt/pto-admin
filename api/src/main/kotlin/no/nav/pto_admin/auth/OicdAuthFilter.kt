package no.nav.pto_admin.auth

import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.proc.BadJOSEException
import com.nimbusds.jwt.JWTParser
import com.nimbusds.openid.connect.sdk.validators.BadJWTExceptions
import no.nav.common.auth.context.AuthContext
import no.nav.common.auth.oidc.UserRoleNullException
import no.nav.common.auth.utils.TokenUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import org.springframework.web.util.pattern.PathPattern

import reactor.core.publisher.Mono
import java.text.ParseException


class OicdAuthFilter(
    private val oidcAuthenticators: List<OidcAuthenticator>,
    private val excludePathPattern: PathPattern,
): WebFilter {

    override fun filter(
        exchange: ServerWebExchange,
        chain: WebFilterChain
    ): Mono<Void> {
        if (excludePathPattern.matches(exchange.request.path.pathWithinApplication())) {
            return chain.filter(exchange)
        }

        val request = exchange.request
        val response = exchange.response

        for (authenticator in oidcAuthenticators) {
            val token = authenticator.findIdToken(request)

            if (token != null) {
                try {
                    var jwtToken = JWTParser.parse(token)

                    // Skip this authenticator if the audience is not matching
                    if (!TokenUtils.hasMatchingAudience(jwtToken, authenticator.config.clientIds)) {
                        continue
                    }

                    authenticator.tokenValidator.validate(jwtToken)

                    val userRole = authenticator.config.userRoleResolver.resolve(jwtToken.jwtClaimsSet)
                    if (userRole == null) {
                        throw UserRoleNullException()
                    }

                    val authContext = AuthContext(userRole, jwtToken)
                    
                    return chain.filter(exchange)
                        .contextWrite { it.put("authContext", authContext) }

                } catch (exception: ParseException) {
                    if (exception === BadJWTExceptions.EXPIRED_EXCEPTION) {
                        logger.info("Token validation failed", exception)
                    } else {
                        logger.error("Token validation failed", exception)
                    }
                } catch (exception: JOSEException) {
                    if (exception === BadJWTExceptions.EXPIRED_EXCEPTION) {
                        logger.info("Token validation failed", exception)
                    } else {
                        logger.error("Token validation failed", exception)
                    }
                } catch (exception: BadJOSEException) {
                    if (exception === BadJWTExceptions.EXPIRED_EXCEPTION) {
                        logger.info("Token validation failed", exception)
                    } else {
                        logger.error("Token validation failed", exception)
                    }
                } catch (e: UserRoleNullException) {
                    logger.error("User roll is null")
                }
            }
        }

        response.statusCode = HttpStatus.UNAUTHORIZED
        return Mono.empty()
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(OicdAuthFilter::class.java)

        // Check if the token is about to expire within the next 5 minutes
        private val CHECK_EXPIRES_WITHIN = (1000 * 60 * 5).toLong()
    }
}