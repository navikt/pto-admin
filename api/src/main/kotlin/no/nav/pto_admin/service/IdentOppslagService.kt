package no.nav.pto_admin.service

import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.Fnr
import no.nav.pto_admin.pdl_pip.IdentGruppe
import no.nav.pto_admin.pdl_pip.PdlPipClient
import org.springframework.stereotype.Service

@Service
class IdentOppslagService(
    val pdlPipClient: PdlPipClient
) {

    fun aktorIdTilFnr(aktorId: AktorId): Fnr {
        return pdlPipClient.hentBrukerInfo(aktorId.get())
            .identer.identer.first { it.historisk == false && it.gruppe == IdentGruppe.FOLKEREGISTERIDENT }
            .let { Fnr.of(it.ident) } ?: throw RuntimeException("Fant ikke fnr for aktorId")
    }

    fun fnrTilAktorId(fnr: Fnr): AktorId {
        return pdlPipClient.hentBrukerInfo(fnr.get())
            .identer.identer.first { it.historisk == false && it.gruppe == IdentGruppe.AKTORID }
            .let { AktorId.of(it.ident) } ?: throw RuntimeException("Fant ikke fnr for aktorId")
    }

}