package no.nav.pto_admin.config

import no.nav.pto_admin.controller.v1.AuthController
import no.nav.pto_admin.controller.v1.IdentOppslagController
import no.nav.pto_admin.controller.v1.PingController
import no.nav.pto_admin.controller.v1.TilgangOppslagController
import no.nav.pto_admin.controller.v2.IdentOppslagV2Controller
import no.nav.pto_admin.controller.v2.TilgangOppslagV2Controller
import no.nav.pto_admin.service.AuthService
import no.nav.pto_admin.service.IdentOppslagService
import no.nav.pto_admin.service.TilgangOppslagService
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

@Configuration
@Import(value = [
    WebSecurityConfig::class,
    GatewayConfig::class,
    PingController::class,
    IdentOppslagController::class,
    IdentOppslagV2Controller::class,
    IdentOppslagService::class,
    TilgangOppslagController::class,
    TilgangOppslagV2Controller::class,
    TilgangOppslagService::class,
    AuthController::class,
	AuthService::class
])
class TestConfig
