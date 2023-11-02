package no.nav.pto_admin.controller.v1

import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.service.TilgangOppslagService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/tilgang")
class TilgangOppslagController(private val tilgangOppslagService: TilgangOppslagService) {

    @GetMapping("/enhet")
    fun harTilgangTilEnhet(@RequestParam navIdent: NavIdent, @RequestParam enhetId: EnhetId): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harTilgangTilEnhet(navIdent, enhetId).map {
            HarTilgangResponse(it)
        }
    }

    @GetMapping("/skriv")
    fun harSkrivetilgang(
        @RequestParam navIdent: NavIdent,
        @RequestParam norskIdent: NorskIdent
    ): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harSkrivetilgang(navIdent, norskIdent).map {
            HarTilgangResponse(it)
        }
    }

    @GetMapping("/les")
    fun harLesetilgang(
        @RequestParam navIdent: NavIdent,
        @RequestParam norskIdent: NorskIdent
    ): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harLesetilgang(navIdent, norskIdent).map {
            HarTilgangResponse(it)
        }
    }

    @GetMapping("/kode6")
    fun harTilgangTilKode6(@RequestParam navIdent: NavIdent): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harTilgangTilKode6(navIdent).map {
            HarTilgangResponse(it)
        }
    }

    @GetMapping("/kode7")
    fun harTilgangTilKode7(@RequestParam navIdent: NavIdent): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harTilgangTilKode7(navIdent).map {
            HarTilgangResponse(it)
        }
    }

    @GetMapping("/skjermet")
    fun harTilgangTilSkjermetPerson(@RequestParam navIdent: NavIdent): Mono<HarTilgangResponse> {
        return tilgangOppslagService.harTilgangTilSkjermetPerson(navIdent).map {
            HarTilgangResponse(it)
        }
    }

    data class HarTilgangResponse(val harTilgang: Boolean)

}