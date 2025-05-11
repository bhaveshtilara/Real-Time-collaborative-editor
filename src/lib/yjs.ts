import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

// Initialize Yjs document
export const yDoc = new Y.Doc();

// Shared XmlFragment for TipTap collaboration
export const yXmlFragment = yDoc.getXmlFragment('shared-doc');

// WebRTC provider for peer-to-peer sync (cross-browser)
let webrtcProviderInstance: WebrtcProvider | null = null;

export const getWebrtcProvider = () => {
  if (!webrtcProviderInstance) {
    try {
      webrtcProviderInstance = new WebrtcProvider('collab-editor-room', yDoc, {
        signaling: ['wss://signaling.yjs.dev'],
      });
    } catch (error) {
      console.error('Failed to initialize WebrtcProvider:', error);
      throw error;
    }
  }
  return webrtcProviderInstance;
};

// BroadcastChannel for same-browser sync
let broadcastChannel: BroadcastChannel | null = null;

export const setupBroadcastSync = () => {
  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel('collab-editor-room');

    // Handle incoming messages
    broadcastChannel.onmessage = (event) => {
      const data = event.data;
      if (data && data.type === 'sync' && data.update) {
        try {
          // Decode base64 to Uint8Array
          const binary = atob(data.update);
          const update = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            update[i] = binary.charCodeAt(i);
          }
          Y.applyUpdate(yDoc, update);
        } catch (error) {
          console.error('Failed to apply BroadcastChannel update:', error);
        }
      }
    };

    // Sync Yjs updates to other tabs
    yDoc.on('update', (update) => {
      try {
        // Encode Uint8Array as base64
        const base64Update = btoa(String.fromCharCode(...update));
        broadcastChannel?.postMessage({
          type: 'sync',
          update: base64Update,
        });
      } catch (error) {
        console.error('Failed to broadcast update:', error);
      }
    });
  }
};

// Cleanup function
export const destroyYjs = () => {
  if (webrtcProviderInstance) {
    webrtcProviderInstance.disconnect();
    webrtcProviderInstance.destroy();
    webrtcProviderInstance = null;
  }
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
  yDoc.destroy();
};