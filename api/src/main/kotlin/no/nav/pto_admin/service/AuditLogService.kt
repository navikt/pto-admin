package no.nav.pto_admin.service

import no.nav.common.audit_log.cef.CefMessage
import no.nav.common.audit_log.cef.CefMessageEvent
import no.nav.common.audit_log.cef.CefMessageSeverity
import no.nav.common.audit_log.log.AuditLogger
import no.nav.common.audit_log.log.AuditLoggerImpl
import org.springframework.stereotype.Service

@Service
class AuditLogService {
    private val auditLogger: AuditLogger = AuditLoggerImpl()
    fun auditLogWithMessageAndDestinationUserId(
        logMessage: String?,
        destinationUserId: String?,
        innloggetBrukerToken: String?
    ) {
        auditLogger.log(
            CefMessage.builder()
                .timeEnded(System.currentTimeMillis())
                .applicationName("veilarbveileder")
                .sourceUserId(innloggetBrukerToken)
                .event(CefMessageEvent.ACCESS)
                .severity(CefMessageSeverity.INFO)
                .name("veilarbveileder-audit-log")
                .destinationUserId(destinationUserId)
                .extension("msg", logMessage)
                .build()
        )
    }
}