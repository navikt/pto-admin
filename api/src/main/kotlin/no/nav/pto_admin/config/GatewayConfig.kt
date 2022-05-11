package no.nav.pto_admin.config

import no.nav.common.log.LogFilter
import no.nav.common.log.LogFilter.NAV_CALL_ID_HEADER_NAMES
import no.nav.common.rest.client.RestUtils
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.utils.IdUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.web.server.ServerWebExchange


@Configuration
class GatewayConfig {

    @Autowired
    lateinit var systemUserTokenProvider: SystemUserTokenProvider

    @Bean
    fun customGlobalFilter(): GlobalFilter? {
        return GlobalFilter { exchange: ServerWebExchange, chain: GatewayFilterChain ->

            exchange.request.mutate()
                .header(HttpHeaders.AUTHORIZATION, RestUtils.createBearerToken(systemUserTokenProvider.systemUserToken))
                .build()

            val callId = NAV_CALL_ID_HEADER_NAMES.flatMap { exchange.request.headers[it] ?: emptyList() }.find { true }
                ?: IdUtils.generateId()

            if (callId != null) {
                exchange.request.mutate().header(LogFilter.PREFERRED_NAV_CALL_ID_HEADER_NAME, callId).build()
            }

            chain.filter(exchange)
        }
    }
}
