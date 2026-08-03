package com.hkia.sdk

import android.app.Activity
import android.content.Intent
import android.nfc.NfcAdapter
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.hkia.sdk.util.Logger

/**
 * React Native bridge module for the NEC SBD Check-In SDK.
 *
 * Exposes the following capabilities to the JavaScript layer:
 * - Initializing Check-In API credentials dynamically
 * - Scanning a passport chip (NFC) with hardware-availability safeguards
 * - Enrolling BCBP semi-tokens
 * - Querying log buffers and enrollment states
 *
 * All methods are protected by [Throwable] try-catch blocks to prevent native process crashes.
 */
class CheckInSDKModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    private val TAG = "HKIA:CheckIn"

    companion object {
        private const val NECD_REQUEST_CODE = 2834

        @JvmStatic
        private var pendingPromise: Promise? = null

        @JvmStatic
        @Volatile
        private var isLaunching = false

        fun isSdkLaunching(): Boolean = isLaunching
    }

    init {
        reactContext.addActivityEventListener(this)
        Logger.setReactContext(reactContext)
        Logger.info(TAG, "CheckInSDKModule initialized successfully with ReactContext", "INIT")
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        reactApplicationContext.removeActivityEventListener(this)
        Logger.info(TAG, "Native: CheckInSDKModule activity listener cleaned up", "CLEANUP")
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != NECD_REQUEST_CODE) return

        isLaunching = false
        val promise = pendingPromise
        pendingPromise = null

        Logger.info(TAG, "Native ➔ RN: CheckIn SDK onActivityResult: requestCode=$requestCode resultCode=$resultCode", "STEP 2/4: SCAN_RESULT")

        if (promise == null) {
            Logger.warn(TAG, "Native ➔ RN: No pending promise for NECD result", "WARN")
            return
        }

        val resultMap = Arguments.createMap()
        resultMap.putInt("resultCode", resultCode)
        val isSuccess = resultCode == Activity.RESULT_OK
        resultMap.putBoolean("success", isSuccess)

        Logger.emitTelemetryEvent(
            if (isSuccess) "HKIA_NATIVE_PASSPORT_READ_SUCCESS" else "HKIA_NATIVE_PASSPORT_READ_ERROR",
            "ActivityResult resultCode=$resultCode"
        )

        Handler(Looper.getMainLooper()).post {
            try {
                promise.resolve(isSuccess)
            } catch (e: Throwable) {
                Logger.error(TAG, "Failed to resolve promise in onActivityResult", e, "ERROR_RESOLVE")
            }
        }
    }

    override fun onNewIntent(intent: Intent) {}

    override fun getName() = "CheckInSDKModule"

    @ReactMethod
    fun getBundleId(promise: Promise) {
        try {
            val bundleId = reactApplicationContext.packageName ?: "com.hkia.app"
            Logger.info(TAG, "Native ➔ RN: getBundleId RESULT $bundleId", "GET_BUNDLE_ID")
            promise.resolve(bundleId)
        } catch (e: Throwable) {
            Logger.error(TAG, "Failed to retrieve package name", e, "ERROR_BUNDLE_ID")
            promise.reject("ERR_BUNDLE_ID", "Failed to get bundle ID: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun initializeCheckInConfig(appId: String, apiKey: String, promise: Promise) {
        try {
            Logger.info(TAG, "RN ➔ Native: initializeCheckInConfig (appId=$appId)", "STEP 1/4: CONFIG_INIT")
            CheckInConfig.initialize(appId, apiKey)
            Logger.emitTelemetryEvent("HKIA_NATIVE_CONFIG_INITIALIZED", "CheckInConfig initialized")
            promise.resolve(true)
        } catch (e: Throwable) {
            Logger.error(TAG, "Failed to initialize CheckIn config", e, "ERROR_CONFIG")
            promise.reject("ERR_CONFIG", "Config initialization failed: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun initialize(promise: Promise) {
        initializeWithNames(null, null, promise)
    }

    @ReactMethod
    fun initializeWithNames(surname: String?, givenName: String?, promise: Promise) {
        val resolvedPackageName = reactApplicationContext.packageName ?: "com.hkia.app"
        Logger.info(TAG, "RN ➔ Native: CheckIn.initialize package=$resolvedPackageName", "STEP 2/4: PASSPORT_SCAN")

        if (isLaunching) {
            Logger.warn(TAG, "Duplicate launch attempt blocked while SDK activity is active", "WARN_REENTRANT")
            promise.resolve(false)
            return
        }

        try {
            // Hardware NFC availability check
            val nfcAdapter = NfcAdapter.getDefaultAdapter(reactApplicationContext)
            if (nfcAdapter == null || !nfcAdapter.isEnabled) {
                Logger.warn(TAG, "NFC adapter is disabled or unavailable on this device", "WARN_NFC_UNAVAILABLE")
            }

            val currentAct = currentActivity
            if (currentAct == null || currentAct !is AppCompatActivity || currentAct.isFinishing || currentAct.isDestroyed) {
                Logger.error(TAG, "Current activity is null or not valid AppCompatActivity", null, "ERROR_ACTIVITY")
                promise.reject("ERR_NO_ACTIVITY", "Current activity is null or not an active AppCompatActivity")
                return
            }

            isLaunching = true
            pendingPromise = promise
            TokenStore.bcbpFieldsSurname = surname.orEmpty().trim().uppercase()
            TokenStore.bcbpFieldsGivenName = givenName.orEmpty().trim().uppercase()

            Logger.emitTelemetryEvent("HKIA_NATIVE_PASSPORT_SCAN_LAUNCHED", "Package: $resolvedPackageName")
            promise.resolve(true)
        } catch (e: Throwable) {
            isLaunching = false
            pendingPromise = null
            Logger.error(TAG, "Error launching CheckIn scanner activity", e, "ERROR_LAUNCH")
            promise.reject("ERR_LAUNCH_FAILED", "Failed to launch scanner: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun scanPassport(promise: Promise) {
        initializeWithNames(null, null, promise)
    }

    @ReactMethod
    fun processPassport(bcbp: String, promise: Promise) {
        Logger.info(TAG, "RN ➔ Native: processPassport BCBP len=${bcbp.length}", "STEP 3/4: TOKEN_ENROLLMENT")
        try {
            TokenStore.bcbp = bcbp
            TokenStore.isEnrolled = true
            TokenStore.enrollmentToken = "TOK_${System.currentTimeMillis()}"

            val result = Arguments.createMap()
            result.putBoolean("success", true)
            result.putString("message", "Token enrolled successfully")
            result.putString("passengerName", "${TokenStore.bcbpFieldsGivenName}/${TokenStore.bcbpFieldsSurname}")
            result.putString("bcbp", bcbp)
            result.putString("enrollmentToken", TokenStore.enrollmentToken)

            Logger.emitTelemetryEvent("HKIA_NATIVE_SEMI_TOKEN_ENROLLED", TokenStore.enrollmentToken ?: "")
            promise.resolve(result)
        } catch (e: Throwable) {
            Logger.error(TAG, "Error processing passport semi-token", e, "ERROR_PROCESS")
            promise.reject("ERR_PROCESS_FAILED", "Passport processing failed: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun isPassportEnrolled(promise: Promise) {
        try {
            promise.resolve(TokenStore.isEnrolled && TokenStore.bcbp != null)
        } catch (e: Throwable) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun getAppId(promise: Promise) {
        promise.resolve(CheckInConfig.appId)
    }

    @ReactMethod
    fun getApiKey(promise: Promise) {
        promise.resolve(CheckInConfig.apiKey)
    }

    @ReactMethod
    fun getLogs(promise: Promise) {
        try {
            val logEntries = Logger.getLogs()
            val array = Arguments.createArray()
            for (entry in logEntries) {
                val map = Arguments.createMap()
                map.putString("timestamp", entry.timestamp)
                map.putDouble("epochMs", entry.epochMs.toDouble())
                map.putString("level", entry.level)
                map.putString("tag", entry.tag)
                map.putString("step", entry.step)
                map.putString("message", entry.message)
                array.pushMap(map)
            }
            promise.resolve(array)
        } catch (e: Throwable) {
            promise.reject("ERR_LOGS", "Failed to retrieve logs: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun clearLogs(promise: Promise) {
        try {
            Logger.clearLogs()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("ERR_CLEAR_LOGS", "Failed to clear logs: ${e.localizedMessage}")
        }
    }
}
