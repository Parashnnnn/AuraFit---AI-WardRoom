import React, { useState, useRef } from 'react';
import { WardrobeItem, Category, FitPreference, ClothingSize } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  Camera,
  Edit3,
  Sparkles,
  Check,
  Plus,
  Loader2,
  Image as ImageIcon,
  ArrowLeft,
  Shirt,
  X,
  Tag,
  Palette,
  Layers,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { getAuthHeaders } from '../lib/firebase';

interface AddClothingViewProps {
  onAddItem: (item: Omit<WardrobeItem, 'id' | 'userId' | 'dateAdded' | 'wearCount' | 'isFavorite'>) => Promise<void> | void;
  onReturnHome: () => void;
  onNavigateToOutfits?: () => void;
}

export const AddClothingView: React.FC<AddClothingViewProps> = ({ onAddItem, onReturnHome, onNavigateToOutfits }) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'manual'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success Confirmation State
  const [lastAddedItem, setLastAddedItem] = useState<{
    name: string;
    category: Category;
    color: string;
    pattern: string;
    material: string;
    style: string;
    size: string;
    fit: string;
    imageUrl: string;
    brand?: string;
    notes?: string;
    isAiDetected: boolean;
  } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Tops');
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

  // Handle Photo File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      analyzePhotoWithAI(base64);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image. You can enter details manually.');
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
      console.warn('Vision analysis fallback:', err);
      // Non-blocking fallback: user can still edit fields directly
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setIsCameraActive(true);
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setErrorMessage('Camera access was denied or is unavailable. Please use file upload instead.');
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

      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);

      analyzePhotoWithAI(base64);
    }
  };

  const samplePresets = [
    {
      name: 'Cream Knit Heavyweight Cardigan',
      category: 'Outerwear' as const,
      color: 'Cream',
      pattern: 'Waffle Knit',
      material: 'Merino Wool',
      style: 'Minimal',
      size: 'M',
      fit: 'Relaxed',
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Tailored Pleated Trousers',
      category: 'Bottoms' as const,
      color: 'Charcoal',
      pattern: 'Solid',
      material: 'Wool Blend',
      style: 'Smart Casual',
      size: '32',
      fit: 'Regular',
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Minimalist White Leather Sneakers',
      category: 'Shoes' as const,
      color: 'White',
      pattern: 'Leather',
      material: 'Full-Grain Leather',
      style: 'Minimal',
      size: '10',
      fit: 'Regular',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Raw Indigo Selvedge Denim Jacket',
      category: 'Outerwear' as const,
      color: 'Indigo Blue',
      pattern: 'Twill Denim',
      material: 'Rigid Cotton',
      style: 'Streetwear',
      size: 'L',
      fit: 'Relaxed',
      imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const handleResetForm = () => {
    setLastAddedItem(null);
    setName('');
    setCategory('Tops');
    setColor('Off-White');
    setPattern('Solid');
    setMaterial('Cotton');
    setStyle('Smart Casual');
    setSize('M');
    setFit('Regular');
    setBrand('');
    setNotes('');
    setImagePreview(null);
    setDetectedData(null);
    setErrorMessage(null);
    setActiveMode('upload');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter an item name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const finalImage =
      imagePreview ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop';

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
        imageUrl: finalImage,
        occasions: ['Casual', 'College', 'Date'],
      });

      // Show Rich Confirmation
      setLastAddedItem({
        name: name.trim(),
        category,
        color,
        pattern,
        material,
        style,
        size: String(size),
        fit: String(fit),
        imageUrl: finalImage,
        brand: brand.trim() || undefined,
        notes: notes.trim() || undefined,
        isAiDetected: Boolean(detectedData),
      });
    } catch (err: any) {
      console.error('Failed to add wardrobe item:', err);
      setErrorMessage('Failed to save item. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="add-clothing-view" className="py-6 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Return to Home & Close Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="btn-return-home-from-add"
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <button
          id="btn-close-add-view"
          onClick={onReturnHome}
          className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Close & Return Home"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {lastAddedItem ? (
          /* SUCCESS CONFIRMATION SCREEN */
          <motion.div
            key="success-confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-xl p-6 sm:p-10 text-center relative overflow-hidden"
          >
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-500/5">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Piece Cataloged Successfully</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white mb-2">
                Added to Your Wardrobe!
              </h2>

              <p className="font-serif italic text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mb-6">
                &ldquo;{lastAddedItem.name}&rdquo; is now synchronized and available for intelligent AI outfit formulations.
              </p>

              {/* Garment Details Card */}
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 p-5 text-left flex flex-col sm:flex-row items-center gap-5 mb-8 shadow-inner">
                <img
                  src={lastAddedItem.imageUrl}
                  alt={lastAddedItem.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-32 sm:w-32 sm:h-36 object-cover rounded-xl shadow-md shrink-0 border border-white dark:border-neutral-700"
                />

                <div className="flex-1 space-y-2.5 w-full">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-[#A78BFA] text-[11px] font-semibold uppercase">
                      {lastAddedItem.category}
                    </span>
                    {lastAddedItem.isAiDetected && (
                      <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded font-semibold">
                        ✦ AI Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                    {lastAddedItem.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-300 font-sans">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Color &amp; Pattern</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{lastAddedItem.color} • {lastAddedItem.pattern}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Style &amp; Fit</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{lastAddedItem.style} ({lastAddedItem.fit})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Material</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{lastAddedItem.material}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Size</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{lastAddedItem.size}</span>
                    </div>
                  </div>

                  {lastAddedItem.notes && (
                    <p className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-200 dark:border-neutral-700/60">
                      Note: {lastAddedItem.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="btn-add-another-piece"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#8B5CF6]" />
                  <span>+ Add Another Garment</span>
                </button>

                <button
                  id="btn-view-wardrobe-after-add"
                  onClick={onReturnHome}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View in Digital Wardrobe</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MAIN ADD FORM */
          <motion.div
            key="add-clothing-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-xl overflow-hidden p-6 sm:p-10"
          >
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-semibold tracking-widest uppercase mb-3">
                <Plus className="w-3.5 h-3.5" />
                <span>CLOTHING CATALOG</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                ADD TO YOUR WARDROBE
              </h2>

              <p className="font-serif italic text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-2">
                “Upload a photo or enter details. AuraFit analyzes each garment for intelligent outfit pairing.”
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mode Selector Tabs */}
            <div className="flex justify-center border-b border-neutral-100 dark:border-neutral-800 pb-4 gap-4 mb-8">
              <button
                id="view-tab-upload"
                type="button"
                onClick={() => {
                  setActiveMode('upload');
                  setIsCameraActive(false);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
                  activeMode === 'upload'
                    ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>

              <button
                id="view-tab-camera"
                type="button"
                onClick={() => {
                  setActiveMode('camera');
                  startCamera();
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
                  activeMode === 'camera'
                    ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>

              <button
                id="view-tab-manual"
                type="button"
                onClick={() => {
                  setActiveMode('manual');
                  setIsCameraActive(false);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
                  activeMode === 'manual'
                    ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Add Manually</span>
              </button>
            </div>

            {/* Main Content Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload Dropzone */}
              {activeMode === 'upload' && (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-10 px-4 rounded-3xl border-2 border-dashed border-[#8B5CF6]/30 hover:border-[#8B5CF6] bg-[#8B5CF6]/5 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    {imagePreview ? (
                      <div className="relative max-h-56 rounded-2xl overflow-hidden shadow-md">
                        <img src={imagePreview} alt="Preview" className="h-52 object-cover rounded-2xl" />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6]" />
                            <span className="font-mono tracking-wider uppercase">AI DETECTING METADATA...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-[#8B5CF6] mb-3 stroke-[1.5]" />
                        <p className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-200">
                          Click to upload photo of clothing piece
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
                          AuraFit AI automatically extracts category, palette, fabric pattern, &amp; cut.
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      id="clothing-file-input-page"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Sample Presets */}
                  <div className="mt-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Or pick a sample garment:
                    </span>
                    <div className="flex gap-2.5 mt-2 overflow-x-auto pb-1">
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
                            setSize(preset.size);
                            setFit(preset.fit);
                            setImagePreview(preset.imageUrl);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-[#8B5CF6]/20 text-xs text-neutral-700 dark:text-neutral-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
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
                    <div className="relative rounded-3xl overflow-hidden bg-black max-w-md mx-auto aspect-4/3">
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
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-3xl">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-6 py-3 rounded-full bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Open Device Camera
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AI Detected Banner */}
              {detectedData && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      <strong>AI DETECTED:</strong> {detectedData.category || category} • {detectedData.color || color} •{' '}
                      {detectedData.style || style} • {detectedData.material || material}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                    Vision Match
                  </span>
                </div>
              )}

              {/* Editable Metadata Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Item Name *
                  </label>
                  <input
                    id="item-name-input-view"
                    type="text"
                    required
                    placeholder="e.g. Vintage Oversized Denim Jacket"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Category *
                    </label>
                    <select
                      id="item-category-select-view"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
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
                      id="item-color-input-view"
                      type="text"
                      required
                      placeholder="e.g. Indigo Blue"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Pattern
                    </label>
                    <input
                      id="item-pattern-input-view"
                      type="text"
                      placeholder="e.g. Washed Denim"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Style
                    </label>
                    <input
                      id="item-style-input-view"
                      type="text"
                      placeholder="e.g. Streetwear / Casual"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Fit
                    </label>
                    <select
                      id="item-fit-select-view"
                      value={fit}
                      onChange={(e) => setFit(e.target.value as any)}
                      className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
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
                      id="item-size-input-view"
                      type="text"
                      placeholder="e.g. L / 34"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Fabric Material
                    </label>
                    <input
                      id="item-material-input-view"
                      type="text"
                      placeholder="e.g. 100% Organic Cotton"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Brand (Optional)
                    </label>
                    <input
                      id="item-brand-input-view"
                      type="text"
                      placeholder="e.g. Levi's, Uniqlo, Thrifted"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Stylist Notes (Optional)
                  </label>
                  <textarea
                    id="item-notes-textarea-view"
                    rows={2}
                    placeholder="e.g. Great structured layer, pairs effortlessly with white sneakers and dark bottoms."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
                <button
                  id="btn-cancel-add-view"
                  type="button"
                  onClick={onReturnHome}
                  className="px-6 py-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="btn-submit-add-view"
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-purple-900/15 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F472B6]" />
                      <span>SAVING TO WARDROBE...</span>
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
        )}
      </AnimatePresence>
    </div>
  );
};
