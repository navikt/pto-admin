package no.nav.pto_admin.config

import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class FilterTestConfig {
    @Bean
    fun testSubjectFilterRegistrationBean(): FilterRegistrationBean<TestAuthContextFilter?> {
        val registration: FilterRegistrationBean<TestAuthContextFilter?> =
            FilterRegistrationBean<TestAuthContextFilter?>()
        registration.setFilter(TestAuthContextFilter())
        registration.setOrder(1)
        registration.addUrlPatterns("/api/*")
        return registration
    }
}