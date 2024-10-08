package com.codewitharun.gaao;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;


public class StoragePermissionModule extends ReactContextBaseJavaModule {
    public static final String NAME = "StoragePermissionModule";
    private final ReactApplicationContext reactContext;
    private static final int STORAGE_PERMISSION_CODE = 101;

    public StoragePermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void checkStoragePermission(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            int writePermissionCheck = ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.WRITE_EXTERNAL_STORAGE);
            int readPermissionCheck = ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.READ_EXTERNAL_STORAGE);
            
            if (writePermissionCheck == PackageManager.PERMISSION_GRANTED && readPermissionCheck == PackageManager.PERMISSION_GRANTED) {
                promise.resolve(true);  // Both permissions granted
            } else {
                promise.resolve(false);  // One or both permissions not granted
            }
        } else {
            promise.reject("ERROR", "Activity is null");
        }
    }

    @ReactMethod
    public void requestStoragePermission(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            int writePermissionCheck = ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.WRITE_EXTERNAL_STORAGE);
            int readPermissionCheck = ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.READ_EXTERNAL_STORAGE);
            
            if (writePermissionCheck == PackageManager.PERMISSION_GRANTED && readPermissionCheck == PackageManager.PERMISSION_GRANTED) {
                promise.resolve(true);  // Permissions already granted
            } else {
                ActivityCompat.requestPermissions(currentActivity, new String[]{
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                }, STORAGE_PERMISSION_CODE);
                promise.resolve(false);  // Permissions requested
            }
        } else {
            promise.reject("ERROR", "Activity is null");
        }
    }
}

