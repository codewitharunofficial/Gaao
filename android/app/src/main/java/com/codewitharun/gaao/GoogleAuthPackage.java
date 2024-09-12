package com.codewitharun.gaao;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.codewitharun.gaao.GoogleAuthModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class GoogleAuthPackage implements ReactPackage {

    @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Collections.singletonList(new GoogleAuthModule(reactContext));
  }

    @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
