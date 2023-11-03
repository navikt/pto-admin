package no.nav.pto_admin.controller.v1

import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.config.SetupLocalEnvironment
import no.nav.pto_admin.service.TilgangOppslagService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.Mono

@ContextConfiguration(classes = [ApplicationTestConfig::class])
@WebFluxTest(
    controllers = [TilgangOppslagController::class]
)
class TilgangOppslagControllerTest {

    init {
        SetupLocalEnvironment.setup()
    }

    @Autowired
    private lateinit var webClient: WebTestClient

    @MockBean
    private lateinit var tilgangOppslagService: TilgangOppslagService

    @Test
    fun harTilgangTilEnhet__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harTilgangTilEnhet(NavIdent("Z1234"), EnhetId("1234"))).thenReturn(
            Mono.just(
                false
            )
        )

        loggedInWebClient().get().uri("/api/tilgang/enhet?navIdent=Z1234&enhetId=1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":false}""")
    }

    @Test
    fun harTilgangTilEnhet__skal_returnere_har_tilgang_true() {
        whenever(
            tilgangOppslagService.harTilgangTilEnhet(
                NavIdent("Z1234"),
                EnhetId("1234")
            )
        ).thenReturn(Mono.just(true))

        loggedInWebClient().get().uri("/api/tilgang/enhet?navIdent=Z1234&enhetId=1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    @Test
    fun harSkrivetilgang__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harSkrivetilgang(NavIdent("Z1234"), NorskIdent("1234567"))).thenReturn(
            Mono.just(
                false
            )
        )

        loggedInWebClient().get().uri("/api/tilgang/skriv?navIdent=Z1234&norskIdent=1234567")
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

        loggedInWebClient().get().uri("/api/tilgang/skriv?navIdent=Z1234&norskIdent=1234567")
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

        loggedInWebClient().get().uri("/api/tilgang/les?navIdent=Z1234&norskIdent=1234567")
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

        loggedInWebClient().get().uri("/api/tilgang/les?navIdent=Z1234&norskIdent=1234567")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    @Test
    fun harTilgangTilKode6__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harTilgangTilKode6(NavIdent("Z1234"))).thenReturn(Mono.just(false))

        loggedInWebClient().get().uri("/api/tilgang/kode6?navIdent=Z1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":false}""")
    }

    @Test
    fun harTilgangTilKode6__skal_returnere_har_tilgang_true() {
        whenever(tilgangOppslagService.harTilgangTilKode6(NavIdent("Z1234"))).thenReturn(Mono.just(true))

        loggedInWebClient().get().uri("/api/tilgang/kode6?navIdent=Z1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    @Test
    fun harTilgangTilKode7__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harTilgangTilKode7(NavIdent("Z1234"))).thenReturn(Mono.just(false))

        loggedInWebClient().get().uri("/api/tilgang/kode7?navIdent=Z1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":false}""")
    }

    @Test
    fun harTilgangTilKode7__skal_returnere_har_tilgang_true() {
        whenever(tilgangOppslagService.harTilgangTilKode7(NavIdent("Z1234"))).thenReturn(Mono.just(true))

        loggedInWebClient().get().uri("/api/tilgang/kode7?navIdent=Z1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    @Test
    fun harTilgangTilSkjermetPerson__skal_returnere_har_tilgang_false() {
        whenever(tilgangOppslagService.harTilgangTilSkjermetPerson(NavIdent("Z1234"))).thenReturn(Mono.just(false))

        loggedInWebClient().get().uri("/api/tilgang/skjermet?navIdent=Z1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":false}""")
    }

    @Test
    fun harTilgangTilSkjermetPerson__skal_returnere_har_tilgang_true() {
        whenever(tilgangOppslagService.harTilgangTilSkjermetPerson(NavIdent("Z1234"))).thenReturn(Mono.just(true))

        loggedInWebClient().get().uri("/api/tilgang/skjermet?navIdent=Z1234")
            .exchange()
            .expectStatus().isOk
            .expectBody(String::class.java)
            .isEqualTo("""{"harTilgang":true}""")
    }

    fun loggedInWebClient(): WebTestClient {
        return webClient.mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
    }
}