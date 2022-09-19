#import <objc/runtime.h>
#import "TrustVision.h"
#import <React/RCTConvert.h>
#import "CocoaLumberjack/CocoaLumberjack.h"

@import TrustVisionSDK;
@import TrustVisionCoreSDK;

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTrustVisionSpec.h"
#endif

@implementation TrustVision {
    bool hasListeners;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"TVSDKEvent", @"TVSDKFrameBatch"];
}


RCT_EXPORT_METHOD(getInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    DeviceInfo *deviceInfo = [[DeviceInfo alloc] init];

    NSDictionary *infoDict = @{
        @"X-TV-OS-Platform": [deviceInfo getPlatform],
        @"X-TV-OS-Version": [deviceInfo getOSVersion],
        @"X-TV-SDK-Version": [deviceInfo getSDKVersion],
        @"X-TV-Device-Model": [deviceInfo getDeviceModel]
    };

    resolve(infoDict);
}

RCT_EXPORT_METHOD(initialize:(NSString *)clientSettingsJsonString
                  languageCode:(NSString *)languageCode
                  enableEventTracking:(BOOL)enableEventTracking
                  withResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    TVTheme *tvTheme = [TVTheme dictToObjWithDict: [[NSDictionary alloc] init]];
    [TrustVisionSdkWrapper initializeWithClientSettingsJsonString:clientSettingsJsonString
                                                  localizationFiles:NULL
                                                       languageCode:languageCode
                                                              theme:tvTheme
                                                 enableDebuggingLog:NO
                                                            success:^{
        resolve(@"Initialize TV framework done.");
    }
                                                            failure:^(TVError *error) {
        [self rejectWithRejecter:reject TvError:error];
    }
                                                            onEvent:^(TVTrackingEvent *event) {
        if (enableEventTracking && self->hasListeners) {
            [self sendEventWithName:@"TVSDKEvent" body:@{
                @"name": event.name,
                @"params": event.params
            }];
        }
    }];
}

RCT_EXPORT_METHOD(initializeWithTheme:(NSString *)clientSettingsJsonString
                  languageCode:(NSString *)languageCode
                  withTheme:(NSDictionary *)theme
                  enableEventTracking:(BOOL)enableEventTracking
                  withResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    TVTheme *tvTheme = [TVTheme dictToObjWithDict:theme];
    [TrustVisionSdkWrapper initializeWithClientSettingsJsonString:clientSettingsJsonString
                                                  localizationFiles:NULL
                                                       languageCode:languageCode
                                                              theme:tvTheme
                                                 enableDebuggingLog:NO
                                                            success:^{
        resolve(@"Initialize TV framework done.");
    }
                                                            failure:^(TVError *error) {
        [self rejectWithRejecter:reject TvError:error];
    }
                                                            onEvent:^(TVTrackingEvent *event) {
        if (enableEventTracking && self->hasListeners) {
            [self sendEventWithName:@"TVSDKEvent" body:@{
                @"name": event.name,
                @"params": event.params
            }];
        }
    }];
}

RCT_EXPORT_METHOD(startIdCapturing:(NSDictionary *)configDict
                  withResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    TVIdCardConfiguration *config = [TVIdCardConfiguration dictToObjWithDict: configDict];
    dispatch_async(dispatch_get_main_queue(), ^{

        UIViewController *mainVc =
        [TrustVisionSdkWrapper
         startIdCapturingWithConfiguration:config
         framesRecordedCallback:^(NSString *batchId, NSDictionary<NSString *,id> *frames, NSDictionary<NSString *,id> *metadata, NSArray<NSString *> *currentBatchIds) {
            if (self->hasListeners) { // Only send events if anyone is listening
                NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
                dictionary[@"batchId"] = batchId;
                dictionary[@"metadata"] = metadata;
                [dictionary addEntriesFromDictionary:frames];
                [self sendEventWithName:@"TVSDKFrameBatch" body: dictionary];
            }
        }
         success:^(TVDetectionResult * result) {
            resolve([result toDictionary]);

        }
                                                           failure:^(TVError * error) {
            [self rejectWithRejecter:reject TvError: error];
        }
                                                      cancellation:^{
            [self rejectWithCancelationErrorWithRejecter:reject];
        }];

        [self presentViewController:mainVc];
    });
}

RCT_EXPORT_METHOD(startSelfieCapturing:(NSDictionary *)configDict
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    TVSelfieConfiguration *config = [TVSelfieConfiguration dictToObjWithDict: configDict];

    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *mainVc =
        [TrustVisionSdkWrapper
         startSelfieCapturingWithConfiguration:config
         framesRecordedCallback:^(NSString *batchId, NSDictionary<NSString *,id> *frames, NSDictionary<NSString *,id> *metadata, NSArray<NSString *> *currentBatchIds) {
            if (self->hasListeners) { // Only send events if anyone is listening
                NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
                dictionary[@"batchId"] = batchId;
                dictionary[@"metadata"] = metadata;
                [dictionary addEntriesFromDictionary:frames];
                [self sendEventWithName:@"TVSDKFrameBatch" body: dictionary];
            }
        }
                                    success:^(TVDetectionResult *result) {
            resolve([result toDictionary]);
        }
                                    failure:^(TVError *error) {
            [self rejectWithRejecter:reject TvError: error];
        }
                                    cancellation:^{
            [self rejectWithCancelationErrorWithRejecter:reject];
        }];

        [self presentViewController:mainVc];
    });
}

// MARK: - Helpers
// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (void) rejectWithCancelationErrorWithRejecter: (RCTPromiseRejectBlock)reject {
    reject(@"sdk_canceled", @"sdk is canceled by user", NULL);
}

- (void) presentViewController: (UIViewController *)vc {
    vc.modalPresentationStyle = UIModalPresentationFullScreen;
    [[[[[UIApplication sharedApplication] delegate] window] rootViewController] presentViewController:vc animated:YES completion:nil];
}

- (void) rejectWithRejecter: (RCTPromiseRejectBlock)reject TvError: (TVError *)tvError {
    NSError *e = [NSError errorWithDomain:@"TrustVisionSDKError" code:[[tvError errorCode] integerValue] userInfo: nil];
    reject([tvError errorCode], [tvError description], e);
}

- (NSString *) getBase64StringFromImage: (UIImage *)image {
    NSData *imageData = UIImagePNGRepresentation(image);
    NSString *imageBase64 = [imageData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
    return imageBase64;
}

- (NSDictionary *)toDictionary: (NSObject *)obj {
    unsigned int count = 0;
    
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    objc_property_t *properties = class_copyPropertyList([obj class], &count);
    
    for (int i = 0; i < count; i++) {
        
        NSString *key = [NSString stringWithUTF8String:property_getName(properties[i])];
        id value = [obj valueForKey:key];
        
        if (value == nil) {
            // nothing todo
        }
        else if ([value isKindOfClass:[NSNumber class]]
                 || [value isKindOfClass:[NSString class]]
                 || [value isKindOfClass:[NSDictionary class]]
                 || [value isKindOfClass:[NSData class]]) {
            // TODO: extend to other types
            [dictionary setObject:value forKey:key];
        }
        else if ([value isKindOfClass:[UIImage class]]) {
            NSString *base64 = [self getBase64StringFromImage: value];
            [dictionary setObject:base64 forKey:key];
        }
        else if ([value isKindOfClass:[NSObject class]]) {
            [dictionary setObject:[self toDictionary: value] forKey:key];
        }
        else {
            NSLog(@"Invalid type for %@ (%@)", NSStringFromClass([obj class]), key);
        }
    }
    
    return dictionary;
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTrustVisionSpecJSI>(params);
}
#endif

@end
