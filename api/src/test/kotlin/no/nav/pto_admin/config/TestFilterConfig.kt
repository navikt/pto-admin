package no.nav.pto_admin.config

import no.nav.common.auth.context.UserRole
import no.nav.common.log.LogFilter
import no.nav.common.rest.filter.SetStandardHttpHeadersFilter
import no.nav.common.test.auth.TestAuthContextFilter
import no.nav.pto_admin.config.ApplicationConfig.Companion.APPLICATION_NAME
import no.nav.pto_admin.config.ApplicationTestConfig.Companion.INNLOGGET_VEILEDER
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TestFilterConfig {

    @Bean
    fun logFilterRegistrationBean(): FilterRegistrationBean<LogFilter> {
        val registration = FilterRegistrationBean<LogFilter>()
        registration.filter = LogFilter(APPLICATION_NAME, true)
        registration.order = 1
        registration.addUrlPatterns("/*")
        return registration
    }

    @Bean
    fun testAuthContextFilterRegistrationBean(): FilterRegistrationBean<TestAuthContextFilter> {
        val registration: FilterRegistrationBean<TestAuthContextFilter> = FilterRegistrationBean<TestAuthContextFilter>()
        registration.filter = TestAuthContextFilter(UserRole.INTERN, INNLOGGET_VEILEDER)
        registration.order = 2
        registration.addUrlPatterns("/api/*")
        return registration
    }

    @Bean
    fun setStandardHeadersFilterRegistrationBean(): FilterRegistrationBean<SetStandardHttpHeadersFilter> {
        val registration = FilterRegistrationBean<SetStandardHttpHeadersFilter>()
        registration.filter = SetStandardHttpHeadersFilter()
        registration.order = 3
        registration.addUrlPatterns("/*")
        return registration
    }


}