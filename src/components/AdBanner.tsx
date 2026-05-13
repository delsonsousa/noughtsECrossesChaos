import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getBannerAdId } from '../utils/ads';

export const AdBanner: React.FC = () => {
  return (
    <View style={{ alignItems: 'center', paddingBottom: 4 }}>
      <BannerAd
        unitId={getBannerAdId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
};
