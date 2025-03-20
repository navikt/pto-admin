package no.nav.pto_admin.controller.v2

import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.Fnr
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.config.SetupLocalEnvironment
import no.nav.pto_admin.service.IdentOppslagService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters

@ContextConfiguration(classes = [ApplicationTestConfig::class])
@WebFluxTest(
    controllers = [IdentOppslagV2Controller::class]
)
class IdentOppslagV2ControllerTest {

    init {
        SetupLocalEnvironment.setup()
    }

    val fnr = Fnr("123")
    val aktorId = AktorId("321")

    private val webClient: WebTestClient by lazy {
        WebTestClient.bindToController(
            IdentOppslagV2Controller(
                identOppslagService
            )
        ).build()
    }

    @MockitoBean
    private lateinit var identOppslagService: IdentOppslagService

    @Test
    fun fnrTilAktorId__returnerer_forventet_respons() {
        whenever(identOppslagService.fnrTilAktorId(fnr)).thenReturn(aktorId)

        loggedInWebClient()
            .post()
            .uri("/api/v2/ident/hent-aktorId")
            .body(BodyInserters.fromValue(IdentOppslagV2Controller.FnrTilAktorIdRequest(fnr)))
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"aktorId":"$aktorId"}""")
    }

    @Test
    fun aktorIdTilFnr__returnerer_forventet_respons() {
        whenever(identOppslagService.aktorIdTilFnr(aktorId)).thenReturn(fnr)

        loggedInWebClient()
            .post()
            .uri("/api/v2/ident/hent-fnr")
            .body(BodyInserters.fromValue(IdentOppslagV2Controller.AktorIdTilFnrRequest(aktorId)))
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"fnr":"$fnr"}""")
    }

    fun loggedInWebClient(): WebTestClient {
        return webClient
    }
}