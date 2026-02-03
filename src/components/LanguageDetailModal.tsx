'use client';

import { X } from "lucide-react";
import type { ProcessedLanguage } from "@/types";
import { useApp } from "@/contexts/AppContext";
import { getTranslation } from "@/lib/i18n";

interface LanguageDetailModalProps {
  language: ProcessedLanguage | null;
  onClose: () => void;
}

export default function LanguageDetailModal({ language, onClose }: LanguageDetailModalProps) {
  const { language: uiLanguage } = useApp();
  const t = getTranslation(uiLanguage);

  if (!language) return null;

  // Parse coordinates (format: "lng,lat" from API)
  const coords = language.coordinates.split(',').map(c => c.trim());
  const lng = coords[0] || ''; // First is longitude
  const lat = coords[1] || ''; // Second is latitude
  
  // Create OpenStreetMap embed URL
  const mapUrl = lat && lng 
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng)-0.1},${parseFloat(lat)-0.1},${parseFloat(lng)+0.1},${parseFloat(lat)+0.1}&layer=mapnik&marker=${lat},${lng}`
    : '';

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">{language.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Language Info */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-foreground min-w-[80px]">{t.languageDetail.region}</span>
              <span className="text-foreground">{language.region || '—'}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-foreground min-w-[80px]">{t.languageDetail.location}</span>
              <span className="text-foreground">{language.location || '—'}</span>
            </div>
            {language.coordinates && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-foreground min-w-[80px]">{t.languageDetail.coordinates}</span>
                <span className="text-foreground">{language.coordinates}</span>
              </div>
            )}
          </div>

          {/* Map */}
          {mapUrl && (
            <div className="w-full h-[400px] border border-border rounded overflow-hidden">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                title={`${language.name} 地圖`}
              />
            </div>
          )}

          {!mapUrl && (
            <div className="text-muted-foreground">
              {t.languageDetail.noMapData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
