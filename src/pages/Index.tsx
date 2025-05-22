
import ChatArea from '@/components/ChatArea';
import ConversationSidebar from '@/components/ConversationSidebar';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChatProvider } from '@/contexts/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Index = () =>
{
  const isMobile = useIsMobile();
  const [ showSidebar, setShowSidebar ] = useState( false );
  const [ showPreview, setShowPreview ] = useState( !isMobile );
  console.log( isMobile )

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen max-w-5xl mx-auto">
        <Header />
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Animated Overlay Sidebar */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  key="overlay-sidebar"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-0 left-0 h-full w-64 bg-slate-900 z-30 shadow-lg border-r border-slate-700"
                >
                  <ConversationSidebar onClose={ setShowSidebar } />
                </motion.div>
              )}
            </AnimatePresence>

            
            {/* Main chat area */}
            <ResizablePanel defaultSize={showPreview ? 50 : 80}>
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  <ChatArea />
                  
                  {/* Sidebar toggle button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute z-50 left-4 bottom-20 rounded-full h-10 w-10 bg-slate-800 border-slate-700"
                    onClick={() => setShowSidebar( !showSidebar )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      {showSidebar ? (
                        <>
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <path d="M9 3v18" />
                          <path d="m14 9-3 3 3 3" />
                        </>
                      ) : (
                        <>
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <path d="M9 3v18" />
                          <path d="m14 15-3-3 3-3" />
                        </>
                      )}
                    </svg>
                  </Button>
                  
                  
                </div>
              </div>
            </ResizablePanel>
          
            
          </ResizablePanelGroup>
        </div>
        
        {/* Decorative orbs */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="orb w-64 h-64 bg-ai-purple/20 top-[-5%] left-[-5%] animate-float"></div>
          <div className="orb w-72 h-72 bg-ai-blue/20 bottom-[-10%] right-[-10%] animate-float-slow"></div>
          <div className="orb w-48 h-48 bg-ai-cyan/20 top-[40%] right-[-5%] animate-float"></div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
