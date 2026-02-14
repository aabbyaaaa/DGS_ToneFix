import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import { VariantCard, EmptyState } from './components/OutputDisplay';
import { polishText } from './services/geminiService';
import { PolishRequest, PolishResponse, Tone } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PolishResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePolishSubmit = async (data: PolishRequest) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await polishText(data);
      setResponse(result);
    } catch (err) {
      setError("處理您的請求時發生錯誤。請確認網路連線或稍後再試。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to find variants
  const getVariant = (tone: Tone) => response?.variants.find(v => v.tone === tone);

  const standardVariant = getVariant(Tone.STANDARD);
  const conciseVariant = getVariant(Tone.CONCISE);
  const formalVariant = getVariant(Tone.FORMAL);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 
          Grid Layout:
          Desktop: 2 Columns. 
          Row 1: Input (Left) | Standard (Right) - Equal Height
          Row 2: Concise (Left) | Formal (Right)
          Mobile: 1 Column stack.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          
          {/* Top Left: Input Form */}
          <div className="h-full">
            <InputForm onSubmit={handlePolishSubmit} isLoading={isLoading} />
          </div>

          {/* Top Right: Standard Variant (or Empty State) */}
          <div className="h-full">
            {standardVariant ? (
              <VariantCard variant={standardVariant} />
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Bottom Row: Only visible when response is available */}
          {response && (
            <>
              {/* Bottom Left: Concise */}
              <div className="h-full">
                {conciseVariant && <VariantCard variant={conciseVariant} />}
              </div>

              {/* Bottom Right: Formal */}
              <div className="h-full">
                {formalVariant && <VariantCard variant={formalVariant} />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;