package no.nav.pto_admin.config

import no.nav.common.rest.client.RestUtils
import no.nav.common.rest.filter.LogRequestFilter.NAV_CALL_ID_HEADER_NAME
import no.nav.common.utils.IdUtils
import no.nav.pto_admin.utils.AzureSystemTokenProvider
import no.nav.pto_admin.utils.SystembrukereAzure
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@Configuration
class GatewayConfig {

    @Autowired
    lateinit var azureSystemTokenProvider: AzureSystemTokenProvider

    @Bean
    fun customGlobalFilter(): GlobalFilter {

        return object : GlobalFilter {
            val log: Logger = LoggerFactory.getLogger(GlobalFilter::class.java)

            override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
                val routeId =  (exchange.attributes[ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR] as? Route)?.id
                log.info("RouteId: $routeId")

                val token = exchange.request.headers[HttpHeaders.AUTHORIZATION]?.get(0)?.replace("Bearer ", "")
                    ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Feil ved oppslag av token")
                val exchangeApp = routeIdTokenExchangeMapping[routeId]
                    ?: throw Exception("Fant ingen app å gjøre token exchange mot for route $routeId")

                val bearerToken: String = azureSystemTokenProvider.getOboToken(exchangeApp, token)
                val exchangeWithAuth = exchange.mutate()
                    .request { request ->
                        request.headers { headers ->
                            headers.set(
                                HttpHeaders.AUTHORIZATION,
                                RestUtils.createBearerToken(bearerToken))
                        }
                    }.build()

                val exchangeWithCallId = if (exchangeWithAuth.request.headers[NAV_CALL_ID_HEADER_NAME].isNullOrEmpty())
                    exchangeWithAuth.mutate()
                        .request { request ->
                            request.headers { headers ->
                                headers.set(NAV_CALL_ID_HEADER_NAME, IdUtils.generateId())
                            }
                        }.build()
                    else exchangeWithAuth

                return chain.filter(exchangeWithCallId)
            }
        }
    }
}

val routeIdTokenExchangeMapping = mapOf(
    "veilarbportefolje" to SystembrukereAzure.VEILARBPORTEFOLJE,
    "veilarbvedtaksstotte" to SystembrukereAzure.VEILARBVEDTAKSTOTTE,
    "veilarboppfolging" to SystembrukereAzure.VEILARBOPPFOLGING,
    "veilarbdialog" to SystembrukereAzure.VEILARBDIALOG,
    "veilarbaktivitet" to SystembrukereAzure.VEILARBAKTIVITET,
    "ao-oppfolgingskontor" to SystembrukereAzure.AO_OPPFOLGINGSKONTOR,
)