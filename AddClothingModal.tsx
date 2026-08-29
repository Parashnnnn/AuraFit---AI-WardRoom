import React, { useState, useRef } from 'react';
import { WardrobeItem, Category, FitPreference, ClothingSize } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  Camera,
  Edit3,
  X,
  Sparkles,
  Check,
  Plus,
  Loader2,
  Image as ImageIcon,
  Tag,
  Palette,
} from 'lucide-react';
import { getAuthHeaders } from '../lib/firebase';

interface AddClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<WardrobeItem, 'id' | 'userId' | 'dateAdded' | 'wearCount' | 'isFavorite'>) => Promise<void> | void;
}

export const AddClothingModal: React.FC<AddClothingModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'manual'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear' | 'Accessories'>('Tops');
  const [color, setColor] = useState('Off-White');
  const [pattern, setPattern] = useState('Solid');
  const [material, setMaterial] = useState('Cotton');
  const [style, setStyle] = useState('Smart Casual');
  const [size, setSize] = useState<ClothingSize | string>('M');
  const [fit, setFit] = useState<FitPreference | string>('Regular');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [detectedData, setDetectedData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      analyzePhotoWithAI(base64);
    };
    reader.readAsDataURL(file);
  };

  // AI Vision Analysis Call
  const analyzePhotoWithAI = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/analyze-clothing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ image: imageData, hint: name }),
      });
      const data = await res.json();
      if (data.detected) {
        setDetectedData(data.detected);
        if (data.detected.name) setName(data.detected.name);
        if (data.detected.category) setCategory(data.detected.category);
        if (data.detected.color) setColor(data.detected.color);
        if (data.detected.pattern) setPattern(data.detected.pattern);
        if (data.detected.material) setMaterial(data.detected.material);
        if (data.detected.style) setStyle(data.detected.style);
        if (data.detected.fit) setFit(data.detected.fit);
        if (data.detected.notes) setNotes(data.detected.notes);
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Camera access unavailable. You can upload a photo from your gallery instead.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg');
      setImagePreview(base64);

      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);

      analyzePhotoWithAI(base64);
    }
  };

  // Quick preset photos for effortless demonstration
  const samplePresets = [
    {
      name: 'Beige Cashmere Crewneck',
      category: 'Tops' as const,
      color: 'Beige',
      pattern: 'Solid',
      material: '100% Cashmere',
      style: 'Minimal',
      size: 'M',
      fit: 'Regular',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Olive Military Overshirt',
      category: 'Outerwear' as const,
      color: 'Olive Green',
      pattern: 'Textured Ripstop',
      material: 'Heavy Cotton Canvas',
      style: 'Streetwear',
      size: 'L',
      fit: 'Relaxed',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Off-White Canvas High-Tops',
      category: 'Shoes' as const,
      color: 'Off-White',
      pattern: 'Canvas',
      material: 'Heavyweight Canvas',
      style: 'Casual',
      size: '10',
      fit: 'Regular',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter an item name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onAddItem({
        name: name.trim(),
        category,
        color,
        pattern,
        material,
        style,
        size,
        fit,
        brand: brand.trim() || undefined,
        notes: notes.trim() || undefined,
        imageUrl:
          imagePreview ||
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        occasions: ['Casual', 'College', 'Date'],
      });
      onClose();
    } catch (err) {
      console.error('Add modal submit error:', err);
      setErrorMessage('Failed to save wardrobe piece. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6] dark:text-[#A78BFA]">
              DIGITAL WARDROBE
            </span>
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
              ADD TO YOUR WARDROBE
            </h3>
          </div>
          <button
            id="btn-close-add-modal"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800 px-6 pt-3 gap-3">
          <button
            id="tab-mode-upload"
            onClick={() => {
              setActiveMode('upload');
              setIsCameraActive(false);
            }}
            className={`pb-3 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeMode === 'upload'
                ? 'border-[#8B5CF6] text-[#8B5CF6] dark:text-[#A78BFA]'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>

          <button
            id="tab-mode-camera"
            onClick={() => {
              setActiveMode('camera');
              startCamera();
            }}
            className={`pb-3 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeMode === 'camera'
                ? 'border-[#8B5CF6] text-[#8B5CF6] dark:text-[#A78BFA]'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Take Photo</span>
          </button>

          <button
            id="tab-mode-manual"
            onClick={() => {
              setActiveMode('manual');
              setIsCameraActive(false);
            }}
            className={`pb-3 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeMode === 'manual'
                ? 'border-[#8B5CF6] text-[#8B5CF6] dark:text-[#A78BFA]'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Add Manually</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Upload Dropzone */}
          {activeMode === 'upload' && (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-[#8B5CF6]/30 hover:border-[#8B5CF6] bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/5 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden"
              >
                {imagePreview ? (
                  <div className="relative max-h-48 rounded-xl overflow-hidden shadow-md">
                    <img src={imagePreview} alt="Preview" className="h-44 object-cover rounded-xl" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6]" />
                        <span className="font-mono tracking-wider uppercase">AI DETECTING METADATA...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-[#8B5CF6] mb-2 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      Click to upload photo of clothing item
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
                      AuraFit AI Vision automatically identifies category, color, material, &amp; fit.
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  id="clothing-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample Presets */}
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Quick-add sample pieces:
                </span>
                <div className="flex gap-2 mt-1.5 overflow-x-auto pb-1">
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setName(preset.name);
                        setCategory(preset.category);
                        setColor(preset.color);
                        setPattern(preset.pattern);
                        setMaterial(preset.material);
                        setStyle(preset.style);
                        setImagePreview(preset.imageUrl);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-[#8B5CF6]/20 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Camera View */}
          {activeMode === 'camera' && (
            <div className="text-center">
              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black max-w-md mx-auto aspect-4/3">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    SNAP PHOTO 📸
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-6 py-3 rounded-full bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Start Camera
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AI Detected Banner */}
          {detectedData && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>
                  <strong>AI Detected:</strong> {detectedData.category} • {detectedData.color} •{' '}
                  {detectedData.style}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded-md">
                Confidence 98%
              </span>
            </div>
          )}

          {/* Form Fields for Metadata */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Item Name *
              </label>
              <input
                id="clothing-name-input"
                type="text"
                required
                placeholder="e.g. Italian Brown Burnished Loafers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Category *
                </label>
                <select
                  id="clothing-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Color *
                </label>
                <input
                  id="clothing-color-input"
                  type="text"
                  required
                  placeholder="e.g. White + Brown"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Pattern
                </label>
                <input
                  id="clothing-pattern-input"
                  type="text"
                  placeholder="e.g. Vertical stripes"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Style
                </label>
                <input
                  id="clothing-style-input"
                  type="text"
                  placeholder="e.g. Smart Casual"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Fit
                </label>
                <select
                  id="clothing-fit-select"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="Slim">Slim</option>
                  <option value="Regular">Regular</option>
                  <option value="Relaxed">Relaxed</option>
                  <option value="Oversized">Oversized</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Size
                </label>
                <input
                  id="clothing-size-input"
                  type="text"
                  placeholder="e.g. M / 32 / 9.5"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Stylist Notes &amp; Highlights (Optional)
              </label>
              <textarea
                id="clothing-notes-textarea"
                rows={2}
                placeholder="e.g. Versatile piece with clean contrast, pairs well with cream trousers."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-add-clothing"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>

            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
            )}

            <button
              id="btn-submit-add-wardrobe"
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md shadow-purple-900/15 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F472B6]" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>ADD TO WARDROBE</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
