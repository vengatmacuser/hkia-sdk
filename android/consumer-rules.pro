# R8 / ProGuard Protection Rules for react-native-hkia-sdk

# Keep all HKIA SDK native bridge Kotlin classes and ReactMethod annotations
-keep class com.hkia.sdk.** { *; }
-keepclassmembers class com.hkia.sdk.** {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Preserve Native AAR binary libraries (SelfBagDrop.aar & sbd_check_in.aar)
-keep class com.ha.** { *; }
-keep class com.sbd.** { *; }
-dontwarn com.ha.**
-dontwarn com.sbd.**

# Preserve React Native bridge interfaces & events
-keep interface com.facebook.react.bridge.NativeModule { *; }
-keep interface com.facebook.react.bridge.ReactPackage { *; }

# Preserve line numbers and source attributes for Crashlytics stack trace symbolication
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable,*Annotation*
