package no.nav.pto_admin.controller;

import no.nav.pto_admin.service.AuthService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {AuthController.class})
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    public void me_skal_returner_innlogget_bruker() throws Exception {
        when(authService.hentInnloggetBrukerIdent()).thenReturn(Optional.of("IDENT"));
        when(authService.harTilgangTilPtoAdmin()).thenReturn(true);

        mockMvc.perform(
                get("/api/auth/me")
        ).andExpect(content().json(" { \"ident\": \"IDENT\", \"harTilgang\": true } "));
    }

}
