package no.nav.pto_admin.config

import no.nav.common.log.LogFilter
import no.nav.common.log.LogFilter.NAV_CALL_ID_HEADER_NAMES
import no.nav.common.rest.client.RestUtils
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.utils.IdUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono


@Configuration
class GatewayConfig {


    @Autowired
    lateinit var systemUserTokenProvider: SystemUserTokenProvider

    @Bean
    fun customGlobalFilter(): GlobalFilter {

        return object : GlobalFilter {
            val log: Logger = LoggerFactory.getLogger(GlobalFilter::class.java)

            override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
                exchange.request.mutate()
                    .header(
                        HttpHeaders.AUTHORIZATION,
                        RestUtils.createBearerToken(systemUserTokenProvider.systemUserToken)
                    )
                    .build()

                val callId =
                    NAV_CALL_ID_HEADER_NAMES.flatMap { exchange.request.headers[it] ?: emptyList() }.find { true }
                        ?: IdUtils.generateId()

                if (callId != null) {
                    exchange.request.mutate().header(LogFilter.PREFERRED_NAV_CALL_ID_HEADER_NAME, callId).build()
                }

                log.info("Proxyer request til " + exchange.request.uri)

                return chain.filter(exchange)
            }
        }
    }
}
