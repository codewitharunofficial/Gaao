package com.codewitharun.gaao;

import android.util.Log;
import com.arthenica.ffmpegkit.FFmpegKit;
import com.arthenica.ffmpegkit.FFmpegSession;
import com.arthenica.ffmpegkit.ReturnCode;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.File;

public class AudioProcessorModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public AudioProcessorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

    }

    @Override
    public String getName() {
        return "AudioProcessor";
    }

    @ReactMethod
    public void applyReverbPreset(String audioFilePath, String presetName, Promise promise) {
        try {
            String outputPath = getCacheFilePath("processed_preset_" + System.currentTimeMillis() + ".wav");
            String ffmpegCommand = generateFFmpegCommandForPreset(audioFilePath, outputPath, presetName);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
            if (session.getReturnCode().isSuccess()) {

                promise.resolve(outputPath);
            } else {
                promise.reject("Error applying reverb preset: " + session.getOutput());
            }
        } catch (Exception e) {
            promise.reject("Error applying reverb preset", e);
        }
    }

    @ReactMethod
    public void applyManualReverb(String inputFilePath, String outputFilePath, ReadableMap reverbSettings,
            Promise promise) {
        try {
            double roomSize = reverbSettings.getDouble("roomSize") / 100.0;
            double damping = reverbSettings.getDouble("damping") / 100.0;
            double wetLevel = reverbSettings.getDouble("wetLevel") / 100.0;
            double dryLevel = reverbSettings.getDouble("dryLevel") / 100.0;

            String ffmpegCommand = String.format(
                    "-i %s -af \"aecho=0.8:0.88:6:0.4,areverb=wet=%.2f:dry=%.2f:room=%.2f:damping=%.2f\" %s",
                    inputFilePath,
                    wetLevel,
                    dryLevel,
                    roomSize,
                    damping,
                    outputFilePath);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

            if (ReturnCode.isSuccess(session.getReturnCode())) {

                promise.resolve(outputFilePath);
            } else {
                promise.reject("REVERB_ERROR", "Error applying reverb: " + session.getOutput());
            }
        } catch (Exception e) {
            promise.reject("REVERB_ERROR", "Exception during reverb processing", e);
        }
    }

    private String generateFFmpegCommandForPreset(String inputFilePath, String outputFilePath, String presetName) {
        switch (presetName) {
            case "SmallRoom":
                return "-i " + inputFilePath + " -af \"aecho=0.6:0.7:60:0.3, highpass=f=300, lowpass=f=3000\" "
                        + outputFilePath;
            case "LargeHall":
                return "-i " + inputFilePath + " -af \"aecho=0.5:0.6:1000:0.4, highpass=f=200, lowpass=f=2000\" "
                        + outputFilePath;
            case "Cathedral":
                return "-i " + inputFilePath + " -af \"aecho=0.4:0.5:1200:0.5, highpass=f=150, lowpass=f=2500\" "
                        + outputFilePath;
            case "Plate":
                return "-i " + inputFilePath + " -af \"aecho=0.5:0.6:100:0.25, highpass=f=300, lowpass=f=4000\" "
                        + outputFilePath;
            case "BrightRoom":
                return "-i " + inputFilePath + " -af \"aecho=0.6:0.7:50:0.2, highpass=f=400, lowpass=f=5000\" "
                        + outputFilePath;
            case "DarkHall":
                return "-i " + inputFilePath + " -af \"aecho=0.6:0.7:800:0.4, highpass=f=100, lowpass=f=2000\" "
                        + outputFilePath;
            case "Vintage":
                return "-i " + inputFilePath + " -af \"aecho=0.5:0.6:300:0.3, highpass=f=200, lowpass=f=4000\" "
                        + outputFilePath;
            case "Ambient":
                return "-i " + inputFilePath + " -af \"aecho=0.5:0.6:500:0.35, highpass=f=150, lowpass=f=3000\" "
                        + outputFilePath;
            default:
                return "-i " + inputFilePath + " -af \"aecho=0.5:0.6:60:0.3, highpass=f=300, lowpass=f=3000\" "
                        + outputFilePath;
        }
    }

    @ReactMethod
    public void applyCompressorPreset(String audioFilePath, String presetName, Promise promise) {
        try {
            String outputPath = getCacheFilePath("compressed_preset_" + System.currentTimeMillis() + ".wav");
            String ffmpegCommand = generateFFmpegCommandForCompressorPreset(audioFilePath, outputPath, presetName);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
            if (session.getReturnCode().isSuccess()) {

                promise.resolve(outputPath);
            } else {
                promise.reject("Error applying compressor preset: " + session.getOutput());
            }
        } catch (Exception e) {
            promise.reject("Error applying compressor preset", e);
        }
    }

    // Manual Compressor
    @ReactMethod
    public void applyManualCompressor(String inputFilePath, String outputFilePath, ReadableMap compressorSettings,
            Promise promise) {
        try {
            double ratio = compressorSettings.getDouble("ratio");
            double threshold = compressorSettings.getDouble("threshold");
            double attack = compressorSettings.getDouble("attack");
            double release = compressorSettings.getDouble("release");
            double makeupGain = compressorSettings.getDouble("makeupGain");

            String ffmpegCommand = String.format(
                    "-i %s -af \"acompressor=ratio=%.2f:threshold=%.2f:attack=%.2f:release=%.2f:makeup=%.2f\" %s",
                    inputFilePath,
                    ratio,
                    threshold,
                    attack,
                    release,
                    makeupGain,
                    outputFilePath);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

            if (ReturnCode.isSuccess(session.getReturnCode())) {

                promise.resolve(outputFilePath);
            } else {
                promise.reject("COMPRESSOR_ERROR", "Error applying compressor");
            }
        } catch (Exception e) {
            promise.reject("COMPRESSOR_ERROR", "Exception during compressor processing", e);
        }
    }

    // Equalizer Presets
    @ReactMethod
    public void applyEqualizerPreset(String audioFilePath, String presetName, Promise promise) {
        try {
            String outputPath = getCacheFilePath("equalized_preset_" + System.currentTimeMillis() + ".wav");
            String ffmpegCommand = generateFFmpegCommandForEqualizerPreset(audioFilePath, outputPath, presetName);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
            if (session.getReturnCode().isSuccess()) {

                promise.resolve(outputPath);
            } else {
                promise.reject("Error applying equalizer preset: " + session.getOutput());
            }
        } catch (Exception e) {
            promise.reject("Error applying equalizer preset", e);
        }
    }

    // Manual Equalizer
    @ReactMethod
    public void applyManualEqualizer(String inputFilePath, String outputFilePath, ReadableMap eqSettings,
            Promise promise) {
        try {
            double bassGain = eqSettings.getDouble("bassGain");
            double midGain = eqSettings.getDouble("midGain");
            double trebleGain = eqSettings.getDouble("trebleGain");

            String ffmpegCommand = String.format(
                    "-i %s -af \"equalizer=f=100:width_type=h:width=2:g=%.2f,equalizer=f=1000:width_type=h:width=2:g=%.2f,equalizer=f=10000:width_type=h:width=2:g=%.2f\" %s",
                    inputFilePath,
                    bassGain,
                    midGain,
                    trebleGain,
                    outputFilePath);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

            if (ReturnCode.isSuccess(session.getReturnCode())) {

                promise.resolve(outputFilePath);
            } else {
                promise.reject("EQUALIZER_ERROR", "Error applying equalizer");
            }
        } catch (Exception e) {
            promise.reject("EQUALIZER_ERROR", "Exception during equalizer processing", e);
        }
    }

    // Manual Sync Method
    @ReactMethod
    public void syncAudio(String inputFilePath, String referenceFilePath, String outputFilePath, double delayInSeconds,
            Promise promise) {
        try {
            String ffmpegCommand = String.format(
                    "-i %s -itsoffset %.2f -i %s -map 1:a -map 0:a -c copy %s",
                    inputFilePath,
                    delayInSeconds,
                    referenceFilePath,
                    outputFilePath);

            Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

            if (ReturnCode.isSuccess(session.getReturnCode())) {

                promise.resolve(outputFilePath);
            } else {
                promise.reject("SYNC_ERROR", "Error syncing audio");
            }
        } catch (Exception e) {
            promise.reject("SYNC_ERROR", "Exception during audio sync", e);
        }
    }

    // Helper Methods for FFmpeg Commands

    private String generateFFmpegCommandForCompressorPreset(String inputFilePath, String outputFilePath,
            String presetName) {
        switch (presetName) {
            case "LightCompression":
                return "-i " + inputFilePath + " -af \"acompressor=threshold=-20dB:ratio=2:attack=5:release=50\" "
                        + outputFilePath;
            case "MediumCompression":
                return "-i " + inputFilePath + " -af \"acompressor=threshold=-25dB:ratio=4:attack=10:release=100\" "
                        + outputFilePath;
            case "HeavyCompression":
                return "-i " + inputFilePath + " -af \"acompressor=threshold=-30dB:ratio=8:attack=15:release=200\" "
                        + outputFilePath;
            case "VocalBoost":
                return "-i " + inputFilePath
                        + " -af \"acompressor=threshold=-18dB:ratio=6:attack=10:release=100:makeup=8dB\" "
                        + outputFilePath;
            default:
                return "-i " + inputFilePath + " -af \"acompressor=threshold=-25dB:ratio=4:attack=10:release=100\" "
                        + outputFilePath;
        }
    }

    private String generateFFmpegCommandForEqualizerPreset(String inputFilePath, String outputFilePath,
            String presetName) {
        switch (presetName) {
            case "BassBoost":
                return "-i " + inputFilePath + " -af \"equalizer=f=100:width_type=h:width=2:g=10\" " + outputFilePath;
            case "MidBoost":
                return "-i " + inputFilePath + " -af \"equalizer=f=1000:width_type=h:width=2:g=10\" " + outputFilePath;
            case "TrebleBoost":
                return "-i " + inputFilePath + " -af \"equalizer=f=10000:width_type=h:width=2:g=10\" " + outputFilePath;
            case "VocalEnhance":
                return "-i " + inputFilePath
                        + " -af \"equalizer=f=300:width_type=h:width=2:g=6,equalizer=f=3000:width_type=h:width=2:g=6\" "
                        + outputFilePath;
            default:
                return "-i " + inputFilePath + " -af \"equalizer=f=1000:width_type=h:width=2:g=3\" " + outputFilePath;
        }
    }

    @ReactMethod
    public void mixTracks(String musicFilePath, String vocalFilePath, String outputFilePath, Promise promise) {
        try {
            // FFmpeg command to mix audio tracks
            String ffmpegCommand = String.format(
                    "-i %s -i %s -filter_complex amix=inputs=2:duration=first:dropout_transition=2 %s",
                    musicFilePath,
                    vocalFilePath,
                    outputFilePath);

            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

            if (ReturnCode.isSuccess(session.getReturnCode())) {
                promise.resolve(outputFilePath);
            } else {
                promise.reject("MIXING_ERROR", "Error mixing tracks: " + session.getOutput());
            }
        } catch (Exception e) {
            promise.reject("MIXING_ERROR", "Exception during mixing", e);
        }
    }

    @ReactMethod
    public void applyMasteringPreset(String inputFilePath, String outputFilePath, String presetName, Promise promise) {
        try {
            String ffmpegCommand = buildMasteringPresetCommand(inputFilePath, outputFilePath, presetName);
            FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
            if (ReturnCode.isSuccess(session.getReturnCode())) {
                promise.resolve(outputFilePath);
            } else {
                promise.reject("Error while mastering the track:" + session.getOutput());
            }
        } catch (Exception e) {
            promise.reject("Error applying mastering preset", e);
        }
    }

    private String buildMasteringPresetCommand(String inputFilePath, String outputFilePath, String presetName) {
        // Implement different mastering presets based on the presetName
        switch (presetName) {
            case "Bright":
                return "-i " + inputFilePath + " -af \"treble=g=5\" -y " + outputFilePath;
            case "Warm":
                return "-i " + inputFilePath + " -af \"bass=g=5\" -y " + outputFilePath;
            case "Balanced":
                return "-i " + inputFilePath
                        + " -af \"equalizer=f=1000:width_type=h:width=200:g=3,bass=g=3,treble=g=3\" -y "
                        + outputFilePath;
            default:
                return "-i " + inputFilePath + " -y " + outputFilePath; // No processing
        }
    }

    private String getCacheFilePath(String fileName) {
        File cacheDir = reactContext.getCacheDir();
        File file = new File(cacheDir, fileName);
        return file.getAbsolutePath();
    }

}
