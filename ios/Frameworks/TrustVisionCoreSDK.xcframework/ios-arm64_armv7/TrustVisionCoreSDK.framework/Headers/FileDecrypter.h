//
//  test.h
//  Pods
//
//  Created by Nguyen Vu on 3/17/21.
//

#import <Foundation/Foundation.h>
@interface FileDecrypter : NSObject
+ (NSData *) decryptWithData: (NSData *)data;
+ (NSData *) decryptFromFilePath: (NSString *)filePath;
+ (float) getBlurScoreOfImage: (UInt8 *)argb_bytes width: (int)width height: (int)height t: (int)t t_lwr:(int)t_lwr;
+ (UInt8 *) linearFilterOfImage: (UInt8 *)argb_bytes width: (int)width height: (int)height kernel: (NSArray *)kernel newWidth: (int *)newWidth newHeight: (int *)newHeight;
+ (void) getLaplacianAvgAndStdOfImage: (UInt8 *)argb_bytes width: (int)width height: (int)height avg: (float *)avg std: (float *)std;
//+ (void) scaleBilinear: (UInt32 *)src dst: (UInt32 *)dst width: (int)width height: (int)height scalex: (float)scalex scaley: (float)scaley;
+ (void) scaleBilinear: (uint32_t *)src dst: (uint32_t *)dst width: (int)width height: (int)height scalex: (float)scalex scaley: (float)scaley;
+ (void) cropAndScaleBilinear: (uint32_t *)src dst: (uint32_t *)dst startX: (int)startX startY: (int)startY rowInt32s: (int)rowBytes width: (int)width height: (int)height scalex: (float)scalex scaley: (float)scaley;

+ (UInt8 *) convertToGrayScale: (UInt8 *)argb_bytes width: (int)width height: (int)height;
@end
