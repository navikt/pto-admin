package no.nav.pto_admin.proxy

import com.netflix.zuul.ZuulFilter
import com.netflix.zuul.context.RequestContext
import no.nav.common.log.LogFilter
import no.nav.common.log.MDCConstants
import no.nav.common.rest.client.RestUtils
import no.nav.common.sts.SystemUserTokenProvider
import no.nav.common.utils.StringUtils
import no.nav.pto_admin.service.AuthService
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants
import org.springframework.http.HttpHeaders

class PreRequestZuulFilter(
    private val authService: AuthService,
    private val systemUserTokenProvider: SystemUserTokenProvider
) : ZuulFilter() {

    val log = LoggerFactory.getLogger(PreRequestZuulFilter::class.java)

    override fun filterType(): String {
        return FilterConstants.PRE_TYPE
    }

    override fun filterOrder(): Int {
        return 1
    }

    override fun shouldFilter(): Boolean {
        return true
    }

    override fun run(): Any? {
        val ctx = RequestContext.getCurrentContext()
        if (!authService.harTilgangTilPtoAdmin()) {
            ctx.responseStatusCode = 403
            if (ctx.responseBody == null) {
                ctx.setSendZuulResponse(false)
            }
            return null
        }

        log.info("Proxying request", ctx.request.requestURI)

        ctx.addZuulRequestHeader(
            HttpHeaders.AUTHORIZATION, RestUtils.createBearerToken(
                systemUserTokenProvider.systemUserToken
            )
        )

        StringUtils.of(MDC.get(MDCConstants.MDC_CALL_ID))
            .ifPresent { callId: String? ->
                ctx.addZuulRequestHeader(
                    LogFilter.PREFERRED_NAV_CALL_ID_HEADER_NAME,
                    callId
                )
            }

        return null
    }
}