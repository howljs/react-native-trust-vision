import React from 'react';
import { Button, SafeAreaView } from 'react-native';
import TrustVision, {
  IdCapturingConfigProps,
  SelfieCapturingConfigProps,
  TVConst,
  TVThemeCustomization,
} from 'react-native-trust-vision';

const trustVisionConfig = {
  settings: {
    sdk_settings: {
      active_liveness_settings: {
        face_tracking_setting: {
          android_terminate_threshold: 0.002847,
          android_warning_threshold: 0.001474,
          enable: true,
          ios_terminate_threshold: 0.003393,
          ios_warning_threshold: 0.002176,
          limit_for: 'all_flow',
          max_warning_time: 5,
        },
        flow_interval_time_ms: 1500,
        record_video: { enable: false },
        save_encoded_frames: { enable: true, frames_interval_ms: 120 },
        terminate_if_no_face: {
          enable: true,
          max_invalid_frame: 5,
          max_time_ms: 1000,
        },
      },
      id_detection_settings: {
        scan_qr_settings: { enable: true, limit_time_second: 15 },
        save_frame_settings: { enable: true, frames_interval_ms: 190 },
        limit_time_settings: { enable: true, limit_time_second: 20 },
        flow_interval_time_ms: 2000,
        auto_capture: { enable: false, show_capture_button: true },
        blur_check: { enable: true, threshold: 0.29 },
        disable_capture_button_if_alert: true,
        glare_check: { enable: true, threshold: 0.001 },
        id_detection: { enable: true },
      },
      liveness_settings: {
        vertical_check: { enable: true, threshold: 40 },
      },
    },
  },
};

const App = () => {
  const initSDK = async (showTrademark: boolean) => {
    try {
      const clientSettingJsonString = JSON.stringify(trustVisionConfig);
      // const tvTheme = {
      //   idCapturingTheme: { showTrademark },
      //   selfieCapturingTheme: { showTrademark },
      //   idConfirmationTheme: {},
      //   qrGuidelinePopupTheme: {},
      //   qrRetryPopupTheme: {},
      //   selfieConfirmationTheme: {},
      // };
      await TrustVision.initializeWithTheme(
        clientSettingJsonString,
        'vi',
        customizeTVTheme(showTrademark),
        true
      );
      // TrustVision.addEventListener('TVSDKFrameBatch', (event) => {
      //   console.log('TVSDKFrameBatch - ', event);
      // });
    } catch (e) {}
  };

  const _startIdSideCapturing = async (mode: 'front' | 'back') => {
    const cardType = {
      id: 'card_id',
      name: 'card_name',
      orientation: TVConst.Orientation.LANDSCAPE,
      hasBackSide: true,
    };

    try {
      const idFrontConfig: IdCapturingConfigProps = {
        cardType: cardType,
        cardSide:
          mode === 'front' ? TVConst.CardSide.FRONT : TVConst.CardSide.BACK,
        isEnableSound: true,
        isReadBothSide: false,
        skipConfirmScreen: false,
      };
      const idFrontResult = await TrustVision.startIdCapturing(idFrontConfig);
      console.log('idFrontResult', idFrontResult);
    } catch (e) {}
  };

  const _startSelfieCapturing = async () => {
    try {
      const selfieConfig: SelfieCapturingConfigProps = {
        cameraOption: TVConst.SelfieCameraMode.FRONT,
        livenessMode: TVConst.LivenessMode.ACTIVE,
        isEnableSound: true,
        skipConfirmScreen: true,
      };

      const selfieResult = await TrustVision.startSelfieCapturing(selfieConfig);
      console.log('Selfie Result', selfieResult);
    } catch (error) {}
  };

  return (
    <SafeAreaView>
      <Button title="Show TradeMark" onPress={() => initSDK(true)} />
      <Button title="Hide TradeMark" onPress={() => initSDK(false)} />
      <Button
        title={'Start ID capturing Front side'}
        onPress={() => _startIdSideCapturing('front')}
      />
      <Button
        title={'Start ID capturing Back side'}
        onPress={() => _startIdSideCapturing('back')}
      />
      <Button
        title={'Start Selfie capturing'}
        onPress={_startSelfieCapturing}
      />
    </SafeAreaView>
  );
};

export default App;

const customizeTVTheme = (showTrademark: boolean) => {
  const normalTextSize = 14.0;
  const labelBackgroundColors = ['#00ffffff']; // transparent. Set multiple colors if you want gradient
  const normalLabelTextColor = '#ffffff'; // white
  const errorLabelTextColor = '#ff0000'; //red
  const labelBorderColor = '#00ffffff'; // transparent
  const screenBackgroundColor = '#0D0D51'; // blue
  const labelBorderWidth = 1.0;
  const labelPaddingHorizontal = 10.0;
  const labelPaddingVertical = 5.0;
  const cornerRadius = 0.0;

  const normalLabelTheme = {
    isHidden: false,
    textSize: normalTextSize,
    fontStyle: TVThemeCustomization.FontStyle.REGULAR,
    textColor: normalLabelTextColor,
    backgroundColors: labelBackgroundColors,
    isBackgroundGradientHorizontal: false,
    cornerRadius: cornerRadius,
    borderWidth: labelBorderWidth,
    borderColor: labelBorderColor, // transparent
    paddingHorizontal: labelPaddingHorizontal,
    paddingVertical: labelPaddingVertical,
    textGravity: TVThemeCustomization.TextGravity.CENTER,
  };

  const titleLabelTheme: any = {};
  Object.assign(titleLabelTheme, normalLabelTheme);
  titleLabelTheme['textSize'] = 16.0;
  titleLabelTheme['fontStyle'] = TVThemeCustomization.FontStyle.BOLD;

  const errorLabelTheme: any = {};
  Object.assign(errorLabelTheme, normalLabelTheme);
  errorLabelTheme['textSize'] = 12.0;
  errorLabelTheme['textColor'] = errorLabelTextColor;

  const timeoutLabelTheme: any = {};
  Object.assign(timeoutLabelTheme, errorLabelTheme);
  timeoutLabelTheme['isHidden'] = true;

  const idCapturingTheme = {
    titleLabelTheme: titleLabelTheme,
    instructionLabelTheme: normalLabelTheme,
    errorLabelTheme: errorLabelTheme,
    timeoutLabelTheme: timeoutLabelTheme,
    normalLabelTheme: normalLabelTheme,
    closeButtonLocation: TVThemeCustomization.ButtonLocation.TOP_LEFT,
    backgroundColor: '#80000000', // 50% black
    showTrademark,
  };

  const idConfirmationTheme = {
    titleLabelTheme: titleLabelTheme,
    errorLabelTheme: errorLabelTheme,
    normalLabelTheme: normalLabelTheme,
    closeButtonLocation: TVThemeCustomization.ButtonLocation.TOP_LEFT,
    backgroundColor: screenBackgroundColor,
  };

  const selfieCapturingTheme = {
    titleLabelTheme: titleLabelTheme,
    instructionLabelTheme: normalLabelTheme,
    errorLabelTheme: errorLabelTheme,
    timeoutLabelTheme: timeoutLabelTheme,
    normalLabelTheme: normalLabelTheme,
    closeButtonLocation: TVThemeCustomization.ButtonLocation.TOP_LEFT,
    backgroundColor: screenBackgroundColor,
    showTrademark,
  };

  const selfieConfirmationTheme = {
    titleLabelTheme: titleLabelTheme,
    instructionLabelTheme: normalLabelTheme,
    errorLabelTheme: errorLabelTheme,
    normalLabelTheme: normalLabelTheme,
    closeButtonLocation: TVThemeCustomization.ButtonLocation.TOP_LEFT,
    backgroundColor: screenBackgroundColor,
  };

  const qrPopupLabelTheme = {
    textSize: 16.0,
    textColor: '#99002F75' /* 60% opacity */,
  };

  const qrPopupPrimaryButtonTheme = {
    cornerRadius: 3.0,
    textSize: 16.0,
    textColor: '#ffffff',
    backgroundColors: ['#0276F1'], // set multiple color if you want gradients
  };

  const qrGuidelinePopupTheme = {
    backgroundColor: '#ffffff',
    titleLabelTheme: { isHidden: true }, // hide label,
    descriptionTheme: qrPopupLabelTheme,
    primaryButtonTheme: qrPopupPrimaryButtonTheme,
    secondaryButtonTheme: { isHidden: true }, // hide button
    timeoutLabelTheme: qrPopupLabelTheme,
  };

  const qrRetryPopupTheme = {
    backgroundColor: '#ffffff',
    titleLabelTheme: qrPopupLabelTheme,
    descriptionTheme: qrPopupLabelTheme,
    primaryButtonTheme: qrPopupLabelTheme,
    secondaryButtonTheme: qrPopupLabelTheme,
    timeoutLabelTheme: { isHidden: true }, // hide label
  };

  const tvTheme = {
    idCapturingTheme: idCapturingTheme,
    idConfirmationTheme: idConfirmationTheme,
    selfieCapturingTheme: selfieCapturingTheme,
    selfieConfirmationTheme: selfieConfirmationTheme,
    qrGuidelinePopupTheme: qrGuidelinePopupTheme,
    qrRetryPopupTheme: qrRetryPopupTheme,
  };

  return tvTheme;
};
