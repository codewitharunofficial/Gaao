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
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import android.net.Uri;

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

            try {
                audioFilePath = URLDecoder.decode(audioFilePath, StandardCharsets.UTF_8.toString());

                String outputPath = getCacheFilePath("processed_preset_" + System.currentTimeMillis() + ".wav");
                String ffmpegCommand = generateFFmpegCommandForPreset(audioFilePath, outputPath, presetName);

                Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

                FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
                if (session.getReturnCode().isSuccess()) {

                    promise.resolve(outputPath);
                } else {
                    promise.reject("Error applying reverb preset: " + session.getOutput());
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding file URI");
            }

        } catch (Exception e) {
            promise.reject("Error applying reverb preset", e);
        }
    }

    @ReactMethod
    public void applyManualReverb(String inputFilePath, String outputFilePath, ReadableMap reverbSettings,
            Promise promise) {
        try {
            try {
                inputFilePath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
                outputFilePath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
                double delay = reverbSettings.getDouble("delay") / 100.0;
                double decay = reverbSettings.getDouble("decay") / 100.0;
                double wetLevel = reverbSettings.getDouble("wetLevel") / 100.0;
                double dryLevel = reverbSettings.getDouble("dryLevel") / 100.0;

                String ffmpegCommand = String.format(
                        "-i %s -af \"aecho=%.2f:%.2f:%.2f:%.2f\" %s",
                        inputFilePath,
                        delay,
                        decay,
                        wetLevel,
                        dryLevel,
                        outputFilePath);

                Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

                FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

                if (ReturnCode.isSuccess(session.getReturnCode())) {

                    promise.resolve(outputFilePath);
                } else {
                    promise.reject("REVERB_ERROR", "Error applying reverb: " + session.getOutput());
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
            }

        } catch (Exception e) {
            promise.reject("REVERB_ERROR", "Exception during reverb processing", e);
        }
    }

    private String generateFFmpegCommandForPreset(String inputFilePath, String outputFilePath, String presetName) {

        try {
            inputFilePath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
            outputFilePath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
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
        } catch (UnsupportedEncodingException e) {
            throw new Error("URI Decoding Error", e);
        }

    }

    @ReactMethod
    public void applyCompressorPreset(String audioFilePath, String presetName, Promise promise) {
        try {

            try {
                audioFilePath = URLDecoder.decode(audioFilePath, StandardCharsets.UTF_8.toString());
                String outputPath = getCacheFilePath("compressed_preset_" + System.currentTimeMillis() + ".wav");
                String ffmpegCommand = generateFFmpegCommandForCompressorPreset(audioFilePath, outputPath, presetName);

                Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

                FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
                if (session.getReturnCode().isSuccess()) {

                    promise.resolve(outputPath);
                } else {
                    promise.reject("Error applying compressor preset: " + session.getOutput());
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
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

            try {
                inputFilePath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
                outputFilePath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
                double ratio = compressorSettings.getDouble("ratio");
                double threshold = compressorSettings.getDouble("threshold");
                double attack = compressorSettings.getDouble("attack");
                double release = compressorSettings.getDouble("release") / 1000;
                double makeupGain = compressorSettings.getDouble("makeupGain") / 1000;

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
                    // throw new Error(session.getOutput());
                    promise.reject("COMPRESSOR_ERROR", "Error applying compressor");
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
            }

        } catch (Exception e) {
            promise.reject("COMPRESSOR_ERROR", "Exception during compressor processing", e);
        }
    }

    // Equalizer Presets
    @ReactMethod
    public void applyEqualizerPreset(String audioFilePath, String presetName, Promise promise) {
        try {
            try {
                audioFilePath = URLDecoder.decode(audioFilePath, StandardCharsets.UTF_8.toString());
                String outputPath = getCacheFilePath("equalized_preset_" + System.currentTimeMillis() + ".wav");
                String ffmpegCommand = generateFFmpegCommandForEqualizerPreset(audioFilePath, outputPath, presetName);

                Log.i("FFmpeg Command", ffmpegCommand); // Log the FFmpeg command

                FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
                if (session.getReturnCode().isSuccess()) {

                    promise.resolve(outputPath);
                } else {
                    promise.reject("Error applying equalizer preset: " + session.getOutput());
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
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
            try {
                inputFilePath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
                outputFilePath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
                double bassGain = eqSettings.getDouble("bassGain");
                double midGain = eqSettings.getDouble("midGain");
                double trebleGain = eqSettings.getDouble("trebleGain");

                String ffmpegCommand = String.format(
                        "-i %s -af \"equalizer=f=60:width_type=h:width=50:g=%.2f,equalizer=f=1000:width_type=h:width=50:g=%.2f,equalizer=f=10000:width_type=h:width=50:g=%.2f\" -c:a pcm_s16le %s",
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
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
            }
        } catch (Exception e) {

            promise.reject("EQUALIZER_ERROR", "Exception during equalizer processing", e);
        }
    }

    // Manual Sync Method
    @ReactMethod
    public void applyDelay(String filePath, String outputPath, double delaySeconds, Promise promise) {
        try {
            try {
                filePath = URLDecoder.decode(filePath, StandardCharsets.UTF_8.toString());
                outputPath = URLDecoder.decode(outputPath, StandardCharsets.UTF_8.toString());
                String ffmpegCommand;
                if (delaySeconds < 0) {
                    // Negative delay: trim the start of the audio
                    ffmpegCommand = String.format(
                            "-i %s -ss %s -c copy %s",
                            filePath,
                            String.valueOf(-delaySeconds), // Convert double to string
                            outputPath);
                } else {
                    // Positive delay: add silence or shift audio forward
                    ffmpegCommand = String.format(
                            "-i %s -af \"adelay=%s|%s\" %s",
                            filePath,
                            String.valueOf((int) (delaySeconds * 1000)), // Convert to milliseconds and then to string
                            String.valueOf((int) (delaySeconds * 1000)), // Same delay for all channels
                            outputPath);
                }

                FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

                if (ReturnCode.isSuccess(session.getReturnCode())) {
                    promise.resolve(outputPath);
                } else {
                    promise.reject("DELAY_ERROR", "Error applying delay");
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
            }

        } catch (Exception e) {
            promise.reject("DELAY_ERROR", "Exception during delay processing", e);
        }
    }

    // Helper Methods for FFmpeg Commands

    private String generateFFmpegCommandForCompressorPreset(String inputFilePath, String outputFilePath,
            String presetName) {
        try {
            String inputPath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
            String outputPath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
            switch (presetName) {
                case "LightCompression":
                    return "-i " + inputPath + " -af \"acompressor=threshold=-20dB:ratio=2:attack=5:release=50\" "
                            + outputPath;
                case "MediumCompression":
                    return "-i " + inputPath + " -af \"acompressor=threshold=-25dB:ratio=4:attack=10:release=100\" "
                            + outputPath;
                case "HeavyCompression":
                    return "-i " + inputPath + " -af \"acompressor=threshold=-30dB:ratio=8:attack=15:release=200\" "
                            + outputPath;
                case "VocalBoost":
                    return "-i " + inputPath
                            + " -af \"acompressor=threshold=-18dB:ratio=6:attack=10:release=100:makeup=8dB\" "
                            + outputPath;
                default:
                    return "-i " + inputPath + " -af \"acompressor=threshold=-25dB:ratio=4:attack=10:release=100\" "
                            + outputPath;
            }
        } catch (UnsupportedEncodingException e) {
            throw new Error("URI Decoding Error", e);
        }

    }

    private String generateFFmpegCommandForEqualizerPreset(String inputFilePath, String outputFilePath,
            String presetName) {
        try {
            inputFilePath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
            outputFilePath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
            switch (presetName) {
                case "BassBoost":
                    return "-i " + inputFilePath + " -af \"equalizer=f=100:width_type=h:width=2:g=10\" "
                            + outputFilePath;
                case "MidBoost":
                    return "-i " + inputFilePath + " -af \"equalizer=f=1000:width_type=h:width=2:g=10\" "
                            + outputFilePath;
                case "TrebleBoost":
                    return "-i " + inputFilePath + " -af \"equalizer=f=10000:width_type=h:width=2:g=10\" "
                            + outputFilePath;
                case "VocalEnhance":
                    return "-i " + inputFilePath
                            + " -af \"equalizer=f=300:width_type=h:width=2:g=6,equalizer=f=3000:width_type=h:width=2:g=6\" "
                            + outputFilePath;
                default:
                    return "-i " + inputFilePath + " -af \"equalizer=f=1000:width_type=h:width=2:g=3\" "
                            + outputFilePath;
            }
        } catch (UnsupportedEncodingException e) {
            throw new Error("URI Decoding Error", e);
        }

    }

    @ReactMethod
    public void mixMusicAndVocals(String musicFilePath, String vocalFilePath, double musicVolume, double vocalVolume,
            Promise promise) {
        try {

            try {
                String inputFilePath = URLDecoder.decode(musicFilePath, StandardCharsets.UTF_8.toString());
                String vocalPath = URLDecoder.decode(vocalFilePath, StandardCharsets.UTF_8.toString());
                String outputPath = getCacheFilePath("mixed_output_" + System.currentTimeMillis() + ".wav");

                String convertMusicPath = getCacheFilePath("converted_music" + System.currentTimeMillis() + ".wav");

                String convertMusicCommand = String.format("-i %s -acodec pcm_s16le -ar 44100 -ac 2 %s", inputFilePath,
                        convertMusicPath);
                        System.out.println(convertMusicCommand);

                FFmpegSession convertSession = FFmpegKit.execute(convertMusicCommand);

                if (ReturnCode.isSuccess(convertSession.getReturnCode())) {

                    String ffmpegCommand = String.format(
                            "-i %s -i %s -filter_complex \"[1:a]adelay=%d|%d,volume=%.2f[a1];[0:a]volume=%.2f[a0];[a0][a1]amix=inputs=2:duration=longest:dropout_transition=2\" %s",
                            convertMusicPath,
                            vocalPath,
                            vocalVolume,
                            musicVolume,
                            outputPath);

                    FFmpegSession session = FFmpegKit.execute(ffmpegCommand);

                    if (ReturnCode.isSuccess(session.getReturnCode())) {
                        promise.resolve(outputPath);
                    } else {
                        promise.reject("MIXING_ERROR", "Error mixing music and vocals: " + session.getOutput());
                    }
                } else {
                    promise.reject("Conversion_Error",
                            "Error While Converting mp3 to Wav" + convertSession.getOutput());
                }

            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
                throw new Error(e);
            }

        } catch (Exception e) {
            promise.reject("MIXING_ERROR", "Exception during mixing", e);
            throw new Error(e);
        }
    }

    @ReactMethod
    public void applyMasteringPreset(String inputFilePath, String outputFilePath, String presetName, Promise promise) {
        try {
            try {
                String inputPath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
                String outputPath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
                String ffmpegCommand = buildMasteringPresetCommand(inputPath, outputPath, presetName);
                FFmpegSession session = FFmpegKit.execute(ffmpegCommand);
                if (ReturnCode.isSuccess(session.getReturnCode())) {
                    promise.resolve(outputFilePath);
                } else {
                    promise.reject("Error while mastering the track:" + session.getOutput());
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
            }
        } catch (Exception e) {
            promise.reject("Error applying mastering preset", e);
        }
    }

    @ReactMethod
    public void trimAudio(String inputFilePath, String outputFilePath, int startMs, int endMs, Promise promise) {
        try {
            try {
                String inputPath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
                String outputPath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
                String cmd = String.format("-i %s -ss %d -to %d -c copy %s", inputPath, startMs / 1000, endMs / 1000,
                        outputPath);

                FFmpegSession session = FFmpegKit.execute(cmd);

                if (ReturnCode.isSuccess(session.getReturnCode())) {
                    promise.resolve(outputFilePath);
                } else {

                    promise.reject("FFmpeg Error", "Trimming failed: " + session.getOutput());
                }
            } catch (UnsupportedEncodingException e) {
                promise.reject("URI Decoding Error", "Error While Decoding URI");
            }

        } catch (Exception e) {
            promise.reject("Error While Trimming Audio:", e);
        }
    }

    private String buildMasteringPresetCommand(String inputFilePath, String outputFilePath, String presetName) {
        // Implement different mastering presets based on the presetName
        try {
            inputFilePath = URLDecoder.decode(inputFilePath, StandardCharsets.UTF_8.toString());
            outputFilePath = URLDecoder.decode(outputFilePath, StandardCharsets.UTF_8.toString());
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
        } catch (UnsupportedEncodingException e) {
            throw new Error("An Error Occured while decoding file URI", e);
        }

    }

    private String getCacheFilePath(String fileName) {
        File cacheDir = reactContext.getCacheDir();
        File file = new File(cacheDir, fileName);
        return file.getAbsolutePath();
    }

}
