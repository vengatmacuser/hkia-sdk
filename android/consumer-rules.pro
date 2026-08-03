# Keep all HKIA SDK native bridge Kotlin classes and ReactMethod annotations
-keep class com.hkia.sdk.** { *; }
-keepclassmembers class com.hkia.sdk.** {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Preserve React Native bridge interfaces
-keep interface com.facebook.react.bridge.NativeModule { *; }
-keep interface com.facebook.react.bridge.ReactPackage { *; }
