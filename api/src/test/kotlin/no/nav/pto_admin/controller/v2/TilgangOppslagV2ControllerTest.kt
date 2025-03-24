package no.nav.pto_admin.controller.v2

import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.service.TilgangOppslagService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

@ContextConfiguration(classes = [ApplicationTestConfig::class])
@WebFluxTest(
    controllers = [TilgangOppslagV2Controller::class]
)
class TilgangOppslagV2ControllerTest {

    @MockitoBean
    private lateinit var tilgangOppslagService: TilgangOppslagService

    private val webClient: WebTestClient by lazy {
        WebTestClient.bindToController(
            TilgangOppslagV2Controller(
                tilgangOppslagService
            )
        ).build()
    }

    @Test
    fun harSkrivetilgang__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harSkrivetilgang(NavIdent("Z1234"), NorskIdent("1234567"))).thenReturn(
            Mono.just(
                false
            )
        )

        loggedInWebClient()
            .post()
            .uri("/api/v2/tilgang/hent-skriv")
            .body(
                BodyInserters.fromValue(
                    TilgangOppslagV2Controller.SkrivetilgangTilBrukerRequest(
                        NavIdent.of("Z1234"),
                        NorskIdent.of("1234567")
                    )
                )
            )
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":false}""")
    }

    @Test
    fun harSkrivetilgang__skal_returnere_har_tilgang_true() {
        whenever(tilgangOppslagService.harSkrivetilgang(NavIdent("Z1234"), NorskIdent("1234567"))).thenReturn(
            Mono.just(
                true
            )
        )

        loggedInWebClient()
            .post()
            .uri("/api/v2/tilgang/hent-skriv")
            .body(
                BodyInserters.fromValue(
                    TilgangOppslagV2Controller.SkrivetilgangTilBrukerRequest(
                        NavIdent.of("Z1234"),
                        NorskIdent.of("1234567")
                    )
                )
            )
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    @Test
    fun harLesetilgang__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harLesetilgang(NavIdent("Z1234"), NorskIdent("1234567"))).thenReturn(
            Mono.just(
                false
            )
        )

        loggedInWebClient()
            .post()
            .uri("/api/v2/tilgang/hent-les")
            .body(
                BodyInserters.fromValue(
                    TilgangOppslagV2Controller.SkrivetilgangTilBrukerRequest(
                        NavIdent.of("Z1234"),
                        NorskIdent.of("1234567")
                    )
                )
            )
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":false}""")
    }

    @Test
    fun harLesetilgang__skal_returnere_har_tilgang_true() {
        whenever(tilgangOppslagService.harLesetilgang(NavIdent("Z1234"), NorskIdent("1234567"))).thenReturn(
            Mono.just(
                true
            )
        )

        loggedInWebClient()
            .post()
            .uri("/api/v2/tilgang/hent-les")
            .body(
                BodyInserters.fromValue(
                    TilgangOppslagV2Controller.SkrivetilgangTilBrukerRequest(
                        NavIdent.of("Z1234"),
                        NorskIdent.of("1234567")
                    )
                )
            )
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    fun loggedInWebClient(): WebTestClient {
        return webClient
    }
}