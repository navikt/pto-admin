package no.nav.pto_admin.config

import jakarta.servlet.Filter
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import no.nav.common.auth.oidc.filter.AzureAdUserRoleResolver
import no.nav.common.auth.oidc.filter.OidcAuthenticationFilter
import no.nav.common.auth.oidc.filter.OidcAuthenticator.fromConfigs
import no.nav.common.auth.oidc.filter.OidcAuthenticatorConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.reactive.config.WebFluxConfigurer
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono
import reactor.core.publisher.MonoSink
import java.io.IOException
import java.util.function.Consumer


@Configuration
class FilterConfig: WebFluxConfigurer {

    private fun naisAzureAdConfig(properties: EnvironmentProperties): OidcAuthenticatorConfig? {
        return OidcAuthenticatorConfig()
            .withDiscoveryUrl(properties.naisAadDiscoveryUrl)
            .withClientId(properties.naisAadClientId)
            .withUserRoleResolver(AzureAdUserRoleResolver())
    }

    @Bean
    fun customFilter(properties: EnvironmentProperties): WebFilter {
        val authenticationFilter = OidcAuthenticationFilter(fromConfigs(naisAzureAdConfig(properties)))
        return  ServletFilterToWebFilterAdapter(authenticationFilter)
    }
}


/**
 * Adapter to convert a traditional javax.servlet.Filter into a reactive WebFlux WebFilter.
 */
class ServletFilterToWebFilterAdapter(private val servletFilter: Filter) : WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        return Mono.create<Any>(Consumer { sink: MonoSink<Any> ->
            try {
                // Convert reactive request/response to servlet request/response
                val httpRequest = exchange.request
                val httpResponse = exchange.response

                val servletRequest = getHttpServletRequest(httpRequest)
                val servletResponse = getHttpServletResponse(httpResponse)

                // Call the traditional Servlet Filter
                servletFilter.doFilter(servletRequest, servletResponse, { req, res ->
                    // After the filter is executed, continue with the reactive chain
                    sink.success()
                })
            } catch (e: IOException) {
                sink.error(e)
            } catch (e: ServletException) {
                sink.error(e)
            }
        }).then<Void>(chain.filter(exchange))
    }

    private fun getHttpServletRequest(request: ServerHttpRequest): HttpServletRequest {
        return request as HttpServletRequest
    }

    private fun getHttpServletResponse(response: ServerHttpResponse): HttpServletResponse {
        return response as HttpServletResponse
    }
}