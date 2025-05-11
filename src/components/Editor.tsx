'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { yDoc, getWebrtcProvider, destroyYjs } from '@/lib/yjs';

export default function Editor() {
  const { user } = useUserStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: yDoc,
        field: 'shared-doc',
      }),
      CollaborationCursor.configure({
        provider: getWebrtcProvider(),
        user: {
          name: user?.name || 'Anonymous',
          color: user?.color || '#000000',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 border rounded focus:outline-none min-h-[300px]',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && user) {
      editor.chain().focus().updateUser({ name: user.name, color: user.color }).run();
      // Update awareness with user info
      const provider = getWebrtcProvider();
      provider.awareness.setLocalStateField('user', {
        name: user.name,
        color: user.color,
      });
      console.log('Editor initialized with user:', user);
      // Log awareness changes
      provider.awareness.on('change', () => {
        console.log('Awareness states:', provider.awareness.getStates());
      });
    }
    return () => {
      if (editor) {
        editor.destroy();
      }
      destroyYjs(); // Cleanup on unmount
    };
  }, [editor, user]);

  if (!editor || !user?.name) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <EditorContent editor={editor} />
    </div>
  );
}