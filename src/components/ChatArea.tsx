
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/contexts/ChatContext';
import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

const ChatArea: React.FC = () => {
  const { getCurrentConversation, isTyping } = useChat();
  const currentConversation = getCurrentConversation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentConversation?.messages.length, isTyping]);

  // Welcome message when no messages
  const renderEmptyState = () => (
    <div className="flex items-center justify-center">
      <div className="max-w-md text-center px-4">
        <h2 className="gradient-text text-2xl font-bold mb-2">
          Welcome to AI Assistant
        </h2>
        <p className="text-muted-foreground mb-4">
          Ask me anything about web development, programming, or any other topic. I'm here to help!
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bottom-10">
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6 md:px-6">
        {( !currentConversation || currentConversation.messages.length === 0 ) ? (
          renderEmptyState()
        ) : (
          <div>
            {currentConversation.messages.map( ( message, index ) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === currentConversation.messages.length - 1}
              />
            ) )}
            {isTyping && (
              <div className="flex items-start gap-3 mb-6 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 64 64">
                  <path fill="#fd3c4f" d="M14.485,21.141l-5.922,2.192c-1.548,0.573-2.549,2.01-2.549,3.661c0,1.651,1.001,3.088,2.549,3.661 l2.739,1.013c0.676-4.283,2.468-8.198,5.064-11.443C15.771,20.581,15.147,20.896,14.485,21.141z"></path><path fill="#fd3c4f" d="M30.668,8.549C30.095,7,28.658,6,27.007,6s-3.088,1-3.661,2.549l-2.191,5.922 c-0.246,0.664-0.562,1.29-0.92,1.887c3.248-2.595,7.165-4.386,11.45-5.059L30.668,8.549z"></path><path fill="#e57fcf" d="M33.151,15.145c-0.1-0.224-0.206-0.443-0.292-0.674l-1.174-3.172 c-4.285,0.673-8.202,2.463-11.45,5.059c-0.953,1.589-2.279,2.914-3.869,3.867c-2.596,3.246-4.388,7.16-5.064,11.443l3.183,1.178 c0.227,0.084,0.443,0.189,0.663,0.287C16.238,23.713,23.73,16.226,33.151,15.145z"></path><path fill="#a389e0" d="M35.5,19c0.171,0,0.337,0.02,0.508,0.026c-1.212-1.064-2.188-2.381-2.856-3.88 c-9.422,1.081-16.913,8.568-18.003,17.987c1.496,0.665,2.812,1.636,3.876,2.844C19.019,35.816,19,35.661,19,35.5 C19,26.387,26.387,19,35.5,19z"></path><path fill="#68e5fd" d="M45.451,23.332l-5.922-2.192c-1.313-0.486-2.495-1.214-3.522-2.115C35.837,19.02,35.671,19,35.5,19 C26.387,19,19,26.387,19,35.5c0,0.161,0.019,0.316,0.024,0.476c0.908,1.03,1.642,2.219,2.131,3.539l2.191,5.922 c0.573,1.548,2.01,2.549,3.661,2.549s3.088-1.001,3.661-2.549l2.192-5.922c1.145-3.094,3.576-5.525,6.67-6.67l5.922-2.191 C47,30.081,48,28.644,48,26.993C48,25.342,47,23.905,45.451,23.332z"></path><g><path d="M43.716,25.964l-5.922,2.191c-4.464,1.652-7.972,5.16-9.624,9.624l-2.192,5.922 c-0.538,1.453-0.337,2.986,0.382,4.23c0.211,0.034,0.426,0.055,0.646,0.055c1.651,0,3.088-1.001,3.661-2.549l2.192-5.922 c1.145-3.094,3.576-5.525,6.67-6.67l5.922-2.191C47,30.081,48,28.644,48,26.993c0-0.22-0.021-0.435-0.055-0.646 C46.701,25.628,45.17,25.428,43.716,25.964z" opacity=".15"></path><path fill="#fff" d="M25.844,16.206l2.191-5.922c0.537-1.453,0.337-2.985-0.382-4.229 C27.443,6.021,27.227,6,27.007,6c-1.651,0-3.088,1-3.661,2.549l-2.191,5.922c-1.145,3.094-3.576,5.525-6.67,6.67l-5.922,2.192 c-1.548,0.573-2.549,2.01-2.549,3.661c0,0.224,0.022,0.444,0.058,0.659c0.753,0.434,1.607,0.682,2.492,0.682 c0.577,0,1.163-0.101,1.735-0.312l5.921-2.191C20.684,24.178,24.192,20.67,25.844,16.206z" opacity=".3"></path></g><path fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M18.513,23.616	c2.724-1.655,4.876-4.131,6.133-7.102"></path><ellipse cx="32" cy="61" opacity=".3" rx="23" ry="3"></ellipse><g><path fill="#fd3c4f" d="M56.26,44.528L53.699,43.6c-0.033-0.012-0.061-0.033-0.094-0.046 c-1.515,4.214-4.857,7.551-9.073,9.059c0.014,0.036,0.038,0.067,0.051,0.104l0.927,2.561c0.385,1.063,1.364,1.75,2.494,1.75h0.001 c1.13,0,2.11-0.686,2.495-1.75l0.928-2.562c0.383-1.059,1.211-1.887,2.271-2.271l2.56-0.927c1.063-0.385,1.751-1.365,1.751-2.496 C58.011,45.892,57.323,44.913,56.26,44.528z"></path><path fill="#e57fcf" d="M53.605,43.554c-1.012-0.398-1.805-1.198-2.176-2.224l-0.928-2.563 c-0.004-0.01-0.009-0.018-0.013-0.028c-0.127,5.901-4.892,10.652-10.799,10.752c0.021,0.008,0.04,0.02,0.062,0.028l2.56,0.927 c1.023,0.371,1.821,1.161,2.221,2.167C48.748,51.105,52.09,47.767,53.605,43.554z"></path><path fill="#a389e0" d="M48.005,37.018L48.005,37.018c-1.131,0-2.11,0.687-2.495,1.75l-0.927,2.561 c-0.384,1.06-1.212,1.888-2.272,2.272l-2.56,0.927C38.687,44.913,38,45.892,38,47.023c0,1.108,0.662,2.067,1.689,2.468 c5.907-0.1,10.672-4.851,10.799-10.752C50.095,37.693,49.126,37.018,48.005,37.018z"></path></g>
                </svg>
                <div className="flex-1">
                  <div className="px-4 py-3 rounded-md shadow-md gradient-card-bg border border-slate-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t border-slate-700 p-4 w-full bottom-0 bg-card">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatArea;
