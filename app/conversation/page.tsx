import { ChatInterface } from "@/components/chat/chat-interface";
import { MainLayout } from "@/components/layouts/main-layout";

export default async function ConversationPage() {
  return (
    <MainLayout>
      <ChatInterface/>
    </MainLayout>
  )
}
