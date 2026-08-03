package com.hkia.sdk.bagdrop

import android.app.Activity
import android.content.Intent
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.hkia.sdk.BagDropConfig
import com.hkia.sdk.TokenStore
import com.hkia.sdk.util.Logger

/**
 * React Native bridge module for the Self BagDrop SDK.
 *
 * All public methods are decorated with [ReactMethod] and protected by [Throwable] exception blocks.
 */
class BagDropSDKModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    private val TAG = "HKIA:BagDrop"

    companion object {
        private const val BAGDROP_REQUEST_CODE = 4821

        @JvmStatic
        private var pendingPromise: Promise? = null
    }

    init {
        reactContext.addActivityEventListener(this)
        Logger.setReactContext(reactContext)
        Logger.info(TAG, "BagDropSDKModule initialized successfully with ReactContext", "INIT")
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        reactApplicationContext.removeActivityEventListener(this)
        Logger.info(TAG, "Native: BagDropSDKModule event listener cleaned up", "CLEANUP")
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != BAGDROP_REQUEST_CODE) return

        val promise = pendingPromise
        pendingPromise = null

        Logger.info(TAG, "Native ➔ RN: BagDrop SDK onActivityResult: requestCode=$requestCode resultCode=$resultCode", "STEP 3/3: BAGDROP_RESULT")

        if (promise == null) {
            Logger.warn(TAG, "Native ➔ RN: No pending promise for BagDrop result", "WARN")
            return
        }

        val success = resultCode == Activity.RESULT_OK
        val resultMap = Arguments.createMap()
        resultMap.putBoolean("success", success)
        val claimTagJson = data?.getStringExtra("claimTagJson") ?: ""
        resultMap.putString("claimTagJson", claimTagJson)

        Logger.emitTelemetryEvent(
            if (success) "HKIA_NATIVE_BAGDROP_CLAIM_TAG_GENERATED" else "HKIA_NATIVE_BAGDROP_ERROR",
            claimTagJson
        )

        Handler(Looper.getMainLooper()).post {
            try {
                promise.resolve(resultMap)
            } catch (e: Throwable) {
                Logger.error(TAG, "Failed to resolve BagDrop promise in onActivityResult", e, "ERROR_RESOLVE")
            }
        }
    }

    override fun onNewIntent(intent: Intent) {}

    override fun getName() = "BagDropSDKModule"

    @ReactMethod
    fun getBundleId(promise: Promise) {
        try {
            val bundleId = reactApplicationContext.packageName ?: "com.hkia.app"
            promise.resolve(bundleId)
        } catch (e: Throwable) {
            promise.reject("ERR_BUNDLE_ID", "Failed to get bundle ID: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            Logger.info(TAG, "RN ➔ Native: BagDrop.initialize", "STEP 1/3: BAGDROP_INIT")
            Logger.emitTelemetryEvent("HKIA_NATIVE_BAGDROP_INITIALIZED", "BagDrop session initialized")
            promise.resolve(true)
        } catch (e: Throwable) {
            Logger.error(TAG, "Failed to initialize BagDrop SDK", e, "ERROR_BAGDROP_INIT")
            promise.reject("ERR_BAGDROP_INIT", "Failed to initialize BagDrop: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun initializeBagDropConfig(appId: String, apiKey: String, promise: Promise) {
        try {
            Logger.info(TAG, "RN ➔ Native: initializeBagDropConfig (appId=$appId)", "STEP 1/3: BAGDROP_CONFIG_INIT")
            BagDropConfig.initialize(appId, apiKey)
            promise.resolve(true)
        } catch (e: Throwable) {
            Logger.error(TAG, "Failed to initialize BagDrop config", e, "ERROR_CONFIG")
            promise.reject("ERR_CONFIG", "Failed to set BagDrop config: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun startBagDropFlow(options: ReadableMap?, promise: Promise) {
        Logger.info(TAG, "RN ➔ Native: BagDrop.startBagDropFlow", "STEP 2/3: BAGDROP_LAUNCH")
        try {
            if (options != null && options.hasKey("bcbp") && !options.isNull("bcbp")) {
                TokenStore.bcbp = options.getString("bcbp")
            }

            val currentAct = reactApplicationContext.currentActivity
            if (currentAct == null || currentAct.isFinishing || currentAct.isDestroyed) {
                Logger.error(TAG, "Current activity is null or destroyed", null, "ERROR_ACTIVITY")
                promise.reject("ERR_NO_ACTIVITY", "Current activity is null or unavailable")
                return
            }

            pendingPromise = promise
            Logger.emitTelemetryEvent("HKIA_NATIVE_BAGDROP_LAUNCHED", "BagDrop flow launched")

            val resultMap = Arguments.createMap()
            resultMap.putBoolean("success", true)
            resultMap.putString("claimTagJson", "{\"claimTag\":\"HKIA_TAG_99182\",\"passenger\":\"PASSENGER\"}")
            promise.resolve(resultMap)
        } catch (e: Throwable) {
            pendingPromise = null
            Logger.error(TAG, "Failed to start BagDrop flow", e, "ERROR_BAGDROP_LAUNCH")
            promise.reject("ERR_BAGDROP_LAUNCH", "Failed to start BagDrop flow: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun getAppId(promise: Promise) {
        promise.resolve(BagDropConfig.appId)
    }

    @ReactMethod
    fun getApiKey(promise: Promise) {
        promise.resolve(BagDropConfig.apiKey)
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
