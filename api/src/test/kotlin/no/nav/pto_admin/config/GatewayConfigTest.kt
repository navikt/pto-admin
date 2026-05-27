package no.nav.pto_admin.config

import no.nav.common.rest.filter.LogRequestFilter.NAV_CALL_ID_HEADER_NAME
import no.nav.pto_admin.utils.AppName
import no.nav.pto_admin.utils.AzureOboTokenProvider
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.mock.http.server.reactive.MockServerHttpRequest
import org.springframework.mock.web.server.MockServerWebExchange
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

class GatewayConfigTest {

    @Test
    fun filter_returns_500_when_authorization_header_is_missing() {
        val filter = gatewayFilter()
        val exchange = exchange(routeId = "veilarbportefolje")

        val exception = assertThrows(ResponseStatusException::class.java) {
            filter.filter(exchange, CapturingGatewayFilterChain())
        }

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.statusCode)
    }

    @Test
    fun filter_fails_when_route_is_not_mapped() {
        val filter = gatewayFilter()
        val exchange = exchange(
            routeId = "unknown-route",
            authorizationHeader = "Bearer incoming-token"
        )

        assertThrows(Exception::class.java) {
            filter.filter(exchange, CapturingGatewayFilterChain())
        }
    }

    @Test
    fun filter_exchanges_token_and_generates_call_id_when_missing() {
        val chain = CapturingGatewayFilterChain()
        val filter = gatewayFilter()
        val exchange = exchange(
            routeId = "veilarbportefolje",
            authorizationHeader = "Bearer incoming-token"
        )

        filter.filter(exchange, chain).block()

        val captured = requireNotNull(chain.capturedExchange)
        val headers = captured.request.headers

        assertEquals("Bearer exchanged-token", headers.getFirst(HttpHeaders.AUTHORIZATION))
        assertNotNull(headers.getFirst(NAV_CALL_ID_HEADER_NAME))
        assertTrue(headers.getFirst(NAV_CALL_ID_HEADER_NAME)?.isNotBlank() == true)
    }

    @Test
    fun filter_preserves_existing_call_id() {
        val chain = CapturingGatewayFilterChain()
        val filter = gatewayFilter()
        val exchange = exchange(
            routeId = "veilarbportefolje",
            authorizationHeader = "Bearer incoming-token",
            callId = "call-id-123"
        )

        filter.filter(exchange, chain).block()

        val captured = requireNotNull(chain.capturedExchange)
        val headers = captured.request.headers

        assertEquals("Bearer exchanged-token", headers.getFirst(HttpHeaders.AUTHORIZATION))
        assertEquals("call-id-123", headers.getFirst(NAV_CALL_ID_HEADER_NAME))
    }

    private fun gatewayFilter() = GatewayConfig().apply {
        azureOboTokenProvider = AzureOboTokenProvider(
            mapOf(AppName.VEILARBPORTEFOLJE to { _ -> "exchanged-token" })
        )
    }.customGlobalFilter()

    private fun exchange(
        routeId: String,
        authorizationHeader: String? = null,
        callId: String? = null
    ): MockServerWebExchange {
        val requestBuilder = MockServerHttpRequest.get("/api/test")

        if (authorizationHeader != null) {
            requestBuilder.header(HttpHeaders.AUTHORIZATION, authorizationHeader)
        }
        if (callId != null) {
            requestBuilder.header(NAV_CALL_ID_HEADER_NAME, callId)
        }

        val exchange = MockServerWebExchange.from(requestBuilder.build())
        exchange.attributes[ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR] = Route.async()
            .id(routeId)
            .uri("http://localhost")
            .predicate { true }
            .build()

        return exchange
    }

    private class CapturingGatewayFilterChain : GatewayFilterChain {
        var capturedExchange: ServerWebExchange? = null

        override fun filter(exchange: ServerWebExchange): Mono<Void> {
            capturedExchange = exchange
            return Mono.empty()
        }
    }
}
