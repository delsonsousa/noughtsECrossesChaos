import React from 'react';
import { View } from 'react-native';
import { getBannerAdId, getGoogleMobileAdsModule } from '../utils/ads';

export const AdBanner: React.FC = () => {
  const ads = getGoogleMobileAdsModule();

  if (ads == null) {
    return null;
  }

  const { BannerAd, BannerAdSize } = ads;

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
