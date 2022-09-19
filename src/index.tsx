import { NativeEventEmitter, NativeModule, NativeModules } from 'react-native';

export type TVConstType = {
  Orientation: {
    LANDSCAPE: 'horizontal';
    PORTRAIT: 'vertical';
  };
  QRType: {
    QRCODE: 'qrCode';
    BARCODE: 'barCode';
  };
  ActionMode: {
    FACE_MATCHING: 'FACE_MATCHING';
    FULL: 'FULL';
    LIVENESS: 'LIVENESS';
    EXTRACT_ID_INFO: 'READ_CARD_INFO';
  };
  LivenessMode: {
    ACTIVE: 'active';
    PASSIVE: 'passive';
  };
  SelfieCameraMode: {
    FRONT: 'front';
    BACK: 'back';
    BOTH: 'both';
  };
  CompareImageResult: {
    MATCHED: 'matched';
    UNMATCHED: 'unmatched';
    UNSURE: 'unsure';
  };
  CardSide: {
    FRONT: 'front';
    BACK: 'back';
  };
};

export const TVConst: TVConstType = {
  Orientation: {
    LANDSCAPE: 'horizontal',
    PORTRAIT: 'vertical',
  },
  QRType: {
    QRCODE: 'qrCode',
    BARCODE: 'barCode',
  },
  ActionMode: {
    FACE_MATCHING: 'FACE_MATCHING',
    FULL: 'FULL',
    LIVENESS: 'LIVENESS',
    EXTRACT_ID_INFO: 'READ_CARD_INFO',
  },
  LivenessMode: {
    ACTIVE: 'active',
    PASSIVE: 'passive',
  },
  SelfieCameraMode: {
    FRONT: 'front',
    BACK: 'back',
    BOTH: 'both',
  },
  CompareImageResult: {
    MATCHED: 'matched',
    UNMATCHED: 'unmatched',
    UNSURE: 'unsure',
  },
  CardSide: {
    FRONT: 'front',
    BACK: 'back',
  },
};

export type TVThemeCustomizationType = {
  TextGravity: {
    LEFT: 'LEFT';
    RIGHT: 'RIGHT';
    CENTER: 'CENTER';
  };
  ButtonLocation: {
    TOP_LEFT: 'TOP_LEFT';
    TOP_RIGHT: 'TOP_RIGHT';
    NONE: 'NONE';
  };
  FontStyle: {
    BOLD: 'bold';
    ITALIC: 'italic';
    BOLD_ITALIC: 'bold_italic';
    REGULAR: 'regular';
  };
};

export const TVThemeCustomization: TVThemeCustomizationType = {
  TextGravity: {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    CENTER: 'CENTER',
  },
  ButtonLocation: {
    TOP_LEFT: 'TOP_LEFT',
    TOP_RIGHT: 'TOP_RIGHT',
    NONE: 'NONE',
  },
  FontStyle: {
    BOLD: 'bold',
    ITALIC: 'italic',
    BOLD_ITALIC: 'bold_italic',
    REGULAR: 'regular',
  },
};

export type TVErrorCodeType = {
  UNAUTHORIZED: 'authentication_missing_error';
  NETWORK_ERROR: 'network_error';
  INTERNAL_ERROR: 'internal_error';
  TIMEOUT_ERROR: 'timeout_error';
  CANCELATION_ERROR: 'sdk_canceled';
};

export const TVErrorCode: TVErrorCodeType = {
  UNAUTHORIZED: 'authentication_missing_error',
  NETWORK_ERROR: 'network_error',
  INTERNAL_ERROR: 'internal_error',
  TIMEOUT_ERROR: 'timeout_error',
  CANCELATION_ERROR: 'sdk_canceled',
};

type ValueOf<T> = T[keyof T];

export interface CardType {
  id: string;
  name: string;
  orientation: ValueOf<TVConstType['Orientation']>;
  hasBackSide: boolean;
}

export interface IdCapturingConfigProps {
  cardType?: CardType;
  isEnableSound?: boolean;
  isReadBothSide?: boolean;
  cardSide?: ValueOf<TVConstType['CardSide']>;
  skipConfirmScreen?: boolean;
  isEnableScanQr?: boolean;
}

export interface SelfieCapturingConfigProps {
  isEnableSound?: boolean;
  livenessMode?: ValueOf<TVConstType['LivenessMode']>;
  cameraOption?: ValueOf<TVConstType['SelfieCameraMode']>;
  skipConfirmScreen?: boolean;
}

export interface ImageClass {
  raw_image_base64: string;
  image_id: string;
}

export interface SelfieImage {
  gesture_type: string;
  frontal_image?: ImageClass;
  gesture_image?: ImageClass;
}

export interface TVCardQr {
  is_required: boolean;
  images?: ImageClass[];
}

export interface TVDetectionResult {
  selfieImages?: SelfieImage[];
  idFrontImage?: ImageClass;
  // frontIdQr: TVCardQr;
  idBackImage?: ImageClass;
  livenessVideos?: string[];
  livenessMetadata?: string;
  livenessFrameBatchIds?: string[];
  frontCardFrameBatchIds?: string[];
  backCardFrameBatchIds?: string[];
}

interface InfoResult {
  'X-TV-OS-Platform': string;
  'X-TV-OS-Version': string;
  'X-TV-SDK-Version': string;
  'X-TV-Device-Model': string;
}

interface TrustVisionProps extends NativeModule {
  initialize(
    setting: string,
    languageCode: string,
    enableEventTracking: boolean
  ): Promise<string>;
  initializeWithTheme(
    setting: string,
    languageCode: string,
    tvTheme: any,
    enableEventTracking: boolean
  ): Promise<string>;
  startIdCapturing(config: IdCapturingConfigProps): Promise<TVDetectionResult>;
  startSelfieCapturing(
    config: SelfieCapturingConfigProps
  ): Promise<TVDetectionResult>;
  getInfo(): Promise<InfoResult>;
}

const TrustVisionNative: TrustVisionProps = NativeModules.TrustVision;

export type TrustVisionEventType = 'TVSDKEvent' | 'TVSDKFrameBatch';

const TrustVision = {
  initialize: TrustVisionNative.initialize,
  initializeWithTheme: TrustVisionNative.initializeWithTheme,
  startIdCapturing: TrustVisionNative.startIdCapturing,
  startSelfieCapturing: TrustVisionNative.startSelfieCapturing,
  getInfo: TrustVisionNative.getInfo,
  addEventListener: (
    event: TrustVisionEventType,
    callback: (event: any) => void,
    context?: Object | undefined
  ) => {
    const trustVisionEmitter = new NativeEventEmitter();
    return trustVisionEmitter.addListener(event, callback, context);
  },
};

export default TrustVision;
