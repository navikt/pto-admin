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
				val urlString = exchange.request.path.toString()
                log.info("kommer inn med url: ${urlString}")
                val token = exchange.request.headers[HttpHeaders.AUTHORIZATION]?.get(0)?.replace("Bearer ", "")
                if (token == null) throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Feil ved oppslag av token")
                val bearerToken: String =
                    if (urlString.contains("veilarbportefolje")) {
                        log.info("Bruker veilarbportefolje azureAd token")
                        azureSystemTokenProvider.getOboToken(SystembrukereAzure.VEILARBPORTEFOLJE, token)
                    } else if (urlString.contains("veilarbvedtaksstotte")) {
                        log.info("Bruker veilarbvedtaksstotte azureAd token")
                        azureSystemTokenProvider.getOboToken(SystembrukereAzure.VEILARBVEDTAKSTOTTE, token)
                    } else if (urlString.contains("veilarboppfolging")) {
                        log.info("Bruker veilarboppfolging azureAd token")
                        if (token == null) throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Feil ved opslag av token")
                        azureSystemTokenProvider.getOboToken(SystembrukereAzure.VEILARBOPPFOLGING, token)
                    } else if (urlString.contains("veilarbdialog")) {
                        log.info("Bruker veilarbdialog azureAd token")
                        if (token == null) throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Feil ved opslag av token")
                        azureSystemTokenProvider.getOboToken(SystembrukereAzure.VEILARBDIALOG, token)
                    } else if (urlString.contains("veilarbaktivitet")) {
                        log.info("Bruker veilarbaktivitet azureAd token")
                        if (token == null) throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Feil ved opslag av token")
                        azureSystemTokenProvider.getOboToken(SystembrukereAzure.VEILARBAKTIVITET, token)
                    } else {
                        throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Ukjent proxy url ${urlString}")
                    }

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
