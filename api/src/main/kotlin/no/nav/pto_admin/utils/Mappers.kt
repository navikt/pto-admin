package no.nav.pto_admin.utils

import no.nav.pto_admin.controller.KafkaAdminController
import no.nav.pto_admin.domain.KafkaRecord
import no.nav.pto_admin.domain.KafkaRecordHeader
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.header.Header

object Mappers {

    fun toTopicWithOffset(topicPartition: TopicPartition, offsetAndMetadata: OffsetAndMetadata): KafkaAdminController.TopicWithOffset {
        return KafkaAdminController.TopicWithOffset(
            topicName = topicPartition.topic(),
            topicPartition = topicPartition.partition(),
            offset = offsetAndMetadata.offset()
        )
    }

    fun toKafkaRecordHeader(consumerRecord: ConsumerRecord<ByteArray, ByteArray>): KafkaRecord {
        return KafkaRecord(
            key = String(consumerRecord.key()),
            value = String(consumerRecord.value()),
            timestamp = consumerRecord.timestamp(),
            headers = consumerRecord.headers().map { toRecordHeader(it) },
            offset = consumerRecord.offset()
        )
    }

    private fun toRecordHeader(header: Header): KafkaRecordHeader {
        return KafkaRecordHeader(
            name = header.key(),
            value = String(header.value())
        )
    }

}