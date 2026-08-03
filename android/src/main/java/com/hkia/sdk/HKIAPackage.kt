package com.hkia.sdk

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.hkia.sdk.bagdrop.BagDropSDKModule
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

/**
 * React Native Package that registers both the Check-In and BagDrop native modules.
 *
 * Registered Modules:
 * - [CheckInSDKModule] - Passport MRZ scanning, NFC reading, and semi-token enrollment
 * - [BagDropSDKModule] - Self BagDrop flow initialization and execution
 */
class HKIAPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            CheckInSDKModule(reactContext),
            BagDropSDKModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<View, ReactShadowNode<*>>> {
        return emptyList()
    }
}
