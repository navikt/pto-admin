package no.nav.pto_admin.controller;

import no.nav.common.types.identer.AktorId;
import no.nav.common.types.identer.Fnr;
import no.nav.pto_admin.service.AuthService;
import no.nav.pto_admin.service.IdentOppslagService;
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
@WebMvcTest(controllers = {IdentOppslagController.class})
public class IdentOppslagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private IdentOppslagService identOppslagService;

    @Test
    public void fnrTilAktorId__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        when(identOppslagService.fnrTilAktorId(any())).thenReturn(AktorId.of(""));

        mockMvc.perform(
                get("/api/ident/aktorId")
                        .queryParam("fnr", "1234567")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void fnrTilAktorId__skal_sjekke_tilgang_med_parameter() throws Exception {
        when(identOppslagService.fnrTilAktorId(any())).thenReturn(AktorId.of(""));

        mockMvc.perform(
                get("/api/ident/aktorId")
                        .queryParam("fnr", "1234567")
        );

        verify(identOppslagService, times(1))
                .fnrTilAktorId(Fnr.of("1234567"));
    }

    @Test
    public void fnrTilAktorId__skal_returnere_har_tilgang() throws Exception {
        when(identOppslagService.fnrTilAktorId(Fnr.of("1234567"))).thenReturn(AktorId.of("7654321"));

        mockMvc.perform(
                get("/api/ident/aktorId")
                        .queryParam("fnr", "1234567")
        ).andExpect(content().json("{ \"aktorId\": \"7654321\"  }"));
    }

    // =========================

    @Test
    public void aktorIdTilFnr__skal_sjekke_tilgang_til_pto_admin() throws Exception {
        when(identOppslagService.aktorIdTilFnr(any())).thenReturn(Fnr.of(""));

        mockMvc.perform(
                get("/api/ident/fnr")
                        .queryParam("aktorId", "7654321")
        );

        verify(authService, times(1)).sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void aktorIdTilFnr__skal_sjekke_tilgang_med_parameter() throws Exception {
        when(identOppslagService.aktorIdTilFnr(any())).thenReturn(Fnr.of(""));

        mockMvc.perform(
                get("/api/ident/fnr")
                        .queryParam("aktorId", "7654321")
        );

        verify(identOppslagService, times(1))
                .aktorIdTilFnr(AktorId.of("7654321"));
    }

    @Test
    public void aktorIdTilFnr__skal_returnere_har_tilgang() throws Exception {
        when(identOppslagService.aktorIdTilFnr(AktorId.of("7654321"))).thenReturn(Fnr.of("1234567"));

        mockMvc.perform(
                get("/api/ident/fnr")
                        .queryParam("aktorId", "7654321")
        ).andExpect(content().json("{ \"fnr\": \"1234567\"  }"));
    }

}
