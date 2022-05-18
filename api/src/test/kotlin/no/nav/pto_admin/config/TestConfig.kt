package no.nav.pto_admin.config

import no.nav.pto_admin.controller.AuthController
import no.nav.pto_admin.controller.IdentOppslagController
import no.nav.pto_admin.controller.PingController
import no.nav.pto_admin.controller.TilgangOppslagController
import no.nav.pto_admin.service.AuthService
import no.nav.pto_admin.service.IdentOppslagService
import no.nav.pto_admin.service.TilgangOppslagService
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

@Configuration
@Import(value = [
    WebSecurityConfig::class,
    GatewayConfig::class,
    ClientHttpConnectorConfig::class,
    PingController::class,
    IdentOppslagController::class,
    IdentOppslagService::class,
    TilgangOppslagController::class,
    TilgangOppslagService::class,
    AuthController::class,
    AuthService::class
])
class TestConfig
