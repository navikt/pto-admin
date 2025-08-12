package no.nav.pto_admin.controller.v2

import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.EksternBrukerId
import no.nav.common.types.identer.Fnr
import no.nav.pto_admin.pdl_pip.Ident
import no.nav.pto_admin.service.IdentOppslagService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v2/ident")
class IdentOppslagV2Controller(private val identOppslagService: IdentOppslagService) {

    @PostMapping("/hent-aktorId")
    fun fnrTilAktorId(@RequestBody request: FnrTilAktorIdRequest): AktorIdResponse {
        return AktorIdResponse(identOppslagService.fnrTilAktorId(request.fnr))
    }

    @PostMapping("/hent-fnr")
    fun aktorIdTilFnr(@RequestBody request: AktorIdTilFnrRequest): FnrResponse {
        return FnrResponse(identOppslagService.aktorIdTilFnr(request.aktorId))
    }

    @PostMapping("/hent-identer")
    fun aktorIdTilFnr(@RequestBody request: HentIdenterRequest): List<Ident> {
        return identOppslagService.hentAlleIdenter(request.eksternBrukerId)
    }

    data class AktorIdResponse(val aktorId: AktorId)

    data class FnrResponse(val fnr: Fnr)

    data class FnrTilAktorIdRequest(val fnr: Fnr)

    data class AktorIdTilFnrRequest(val aktorId: AktorId)

    data class HentIdenterRequest(val eksternBrukerId: EksternBrukerId)
}