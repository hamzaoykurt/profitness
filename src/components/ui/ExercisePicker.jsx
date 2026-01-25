import React, { useState } from 'react';
import { Search, X, Plus, ChevronDown, Dumbbell, PenLine } from 'lucide-react';
import { EXERCISE_LIBRARY, searchExercises } from '../../data/exerciseLibrary';
import { getExerciseImage } from '../../services/mockData';

/**
 * ExercisePicker - Visual exercise selection with categories
 * Shows exercise library organized by muscle groups with images
 */
const ExercisePicker = ({ onSelect, lang = 'tr', isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('chest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  
  const library = EXERCISE_LIBRARY[lang] || EXERCISE_LIBRARY.tr;
  const { categories, exercises } = library;
  
  // Get exercises to display (search results or category)
  const displayExercises = searchQuery.length >= 2 
    ? searchExercises(searchQuery, lang)
    : exercises[activeCategory] || [];

  // Handle exercise selection
  const handleSelectExercise = (exercise) => {
    onSelect({
      name: exercise.name,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      note: exercise.note || (lang === 'tr' ? 'Formu koru.' : 'Maintain form.'),
      muscles: exercise.muscles,
      image: exercise.image
    });
    onClose();
  };

  // Handle custom exercise
  const handleCustomExercise = () => {
    if (customName.trim()) {
      onSelect({
        name: customName.trim(),
        sets: 3,
        reps: 10,
        note: lang === 'tr' ? 'Formu koru.' : 'Maintain form.',
        muscles: lang === 'tr' ? 'Özel hareket' : 'Custom exercise',
        image: 'default'
      });
      setCustomName('');
      setShowCustomInput(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Color mapping for category badges
  const colorClasses = {
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0a0a0f] border border-white/10 rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col animate-enter">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell size={20} className="text-emerald-400" />
              {lang === 'tr' ? 'Hareket Seç' : 'Select Exercise'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'tr' ? 'Hareket ara...' : 'Search exercises...'}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Category Tabs (only show when not searching) */}
        {searchQuery.length < 2 && (
          <div className="px-5 py-3 border-b border-white/10 flex-shrink-0 overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Search Results Header */}
          {searchQuery.length >= 2 && (
            <p className="text-xs text-gray-500 mb-3 px-1">
              {displayExercises.length} {lang === 'tr' ? 'sonuç bulundu' : 'results found'}
            </p>
          )}

          {/* Exercise Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayExercises.map((exercise, index) => {
              const cat = categories.find(c => c.id === (exercise.categoryId || activeCategory));
              const colorClass = colorClasses[cat?.color || exercise.categoryColor || 'gray'];
              
              return (
                <button
                  key={`${exercise.name}-${index}`}
                  onClick={() => handleSelectExercise(exercise)}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden text-left transition-all active:scale-[0.98]"
                >
                  {/* Exercise Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    <img 
                      src={getExerciseImage(exercise.name)}
                      alt={exercise.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Add Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <Plus size={24} className="text-black" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Exercise Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {exercise.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                      {exercise.muscles}
                    </p>
                    {/* Default Sets/Reps Badge */}
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${colorClass}`}>
                      {exercise.defaultSets}×{exercise.defaultReps}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* No Results */}
          {displayExercises.length === 0 && searchQuery.length >= 2 && (
            <div className="text-center py-12">
              <Dumbbell size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500">
                {lang === 'tr' ? 'Hareket bulunamadı' : 'No exercises found'}
              </p>
            </div>
          )}
        </div>

        {/* Footer - Custom Exercise Option */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          {showCustomInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={lang === 'tr' ? 'Hareket adı gir...' : 'Enter exercise name...'}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCustomExercise()}
              />
              <button
                onClick={handleCustomExercise}
                disabled={!customName.trim()}
                className="px-5 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => { setShowCustomInput(false); setCustomName(''); }}
                className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <PenLine size={16} />
              {lang === 'tr' ? 'Listede yok mu? Elle gir' : "Can't find it? Add custom"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePicker;
