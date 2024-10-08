package com.codewitharun.gaao;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.codewitharun.gaao.StoragePermissionModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class StoragePermissionPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        // Register your StoragePermissionModule here
        modules.add(new StoragePermissionModule(reactContext));

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();  // If you don't have any view managers
    }
}

