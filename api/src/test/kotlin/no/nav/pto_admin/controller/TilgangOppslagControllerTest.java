package no.nav.pto_admin.controller;

import no.nav.common.types.identer.EnhetId;
import no.nav.common.types.identer.NavIdent;
import no.nav.common.types.identer.NorskIdent;
import no.nav.pto_admin.service.AuthService;
import no.nav.pto_admin.service.TilgangOppslagService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {TilgangOppslagController.class})
public class TilgangOppslagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private TilgangOppslagService tilgangOppslagService;

    @Test
    public void harTilgangTilEnhet__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/enhet")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("enhetId", "1234")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void harTilgangTilEnhet__skal_sjekke_tilgang_med_parameter() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/enhet")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("enhetId", "1234")
        );

        verify(tilgangOppslagService, times(1))
                .harTilgangTilEnhet(NavIdent.of("Z1234"), EnhetId.of("1234"));
    }

    @Test
    public void harTilgangTilEnhet__skal_returnere_har_tilgang() throws Exception {
        when(tilgangOppslagService.harTilgangTilEnhet(any(), any())).thenReturn(true);

        mockMvc.perform(
                get("/api/tilgang/enhet")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("enhetId", "1234")
        ).andExpect(content().json("{ \"harTilgang\": true  }"));
    }

    // =========================

    @Test
    public void harSkrivetilgang__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/skriv")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("norskIdent", "1234567")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void harSkrivetilgang__skal_sjekke_tilgang_med_parameter() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/skriv")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("norskIdent", "1234567")
        );

        verify(tilgangOppslagService, times(1))
                .harSkrivetilgang(NavIdent.of("Z1234"), NorskIdent.of("1234567"));
    }

    @Test
    public void harSkrivetilgang__skal_returnere_har_tilgang() throws Exception {
        when(tilgangOppslagService.harSkrivetilgang(any(), any())).thenReturn(true);

        mockMvc.perform(
                get("/api/tilgang/skriv")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("norskIdent", "1234567")
        ).andExpect(content().json("{ \"harTilgang\": true  }"));
    }

    // =========================

    @Test
    public void harLesetilgang__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/les")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("norskIdent", "1234567")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void harLesetilgang__skal_sjekke_tilgang_med_parameter() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/les")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("norskIdent", "1234567")
        );

        verify(tilgangOppslagService, times(1))
                .harLesetilgang(NavIdent.of("Z1234"), NorskIdent.of("1234567"));
    }

    @Test
    public void harLesetilgang__skal_returnere_har_tilgang() throws Exception {
        when(tilgangOppslagService.harLesetilgang(any(), any())).thenReturn(true);

        mockMvc.perform(
                get("/api/tilgang/les")
                        .queryParam("navIdent", "Z1234")
                        .queryParam("norskIdent", "1234567")
        ).andExpect(content().json("{ \"harTilgang\": true  }"));
    }

    // =========================

    @Test
    public void harTilgangTilKode6__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/kode6")
                        .queryParam("navIdent", "Z1234")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void harTilgangTilKode6__skal_sjekke_tilgang_med_parameter() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/kode6")
                        .queryParam("navIdent", "Z1234")
        );

        verify(tilgangOppslagService, times(1))
                .harTilgangTilKode6(NavIdent.of("Z1234"));
    }

    @Test
    public void harTilgangTilKode6__skal_returnere_har_tilgang() throws Exception {
        when(tilgangOppslagService.harTilgangTilKode6(any())).thenReturn(true);

        mockMvc.perform(
                get("/api/tilgang/kode6")
                        .queryParam("navIdent", "Z1234")
        ).andExpect(content().json("{ \"harTilgang\": true  }"));
    }

    // =========================

    @Test
    public void harTilgangTilKode7__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/kode7")
                        .queryParam("navIdent", "Z1234")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void harTilgangTilKode7__skal_sjekke_tilgang_med_parameter() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/kode7")
                        .queryParam("navIdent", "Z1234")
        );

        verify(tilgangOppslagService, times(1))
                .harTilgangTilKode7(NavIdent.of("Z1234"));
    }

    @Test
    public void harTilgangTilKode7__skal_returnere_har_tilgang() throws Exception {
        when(tilgangOppslagService.harTilgangTilKode7(any())).thenReturn(true);

        mockMvc.perform(
                get("/api/tilgang/kode7")
                        .queryParam("navIdent", "Z1234")
        ).andExpect(content().json("{ \"harTilgang\": true  }"));
    }

    // =========================

    @Test
    public void harTilgangTilSkjermetPerson__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/skjermet")
                        .queryParam("navIdent", "Z1234")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void harTilgangTilSkjermetPerson__skal_sjekke_tilgang_med_parameter() throws Exception {
        mockMvc.perform(
                get("/api/tilgang/skjermet")
                        .queryParam("navIdent", "Z1234")
        );

        verify(tilgangOppslagService, times(1))
                .harTilgangTilSkjermetPerson(NavIdent.of("Z1234"));
    }

    @Test
    public void harTilgangTilSkjermetPerson__skal_returnere_har_tilgang() throws Exception {
        when(tilgangOppslagService.harTilgangTilSkjermetPerson(any())).thenReturn(true);

        mockMvc.perform(
                get("/api/tilgang/skjermet")
                        .queryParam("navIdent", "Z1234")
        ).andExpect(content().json("{ \"harTilgang\": true  }"));
    }

}