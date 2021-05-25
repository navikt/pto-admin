package no.nav.pto_admin.controller

import no.nav.pto_admin.domain.KafkaRecord
import no.nav.pto_admin.service.AuthService
import no.nav.pto_admin.service.KafkaAdminService
import no.nav.pto_admin.utils.Mappers.toTopicWithOffset
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/kafka-admin")
class KafkaAdminController(
    val kafkaAdminService: KafkaAdminService,
    val authService: AuthService
) {

    @PostMapping("/read-topic")
    fun readTopic(@RequestBody request: ReadTopicRequest): List<KafkaRecord> {
        authService.sjekkTilgangTilPtoAdmin()
        validateReadTopicRequestDTO(request)
        return kafkaAdminService.readTopic(request)
    }

    @PostMapping("/get-consumer-offsets")
    fun getOffsets(@RequestBody request: GetConsumerOffsetsRequest): List<TopicWithOffset> {
        authService.sjekkTilgangTilPtoAdmin()

        return kafkaAdminService.getConsumerOffsets(request).entries.map {
            toTopicWithOffset(it.key, it.value)
        }
    }

    @PostMapping("/get-last-record-offset")
    fun getLastRecordOffset(@RequestBody request: GetLastRecordOffsetRequest): GetLastRecordOffsetResponse {
        authService.sjekkTilgangTilPtoAdmin()

        return GetLastRecordOffsetResponse(
            latestRecordOffset = kafkaAdminService.getLastRecordOffset(request)
        )
    }

    @PostMapping("/set-consumer-offset")
    fun setConsumerOffset(@RequestBody request: SetConsumerOffsetRequest) {
        authService.sjekkTilgangTilPtoAdmin()
        kafkaAdminService.setConsumerOffset(request)
    }

    private fun validateReadTopicRequestDTO(readTopicRequest: ReadTopicRequest) {
        if (readTopicRequest.maxRecords < 0 || readTopicRequest.maxRecords > 100) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "maxRecords must be between 0 and 100")
        }
    }

    data class Credentials(val username: String, val password: String)

    data class ReadTopicRequest(
        val credentials: Credentials,
        val topicName: String,
        val topicPartition: Int,
        val maxRecords: Int,
        val fromOffset: Long,
    )

    data class GetLastRecordOffsetRequest(
        val credentials: Credentials,
        val topicName: String,
        val topicPartition: Int
    )

    data class GetLastRecordOffsetResponse(
        val latestRecordOffset: Long
    )

    data class GetConsumerOffsetsRequest(
        val credentials: Credentials,
        val groupId: String,
        val topicName: String
    )

    data class SetConsumerOffsetRequest(
        val credentials: Credentials,
        val groupId: String,
        val topicName: String,
        val topicPartition: Int,
        val offset: Long
    )

    data class TopicWithOffset(
        val topicName: String,
        val topicPartition: Int,
        val offset: Long
    )

}