class AdManager {
  constructor(canvas, ctx, onAdComplete) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onAdComplete = onAdComplete;

    this.adDisplayContainer = null;
    this.adsLoader = null;
    this.adsManager = null;

    this.initializeAdContainer();
    this.initializeAdsLoader();
  }

  initializeAdContainer() {
    try {
      const adContainerElement = document.getElementById('ad-container');
      adContainerElement.style.display = 'flex';
      if (!adContainerElement) {
        throw new Error('Ad container element not found');
      }

      this.adDisplayContainer = new google.ima.AdDisplayContainer(
        adContainerElement
      );

      this.adDisplayContainer.initialize();
    } catch (e) {
      console.error('Error initializing AdDisplayContainer:', e);
    }
  }

  initializeAdsLoader() {
    try {
      this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

      this.adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        this.onAdsManagerLoaded.bind(this),
        false
      );

      this.adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        this.onAdError.bind(this),
        false
      );
    } catch (e) {
      console.error('Error initializing AdsLoader:', e);
    }
  }

  loadAd() {
    const adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl =
      'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpreonly&ciu_szs=300x250%2C728x90&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&correlator=';
    adsRequest.linearAdSlotWidth = this.canvas.width;
    adsRequest.linearAdSlotHeight = this.canvas.height;
    adsRequest.nonLinearAdSlotWidth = this.canvas.width;
    adsRequest.nonLinearAdSlotHeight = this.canvas.height;

    try {
      this.adsLoader.requestAds(adsRequest);
    } catch (e) {
      console.error('Error requesting ads:', e);
    }
  }

  onAdsManagerLoaded(event) {
    try {
      this.adsManager = event.getAdsManager();

      if (!this.adsManager) {
        throw new Error('AdsManager is not available');
      }

      this.adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        this.onAdCompleteHandler.bind(this),
        false
      );

      this.adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        this.onAdError.bind(this),
        false
      );

      this.adsManager.init(
        this.canvas.width,
        this.canvas.height,
        google.ima.ViewMode.NORMAL
      );
      this.adsManager.start();
    } catch (e) {
      console.error('Error initializing AdsManager:', e);
      this.onAdComplete();
    }
  }

  onAdError(event) {
    console.error('Ad error:', event.getError());
    this.onAdComplete();
  }

  onAdCompleteHandler() {
    console.log('Ad finished');
    if (typeof this.onAdComplete === 'function') {
      const adContainerElement = document.getElementById('ad-container');
      adContainerElement.style.display = 'none';
      this.onAdComplete();
    }
  }
}
