import React, { useState, useRef } from 'react';
import { Flame, Trophy, Camera, Check, X, Loader2, Crown, Zap } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import { XP_CONFIG, uploadProfilePhoto } from '../services/userService';

const ProfileView = ({ t, profile, xpProgress, onUpdateProfile, userId, onPremium }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const displayName = profile?.displayName || 'Atlet';
  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const activeDays = profile?.activeDays || 0;
  const photoURL = profile?.photoURL;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleEditStart = () => {
    setEditName(displayName);
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (!editName.trim() || editName === displayName) {
      setIsEditing(false);
      return;
    }
    
    setSaving(true);
    await onUpdateProfile({ displayName: editName.trim() });
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Resim boyutu 5MB\'dan küçük olmalı');
      return;
    }
    
    setUploadingPhoto(true);
    const result = await uploadProfilePhoto(userId, file);
    setUploadingPhoto(false);
    
    if (!result.success) {
      console.error('Photo upload failed:', result.error);
      alert('Fotoğraf yüklenemedi: ' + result.error);
    }
  };

  return (
    <div className="px-4 pt-32 pb-32 animate-enter max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-10">
        <div 
          className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 shadow-[0_0_40px_rgba(16,185,129,0.3)] cursor-pointer group"
          onClick={handlePhotoClick}
        >
          {photoURL ? (
            <img 
              src={photoURL} 
              alt={displayName} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl font-bold font-display">
              {initials}
            </div>
          )}
          {uploadingPhoto ? (
            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
              <Loader2 size={24} className="text-emerald-400 animate-spin" />
            </div>
          ) : (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handlePhotoChange}
          />
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xl font-bold text-white focus:outline-none focus:border-emerald-500"
                autoFocus
              />
              <button 
                onClick={handleSaveName}
                disabled={saving}
                className="p-2 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
              >
                {saving ? <Loader2 size={18} className="animate-spin text-black" /> : <Check size={18} className="text-black" />}
              </button>
              <button 
                onClick={handleCancel}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          ) : (
            <h1 
              className="text-3xl font-black text-white tracking-tight font-display cursor-pointer hover:text-emerald-400 transition-colors"
              onClick={handleEditStart}
            >
              {displayName}
            </h1>
          )}
          <p className="text-gray-400 font-medium text-sm">Hybrid Athlete • LVL {level}</p>
        </div>
      </div>
      
      {/* XP Progress Bar */}
      <GlassPanel className="rounded-[32px] p-6 mb-6">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
          <span>{t.level_progress}</span>
          <span>{xp} / {XP_CONFIG.XP_PER_LEVEL} XP</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
      </GlassPanel>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassPanel className="rounded-[32px] p-6 text-center group hover:bg-white/5 transition-colors">
          <Flame size={24} className="text-orange-500 mx-auto mb-2 icon-glow group-hover:scale-110 transition-transform" />
          <div className="text-3xl font-black text-white font-display">{activeDays}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">Aktif Gün</div>
        </GlassPanel>
        <GlassPanel className="rounded-[32px] p-6 text-center group hover:bg-white/5 transition-colors">
          <Trophy size={24} className="text-purple-500 mx-auto mb-2 icon-glow group-hover:scale-110 transition-transform" />
          <div className="text-3xl font-black text-white font-display">{level}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">Seviye</div>
        </GlassPanel>
      </div>

      {/* Premium Section */}
      {profile?.isPremium ? (
        <GlassPanel className="rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
              <Crown size={20} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Premium Üye
                <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold">PRO</span>
              </div>
              <p className="text-xs text-gray-500">Sınırsız AI erişimine sahipsin</p>
            </div>
          </div>
        </GlassPanel>
      ) : (
        <button 
          onClick={onPremium}
          className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center gap-3 hover:from-amber-500/20 hover:to-orange-500/20 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Crown size={20} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-white">Premium'a Yükselt</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Zap size={12} className={profile?.credits > 0 ? 'text-emerald-400' : 'text-gray-500'} />
              {profile?.credits ?? 0} kredi kaldı
            </div>
          </div>
          <div className="text-xs font-bold text-amber-400">→</div>
        </button>
      )}
    </div>
  );
};

export default ProfileView;
