package no.nav.pto_admin

import no.nav.pto_admin.config.ApplicationTestConfig
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.Import

@EnableAutoConfiguration
@Import(ApplicationTestConfig::class)
class LocalApplication

fun main(args: Array<String>) {
    val application = SpringApplication(LocalApplication::class.java)
    application.setAdditionalProfiles("local")
    application.run(*args)
}
