package no.nav.pto_admin.service

import no.nav.common.abac.Pep
import no.nav.common.abac.domain.request.ActionId
import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.Fnr
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import org.springframework.stereotype.Service

@Service
class TilgangOppslagService(val veilarbPep: Pep) {

    fun harTilgangTilEnhet(navIdent: NavIdent, enhetId: EnhetId): Boolean {
        return veilarbPep.harVeilederTilgangTilEnhet(navIdent, enhetId)
    }

    fun harLesetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Boolean {
        return veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.READ, Fnr.of(norskIdent.get()))
    }

    fun harSkrivetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Boolean {
        return veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.WRITE, Fnr.of(norskIdent.get()))
    }

    fun harTilgangTilKode6(navIdent: NavIdent): Boolean {
        return veilarbPep.harVeilederTilgangTilKode6(navIdent)
    }

    fun harTilgangTilKode7(navIdent: NavIdent): Boolean {
        return veilarbPep.harVeilederTilgangTilKode7(navIdent)
    }

    fun harTilgangTilSkjermetPerson(navIdent: NavIdent): Boolean {
        return veilarbPep.harVeilederTilgangTilEgenAnsatt(navIdent)
    }

}