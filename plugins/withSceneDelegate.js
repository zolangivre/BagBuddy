// iOS 27 aborts at launch unless the app adopts the UIScene life cycle. Expo SDK 57 ships
// `ExpoAppSceneDelegate`, but its native template still starts React Native from the app
// delegate. This ports the SDK 58 template's scene setup; drop it once on SDK 58, whose
// template already includes it (every step below is skipped when already present).
const fs = require("fs");
const path = require("path");
const {
  IOSConfig,
  withAppDelegate,
  withInfoPlist,
  withXcodeProject,
} = require("expo/config-plugins");

const SCENE_DELEGATE_SWIFT = `internal import Expo

@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

function replaceOrThrow(contents, pattern, replacement, what) {
  if (!pattern.test(contents)) {
    throw new Error(
      `withSceneDelegate: couldn't find ${what} in AppDelegate.swift; the Expo template changed.`,
    );
  }
  return contents.replace(pattern, replacement);
}

// The scene delegate creates the window and starts React Native, reading the factory back
// from the app delegate through `ExpoReactNativeFactoryProvider`.
const withSceneAppDelegate = (config) =>
  withAppDelegate(config, (config) => {
    let contents = config.modResults.contents;
    if (contents.includes("ExpoReactNativeFactoryProvider")) {
      return config;
    }
    contents = replaceOrThrow(
      contents,
      /class AppDelegate: ExpoAppDelegate \{/,
      "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
      "the AppDelegate declaration",
    );
    contents = replaceOrThrow(
      contents,
      /\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow[\s\S]*?#endif\n/,
      "\n    // The window is created and React Native is started by `SceneDelegate` under the\n" +
        "    // scene-based life cycle (required by the iOS 27 SDK).\n",
      "the window setup",
    );
    config.modResults.contents = contents;
    return config;
  });

const withSceneManifest = (config) =>
  withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest ??= {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: "$(PRODUCT_MODULE_NAME).SceneDelegate",
          },
        ],
      },
    };
    return config;
  });

const withSceneDelegateFile = (config) =>
  withXcodeProject(config, (config) => {
    const { projectRoot, platformProjectRoot } = config.modRequest;
    const projectName = IOSConfig.XcodeUtils.getProjectName(projectRoot);
    const filePath = path.join(platformProjectRoot, projectName, "SceneDelegate.swift");
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, SCENE_DELEGATE_SWIFT);
    }
    // Skips files already in the group.
    config.modResults = IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
      filepath: `${projectName}/SceneDelegate.swift`,
      groupName: projectName,
      project: config.modResults,
    });
    return config;
  });

module.exports = (config) =>
  withSceneDelegateFile(withSceneManifest(withSceneAppDelegate(config)));
