package com.hkia.sdk

/**
 * Stores Check-In API credentials configured dynamically at runtime from JavaScript.
 */
object CheckInConfig {
    var appId: String = ""
        private set
    var apiKey: String = ""
        private set

    fun initialize(appId: String, apiKey: String) {
        this.appId = appId
        this.apiKey = apiKey
    }

    fun isConfigured(): Boolean = appId.isNotEmpty() && apiKey.isNotEmpty()
}
