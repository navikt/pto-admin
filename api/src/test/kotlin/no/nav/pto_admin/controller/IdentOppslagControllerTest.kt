package no.nav.pto_admin.controller

import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.Fnr
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.service.IdentOppslagService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@ContextConfiguration(classes = [ApplicationTestConfig::class])
@WebMvcTest(
    controllers = [IdentOppslagController::class],
    excludeAutoConfiguration = [OAuth2ClientAutoConfiguration::class]
)
class IdentOppslagControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var identOppslagService: IdentOppslagService

    @Test
    fun fnrTilAktorId__skal_sjekke_tilgang_med_parameter() {
        whenever(identOppslagService.fnrTilAktorId(any())).thenReturn(AktorId.of(""))

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/ident/aktorId")
                .queryParam("fnr", "1234567")
        )

        verify(identOppslagService, times(1))
            .fnrTilAktorId(Fnr.of("1234567"))
    }

    @Test
    fun fnrTilAktorId__skal_returnere_har_tilgang() {
        whenever(identOppslagService.fnrTilAktorId(Fnr.of("1234567"))).thenReturn(AktorId.of("7654321"))

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/ident/aktorId")
                .queryParam("fnr", "1234567")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"aktorId\": \"7654321\"  }"))
    }

    @Test
    fun aktorIdTilFnr__skal_sjekke_tilgang_med_parameter() {
        whenever(identOppslagService.aktorIdTilFnr(any())).thenReturn(Fnr.of(""))

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/ident/fnr")
                .queryParam("aktorId", "7654321")
        )

        verify(identOppslagService, times(1))
            .aktorIdTilFnr(AktorId.of("7654321"))
    }

    @Test
    fun aktorIdTilFnr__skal_returnere_har_tilgang() {
        whenever(identOppslagService.aktorIdTilFnr(AktorId.of("7654321"))).thenReturn(Fnr.of("1234567"))

        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/ident/fnr")
                .queryParam("aktorId", "7654321")
        ).andExpect(MockMvcResultMatchers.content().json("{ \"fnr\": \"1234567\"  }"))
    }
}
