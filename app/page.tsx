import { MainLayout } from '@/components/layouts/main-layout';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  return (
    <MainLayout>
      <ChatInterface />
    </MainLayout>
  );
}