package no.nav.pto_admin.config

import no.nav.common.rest.filter.LogRequestFilter
import no.nav.common.rest.filter.LogRequestFilter.NAV_CALL_ID_HEADER_NAME
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
import reactor.core.publisher.Mono

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
                val bearerToken: String =
                    if (exchange.request.path.toString().contains("veilarbportefolje")) {
                        log.info("Bruker veilarbportefolje azureAd token")
                        azureSystemTokenProvider.getSystemToken(SystembrukereAzure.VEILARBPORTEFOLJE)
                    } else if (exchange.request.path.toString().contains("veilarbvedtaksstotte")) {
                        log.info("Bruker veilarbvedtaksstotte azureAd token")
                        azureSystemTokenProvider.getSystemToken(SystembrukereAzure.VEILARBVEDTAKSTOTTE)
                    } else {
                        log.info("Bruker nais STS token")
                        systemUserTokenProvider.systemUserToken
                    }
                exchange.request.mutate()
                    .header(HttpHeaders.AUTHORIZATION, RestUtils.createBearerToken(bearerToken))
                    .build()

                if (exchange.request.headers[NAV_CALL_ID_HEADER_NAME].isNullOrEmpty()) {
					exchange.request.mutate().header(NAV_CALL_ID_HEADER_NAME, IdUtils.generateId()).build()
				}



                log.info("Proxyer request til " + exchange.attributes[GATEWAY_REQUEST_URL_ATTR])

                return chain.filter(exchange)
            }
        }
    }
}
