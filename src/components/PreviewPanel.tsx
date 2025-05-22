
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PreviewPanel: React.FC = () => {
  // In a real implementation, this would show the preview of what the AI is generating
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-700 p-4">
        <h3 className="text-sm font-medium">Live Preview</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="relative w-full h-full gradient-panel-bg rounded-lg border border-slate-700 p-6 animate-pulse-slow">
          <div className="orb w-24 h-24 bg-purple-600/30 top-1/4 left-1/4 animate-float"></div>
          <div className="orb w-32 h-32 bg-indigo-600/30 bottom-1/3 right-1/3 animate-float-slow"></div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <p className="text-muted-foreground text-center max-w-xs">
              Preview of your application will appear here as you chat with the AI assistant.
            </p>
            
            <div className="mt-8 grid gap-4 w-full max-w-sm">
              <Card className="bg-card/40 backdrop-blur-sm animate-pulse-slow">
                <CardContent className="p-4 h-16"></CardContent>
              </Card>
              <Card className="bg-card/40 backdrop-blur-sm animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-4 h-24"></CardContent>
              </Card>
              <Card className="bg-card/40 backdrop-blur-sm animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
                <CardContent className="p-4 h-16"></CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
