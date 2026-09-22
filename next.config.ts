import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Strict Mode disabled: VideoSDK's JS SDK uses a module-level Redux
  // store (assigned via RoomClient.init({ store })). Strict Mode's intentional
  // double-invocation of useEffect causes VideoSDK.config() to run twice,
  // which replaces that shared store mid-join and fires a spurious
  // 'meeting-left' event. This is a known incompatibility between WebRTC
  // singleton SDKs and React Strict Mode. Re-enable only after verifying the
  // SDK handles it (or after migrating to a Strict Mode-safe integration).
  reactStrictMode: false,
  // reactCompiler also disabled: same singleton/side-effect incompatibility.
};

export default nextConfig;
