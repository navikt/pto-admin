package no.nav.pto_admin.service;

import no.nav.common.auth.context.AuthContextHolder;
import no.nav.common.types.identer.NavIdent;
import no.nav.pto_admin.utils.AllowedUsers;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    @Test
    public void sjekkTilgangTilPtoAdmin__skal_ikke_kaste_exception_hvis_bruker_har_tilgang() {
        AuthContextHolder authContextHolder = mock(AuthContextHolder.class);
        when(authContextHolder.getNavIdent()).thenReturn(Optional.of(NavIdent.of("BRUKER_1")));

        AllowedUsers allowedUsers = new AllowedUsers(List.of("BRUKER_1"));

        AuthService authService = new AuthService(allowedUsers, authContextHolder);

        authService.sjekkTilgangTilPtoAdmin();
    }

    @Test
    public void sjekkTilgangTilPtoAdmin__skal_kaste_exception_hvis_bruker_ikke_har_tilgang() {
        AuthContextHolder authContextHolder = mock(AuthContextHolder.class);
        when(authContextHolder.getNavIdent()).thenReturn(Optional.of(NavIdent.of("BRUKER_1")));

        AllowedUsers allowedUsers = new AllowedUsers(List.of("BRUKER_2"));

        AuthService authService = new AuthService(allowedUsers, authContextHolder);

       try {
           authService.sjekkTilgangTilPtoAdmin();
       } catch (ResponseStatusException e) {
           assertEquals(HttpStatus.FORBIDDEN, e.getStatus());
       }
    }

}
