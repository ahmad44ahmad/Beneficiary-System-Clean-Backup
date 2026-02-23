/**
 * useVoiceAssistant — Custom hook for clinical voice recording and AI extraction
 *
 * Captures microphone audio via MediaRecorder API, sends it to the
 * voice-to-care-form Edge Function, and returns structured DailyCareForm data.
 */

import { useState, useRef, useCallback } from 'react';
import { supabase } from '../config/supabase';

/** Shape of the extracted form data returned by the Edge Function */
export interface VoiceExtractedFormData {
    shift?: 'صباحي' | 'مسائي' | 'ليلي';
    temperature?: number;
    pulse?: number;
    blood_pressure_systolic?: number;
    blood_pressure_diastolic?: number;
    oxygen_saturation?: number;
    blood_sugar?: number;
    weight?: number;
    mobility_today?: 'active' | 'limited' | 'bedridden';
    mood?: 'stable' | 'happy' | 'anxious' | 'aggressive' | 'depressed' | 'confused';
    notes?: string;
    incidents?: string;
    requires_followup?: boolean;
}

export interface UseVoiceAssistantReturn {
    /** Whether the microphone is currently recording */
    isRecording: boolean;
    /** Whether the audio is being processed by the AI */
    isProcessing: boolean;
    /** The extracted form data result (null until processing completes) */
    result: VoiceExtractedFormData | null;
    /** Error message if recording or processing failed */
    error: string | null;
    /** Duration of the current/last recording in seconds */
    recordingDuration: number;
    /** Start microphone recording */
    startRecording: () => Promise<void>;
    /** Stop recording and begin AI processing */
    stopRecording: () => void;
    /** Reset all state (result, error, duration) */
    reset: () => void;
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<VoiceExtractedFormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /** Convert a Blob to a base64 string (without the data URI prefix) */
    const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                // Strip the "data:audio/webm;base64," prefix
                const base64 = dataUrl.split(',')[1];
                if (base64) {
                    resolve(base64);
                } else {
                    reject(new Error('Failed to convert audio to base64'));
                }
            };
            reader.onerror = () => reject(new Error('FileReader error'));
            reader.readAsDataURL(blob);
        });
    }, []);

    /** Send the audio base64 to the Edge Function and extract form data */
    const processAudio = useCallback(async (audioBlob: Blob) => {
        setIsProcessing(true);
        setError(null);

        try {
            if (!supabase) {
                throw new Error('Supabase غير مُهيأ. تحقق من إعدادات البيئة.');
            }

            const audioBase64 = await blobToBase64(audioBlob);

            const { data, error: fnError } = await supabase.functions.invoke(
                'voice-to-care-form',
                {
                    body: {
                        audio_base64: audioBase64,
                        media_type: 'audio/webm',
                    },
                }
            );

            if (fnError) {
                throw new Error(fnError.message || 'فشل في معالجة التسجيل الصوتي');
            }

            if (!data?.success || !data?.form_data) {
                throw new Error(
                    data?.error || 'لم يتم استخراج بيانات من التسجيل الصوتي'
                );
            }

            setResult(data.form_data as VoiceExtractedFormData);
        } catch (err: unknown) {
            console.error('Voice assistant processing error:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'حدث خطأ غير متوقع أثناء معالجة التسجيل الصوتي'
            );
        } finally {
            setIsProcessing(false);
        }
    }, [blobToBase64]);

    /** Start microphone recording */
    const startRecording = useCallback(async () => {
        setError(null);
        setResult(null);
        setRecordingDuration(0);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000,
                },
            });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Stop duration timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // Stop all tracks on the stream
                streamRef.current?.getTracks().forEach((track) => track.stop());
                streamRef.current = null;

                // Combine chunks into a single blob and process
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm',
                });

                if (audioBlob.size > 0) {
                    processAudio(audioBlob);
                } else {
                    setError('التسجيل الصوتي فارغ. يرجى المحاولة مرة أخرى.');
                }
            };

            mediaRecorder.onerror = () => {
                setError('حدث خطأ في التسجيل الصوتي');
                setIsRecording(false);
            };

            // Collect data every second for reliable chunking
            mediaRecorder.start(1000);
            setIsRecording(true);

            // Start duration timer
            timerRef.current = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);
        } catch (err: unknown) {
            console.error('Microphone access error:', err);
            if (err instanceof DOMException && err.name === 'NotAllowedError') {
                setError(
                    'تم رفض إذن الميكروفون. يرجى السماح بالوصول إلى الميكروفون من إعدادات المتصفح.'
                );
            } else if (err instanceof DOMException && err.name === 'NotFoundError') {
                setError('لم يتم العثور على ميكروفون. تأكد من توصيل جهاز الصوت.');
            } else {
                setError('فشل في الوصول إلى الميكروفون');
            }
        }
    }, [processAudio]);

    /** Stop recording — triggers onstop which calls processAudio */
    const stopRecording = useCallback(() => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
        ) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    /** Reset all state to initial */
    const reset = useCallback(() => {
        // Stop any in-progress recording
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
        ) {
            mediaRecorderRef.current.stop();
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRecording(false);
        setIsProcessing(false);
        setResult(null);
        setError(null);
        setRecordingDuration(0);
        audioChunksRef.current = [];
        streamRef.current = null;
        mediaRecorderRef.current = null;
    }, []);

    return {
        isRecording,
        isProcessing,
        result,
        error,
        recordingDuration,
        startRecording,
        stopRecording,
        reset,
    };
}
