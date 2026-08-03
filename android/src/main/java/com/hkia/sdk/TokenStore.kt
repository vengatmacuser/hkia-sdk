package com.hkia.sdk

/**
 * Thread-safe memory store holding scanned passport state and semi-token session state.
 */
object TokenStore {
    @Volatile var passengerName: String? = null
    @Volatile var bcbp: String? = null
    @Volatile var enrollmentToken: String? = null
    @Volatile var isEnrolled: Boolean = false

    @Volatile var bcbpFieldsSurname: String? = null
    @Volatile var bcbpFieldsGivenName: String? = null

    fun reset() {
        passengerName = null
        bcbp = null
        enrollmentToken = null
        isEnrolled = false
        bcbpFieldsSurname = null
        bcbpFieldsGivenName = null
    }
}
