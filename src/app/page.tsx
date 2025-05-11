import UsernamePrompt from '@/components/UsernamePrompt';
import Editor from '@/components/Editor';
import UserStatus from '@/components/UserStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">Real-Time Collaborative Editor</h1>
      <UsernamePrompt />
      <Editor />
      <UserStatus />
    </main>
  );
}