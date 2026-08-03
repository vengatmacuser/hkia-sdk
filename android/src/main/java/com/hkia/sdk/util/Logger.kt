package com.hkia.sdk.util

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/**
 * High-Precision Structured Logger & Native Telemetry Event Emitter.
 *
 * Produces standardized ISO-8601 UTC millisecond timestamps (`yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`)
 * and emits real-time log entries and telemetry actions over the React Native bridge.
 */
object Logger {
    private const val MAX_LOGS = 500
    private val logs = mutableListOf<LogEntry>()
    private var reactContext: ReactApplicationContext? = null

    data class LogEntry(
        val timestamp: String,
        val epochMs: Long,
        val level: String,
        val tag: String,
        val step: String,
        val message: String
    )

    fun setReactContext(context: ReactApplicationContext) {
        reactContext = context
    }

    private fun getCurrentIsoTimestamp(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        return sdf.format(Date())
    }

    fun log(level: String, tag: String, step: String, message: String) {
        val now = System.currentTimeMillis()
        val timestamp = getCurrentIsoTimestamp()
        val entry = LogEntry(timestamp, now, level, tag, step, message)

        synchronized(logs) {
            if (logs.size >= MAX_LOGS) {
                logs.removeAt(0)
            }
            logs.add(entry)
        }

        when (level) {
            "DEBUG" -> Log.d(tag, "[$step] $message")
            "INFO" -> Log.i(tag, "[$step] $message")
            "WARN" -> Log.w(tag, "[$step] $message")
            "ERROR" -> Log.e(tag, "[$step] $message")
            else -> Log.i(tag, "[$step] $message")
        }

        // Emit Native Telemetry event to Redux bridge
        emitTelemetryEvent("HKIA_NATIVE_LOG", entry)
    }

    fun info(tag: String, message: String, step: String = "PROCEDURAL") = log("INFO", tag, step, message)
    fun warn(tag: String, message: String, step: String = "PROCEDURAL") = log("WARN", tag, step, message)
    fun error(tag: String, message: String, throwable: Throwable? = null, step: String = "ERROR_PROCEDURAL") {
        val fullMsg = if (throwable != null) "$message | Exception: ${throwable.localizedMessage}" else message
        log("ERROR", tag, step, fullMsg)
    }

    fun getLogs(): List<LogEntry> = synchronized(logs) { ArrayList(logs) }
    fun clearLogs() = synchronized(logs) { logs.clear() }

    /**
     * Emits a real-time native telemetry event to JavaScript listeners (`HKIANativeEventEmitter`).
     */
    fun emitTelemetryEvent(eventName: String, data: Any) {
        val context = reactContext ?: return
        if (!context.hasActiveCatalystInstance()) return

        Handler(Looper.getMainLooper()).post {
            try {
                val params = Arguments.createMap()
                params.putString("eventName", eventName)
                if (data is LogEntry) {
                    params.putString("timestamp", data.timestamp)
                    params.putDouble("epochMs", data.epochMs.toDouble())
                    params.putString("level", data.level)
                    params.putString("tag", data.tag)
                    params.putString("step", data.step)
                    params.putString("message", data.message)
                } else if (data is String) {
                    params.putString("message", data)
                }
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("HKIA_TELEMETRY_EVENT", params)
            } catch (e: Exception) {
                Log.e("HKIALogger", "Failed to emit telemetry event to RN", e)
            }
        }
    }
}
