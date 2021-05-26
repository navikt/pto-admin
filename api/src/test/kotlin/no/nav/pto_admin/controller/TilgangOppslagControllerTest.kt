package no.nav.pto_admin.controller

import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.service.TilgangOppslagService
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.kotlin.any
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@ContextConfiguration(classes = [ApplicationTestConfig::class])
@WebMvcTest(
    controllers = [TilgangOppslagController::class],
    excludeAutoConfiguration = [OAuth2ClientAutoConfiguration::class]
)
class TilgangOppslagControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var tilgangOppslagService: TilgangOppslagService

    @Test
    fun harTilgangTilEnhet__skal_sjekke_tilgang_med_parameter() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/enhet")
                .queryParam("navIdent", "Z1234")
                .queryParam("enhetId", "1234")
        )

        verify(tilgangOppslagService, times(1))
            .harTilgangTilEnhet(NavIdent.of("Z1234"), EnhetId.of("1234"))
    }

    @Test
    fun harTilgangTilEnhet__skal_returnere_har_tilgang() {
        whenever(tilgangOppslagService.harTilgangTilEnhet(any(), any()))
            .thenReturn(true)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/enhet")
                .queryParam("navIdent", "Z1234")
                .queryParam("enhetId", "1234")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"harTilgang\": true  }"))
    }

    @Test
    fun harSkrivetilgang__skal_sjekke_tilgang_med_parameter() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/skriv")
                .queryParam("navIdent", "Z1234")
                .queryParam("norskIdent", "1234567")
        )

        verify(tilgangOppslagService, times(1))
            .harSkrivetilgang(NavIdent.of("Z1234"), NorskIdent.of("1234567"))
    }

    @Test
    fun harSkrivetilgang__skal_returnere_har_tilgang() {
        whenever(tilgangOppslagService.harSkrivetilgang(any(), any()))
            .thenReturn(true)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/skriv")
                .queryParam("navIdent", "Z1234")
                .queryParam("norskIdent", "1234567")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"harTilgang\": true  }"))
    }

    @Test
    fun harLesetilgang__skal_sjekke_tilgang_med_parameter() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/les")
                .queryParam("navIdent", "Z1234")
                .queryParam("norskIdent", "1234567")
        )

        verify(tilgangOppslagService, times(1))
            .harLesetilgang(NavIdent.of("Z1234"), NorskIdent.of("1234567"))
    }

    @Test
    fun harLesetilgang__skal_returnere_har_tilgang() {
        whenever(tilgangOppslagService.harLesetilgang(any(), any()))
            .thenReturn(true)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/les")
                .queryParam("navIdent", "Z1234")
                .queryParam("norskIdent", "1234567")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"harTilgang\": true  }"))
    }

    @Test
    fun harTilgangTilKode6__skal_sjekke_tilgang_med_parameter() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/kode6")
                .queryParam("navIdent", "Z1234")
        )

        verify(tilgangOppslagService, times(1))
            .harTilgangTilKode6(NavIdent.of("Z1234"))
    }

    @Test
    fun harTilgangTilKode6__skal_returnere_har_tilgang() {
        whenever(tilgangOppslagService.harTilgangTilKode6(any())).thenReturn(true)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/kode6")
                .queryParam("navIdent", "Z1234")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"harTilgang\": true  }"))
    }

    @Test
    fun harTilgangTilKode7__skal_sjekke_tilgang_med_parameter() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/kode7")
                .queryParam("navIdent", "Z1234")
        )

        verify(tilgangOppslagService, times(1))
            .harTilgangTilKode7(NavIdent.of("Z1234"))
    }

    @Test
    fun harTilgangTilKode7__skal_returnere_har_tilgang() {
        whenever(tilgangOppslagService.harTilgangTilKode7(any())).thenReturn(true)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/kode7")
                .queryParam("navIdent", "Z1234")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"harTilgang\": true  }"))
    }

    @Test
    fun harTilgangTilSkjermetPerson__skal_sjekke_tilgang_med_parameter() {
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/skjermet")
                .queryParam("navIdent", "Z1234")
        )

        verify(tilgangOppslagService, times(1))
            .harTilgangTilSkjermetPerson(NavIdent.of("Z1234"))
    }

    @Test
    fun harTilgangTilSkjermetPerson__skal_returnere_har_tilgang() {
        whenever(tilgangOppslagService.harTilgangTilSkjermetPerson(any())).thenReturn(true)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/tilgang/skjermet")
                .queryParam("navIdent", "Z1234")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"harTilgang\": true  }"))
    }
}