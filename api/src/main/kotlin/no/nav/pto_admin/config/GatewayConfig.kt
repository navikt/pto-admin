package no.nav.pto_admin.config

import no.nav.common.log.LogFilter
import no.nav.common.log.LogFilter.NAV_CALL_ID_HEADER_NAMES
import no.nav.common.rest.client.RestUtils
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.utils.IdUtils
import no.nav.pto_admin.utils.AzureSystemTokenProvider
import no.nav.pto_admin.utils.SystembrukereAzure
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.util.UriBuilder
import reactor.core.publisher.Mono
import java.net.URI
import java.net.URL


@Configuration
class GatewayConfig {

    @Autowired
    lateinit var systemUserTokenProvider: SystemUserTokenProvider

    @Autowired
    lateinit var azureSystemTokenProvider: AzureSystemTokenProvider

    @Bean
    fun customGlobalFilter(): GlobalFilter {

        return object : GlobalFilter {
            val log: Logger = LoggerFactory.getLogger(GlobalFilter::class.java)

            override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
                val requestHost = URI(exchange.request.path.toString()).host
                log.info("host: $requestHost")
                val bearerToken: String =
                    if (requestHost.contains("veilarbportefolje")) {
                        log.info("Bruker veilarbportefolje azureAd token")
                        azureSystemTokenProvider.getSystemToken(SystembrukereAzure.VEILARBPORTEFOLJE)
                    } else if (requestHost.contains("veilarbvedtaksstotte")) {
                        log.info("Bruker veilarbvedtaksstotte azureAd token")
                        azureSystemTokenProvider.getSystemToken(SystembrukereAzure.VEILARBVEDTAKSTOTTE)
                    } else {
                        log.info("Bruker nais STS token")
                        systemUserTokenProvider.systemUserToken
                    }
                exchange.request.mutate()
                    .header(HttpHeaders.AUTHORIZATION, RestUtils.createBearerToken(bearerToken))
                    .build()
                val callId =
                    NAV_CALL_ID_HEADER_NAMES.flatMap { exchange.request.headers[it] ?: emptyList() }.find { true }
                        ?: IdUtils.generateId()

                if (callId != null) {
                    exchange.request.mutate().header(LogFilter.PREFERRED_NAV_CALL_ID_HEADER_NAME, callId).build()
                }

                log.info("Proxyer request til " + exchange.attributes[GATEWAY_REQUEST_URL_ATTR])

                return chain.filter(exchange)
            }
        }
    }
}
