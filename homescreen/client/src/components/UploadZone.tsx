// UploadZone.tsx
// Design: Midnight Scholar - Drag-and-drop zone for audio files + Live Record button

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Mic,
  FileAudio,
  Sparkles,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadZoneProps {
  onUpload: (fileName: string) => void;
  courseColor: string;
}

export function UploadZone({ onUpload, courseColor }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find((f) =>
      ['audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/wav'].includes(f.type)
    );
    if (audioFile) {
      toast.success(`Uploading "${audioFile.name}"...`, { duration: 2000 });
      onUpload(audioFile.name.replace(/\.[^.]+$/, ''));
    } else {
      toast.error('Please upload an audio file (MP3, M4A, WAV)', { duration: 3000 });
    }
  }, [onUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Uploading "${file.name}"...`, { duration: 2000 });
      onUpload(file.name.replace(/\.[^.]+$/, ''));
    }
    e.target.value = '';
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      const mins = Math.floor(recordingTime / 60);
      const secs = recordingTime % 60;
      const duration = `${mins}m ${secs}s`;
      toast.success(`Recording saved (${duration})`, { duration: 2000 });
      onUpload(`Live Recording ${new Date().toLocaleDateString()}`);
      setRecordingTime(0);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
      toast.info('Recording started...', { duration: 2000 });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-3">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group',
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/15 hover:border-white/25 bg-white/3 hover:bg-white/5'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.m4a,.wav,audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Background image */}
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center transition-opacity group-hover:opacity-8"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663427534184/DZZ9ztwjDUmBqj43m2mmja/audio-wave-eLxMshiceeTTqVztREoj4t.webp)`,
          }}
        />

        <div className="relative flex flex-col items-center justify-center py-10 px-6 text-center">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300',
            isDragging
              ? 'bg-indigo-500/30 border border-indigo-400/50 scale-110'
              : 'bg-white/8 border border-white/12 group-hover:bg-white/12'
          )}>
            {isDragging ? (
              <FileAudio className="w-7 h-7 text-indigo-400" />
            ) : (
              <Upload className="w-7 h-7 text-white/40 group-hover:text-white/60 transition-colors" />
            )}
          </div>

          <p className="text-sm font-semibold text-white/70 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isDragging ? 'Drop your audio file here' : 'Upload Lecture Audio'}
          </p>
          <p className="text-xs text-white/30 mb-3">
            Drag & drop or click to browse · MP3, M4A, WAV supported
          </p>

          {/* Format badges */}
          <div className="flex gap-2">
            {['MP3', 'M4A', 'WAV'].map((fmt) => (
              <span
                key={fmt}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/40"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Record Button */}
      <button
        onClick={toggleRecording}
        className={cn(
          'w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border transition-all duration-300 font-semibold text-sm',
          isRecording
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
            : 'bg-white/5 border-white/12 text-white/60 hover:bg-white/8 hover:border-white/20 hover:text-white/80'
        )}
      >
        {isRecording ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
              <Radio className="w-4 h-4" />
            </div>
            <span>Recording Live</span>
            <span className="font-mono text-rose-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {formatTime(recordingTime)}
            </span>
            <span className="text-xs text-rose-400/60">· Click to stop</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>Start Live Record</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </>
        )}
      </button>
    </div>
  );
}
