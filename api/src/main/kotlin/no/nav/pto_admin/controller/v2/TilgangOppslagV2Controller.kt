package no.nav.pto_admin.controller.v2

import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.service.TilgangOppslagService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v2/tilgang")
class TilgangOppslagV2Controller(private val tilgangOppslagService: TilgangOppslagService) {

    @PostMapping("/hent-skriv")
    fun harSkrivetilgang(
        @RequestBody request: SkrivetilgangTilBrukerRequest
    ): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harSkrivetilgang(request.navIdent, request.norskIdent).map {
            HarTilgangResponse(it)
        }
    }

    @PostMapping("/hent-les")
    fun harLesetilgang(
        @RequestBody request: LesetilgangTilBrukerRequest
    ): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harLesetilgang(request.navIdent, request.norskIdent).map {
            HarTilgangResponse(it)
        }
    }

    data class HarTilgangResponse(val harTilgang: Boolean)
    data class SkrivetilgangTilBrukerRequest(val navIdent: NavIdent, val norskIdent: NorskIdent)
    data class LesetilgangTilBrukerRequest(val navIdent: NavIdent, val norskIdent: NorskIdent)
}