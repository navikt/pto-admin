package no.nav.pto_admin.controller.v1

import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.Fnr
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.config.SetupLocalEnvironment
import no.nav.pto_admin.service.IdentOppslagService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.reactive.server.WebTestClient

@ContextConfiguration(classes = [ApplicationTestConfig::class])
@WebFluxTest(
    controllers = [IdentOppslagController::class]
)
class IdentOppslagControllerTest {

    init {
        SetupLocalEnvironment.setup()
    }

    val fnr = Fnr("123")
    val aktorId = AktorId("321")

    @Autowired
    private lateinit var webClient: WebTestClient

    @MockBean
    private lateinit var identOppslagService: IdentOppslagService

    @Test
    fun fnrTilAktorId__returnerer_forventet_respons() {
        whenever(identOppslagService.fnrTilAktorId(fnr)).thenReturn(aktorId)

        loggedInWebClient().get().uri("/api/ident/aktorId?fnr=$fnr")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"aktorId":"$aktorId"}""")
    }

    @Test
    fun aktorIdTilFnr__returnerer_forventet_respons() {
        whenever(identOppslagService.aktorIdTilFnr(aktorId)).thenReturn(fnr)

        loggedInWebClient().get().uri("/api/ident/fnr?aktorId=$aktorId")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"fnr":"$fnr"}""")
    }

    fun loggedInWebClient(): WebTestClient {
        return webClient.mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
    }
}