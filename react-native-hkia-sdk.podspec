Pod::Spec.new do |s|
  s.name         = "react-native-hkia-sdk"
  s.version      = "1.0.0"
  s.summary      = "Enterprise-grade React Native SDK plugin for HKIA Check-In and Self BagDrop integration."
  s.homepage     = "https://github.com/vengatmacuser/hkia-sdk"
  s.license      = "MIT"
  s.author       = { "Thai Airways" => "mobileapp@thaiairways.com" }
  s.platform     = :ios, "13.0"
  s.source       = { :git => "https://github.com/vengatmacuser/hkia-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.frameworks   = "UIKit", "Foundation", "CoreNFC", "AVFoundation"
  s.vendored_frameworks = "libs/ios/sbd_check_in.xcframework", "libs/ios/SelfBagDropFramework.xcframework", "libs/ios/OpenSSL.xcframework"
  s.requires_arc = true

  s.dependency "React-Core"
end
