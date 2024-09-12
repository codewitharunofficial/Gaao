package com.codewitharun.gaao;

import android.app.Activity;
import android.content.Intent;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

public class GoogleAuthModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int RC_SIGN_IN = 9001;
    private Callback successCallback;
    private Callback errorCallback;
    private GoogleSignInClient googleSignInClient;

    public GoogleAuthModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);

        // Configure Google Sign-In
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken("902634639407-pjcslc5pu3814mkrbimk0avbo6n35o9a.apps.googleusercontent.com")  // Replace with your client ID
                .build();
        googleSignInClient = GoogleSignIn.getClient(reactContext, gso);
    }

    @NonNull
    @Override
    public String getName() {
        return "GoogleAuthModule";
    }

    @ReactMethod
    public void signIn(Callback success, Callback error) {
        this.successCallback = success;
        this.errorCallback = error;

        Intent signInIntent = googleSignInClient.getSignInIntent();
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.startActivityForResult(signInIntent, RC_SIGN_IN);
        } else {
            errorCallback.invoke("Activity is null");
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                if (account != null) {
                    // Create a WritableMap to pass user details back to JS
                    WritableMap userDetails = Arguments.createMap();
                    userDetails.putString("name", account.getDisplayName());
                    userDetails.putString("email", account.getEmail());
                    userDetails.putString("photoUrl", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : null);

                    if(successCallback != null) {
                        successCallback.invoke(userDetails);
                        successCallback = null;
                    }
                    return;
                }
            } catch (ApiException e) {
                if(errorCallback != null){
                    errorCallback.invoke("Sign-in failed: " + e.getStatusCode());
                    errorCallback = null;
                }
                return;
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // No-op for now
    }
}

