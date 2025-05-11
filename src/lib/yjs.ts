import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

// Initialize Yjs document
export const yDoc = new Y.Doc();

// Shared XmlFragment for TipTap collaboration
export const yXmlFragment = yDoc.getXmlFragment('shared-doc');

// WebRTC provider for peer-to-peer sync
let webrtcProviderInstance: WebrtcProvider | null = null;

export const getWebrtcProvider = () => {
  if (!webrtcProviderInstance) {
    try {
      webrtcProviderInstance = new WebrtcProvider('collab-editor-room', yDoc, {
        signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com'],
      });
      // Log provider initialization
      webrtcProviderInstance.on('synced', () => {
        console.log('WebRTC provider synced');
      });
    } catch (error) {
      console.error('Failed to initialize WebrtcProvider:', error);
      throw error;
    }
  }
  return webrtcProviderInstance;
};

// Apply Yjs update with error handling
export const applyYjsUpdate = (update: Uint8Array) => {
  try {
    Y.applyUpdate(yDoc, update);
    console.log('Applied Yjs update:', Array.from(update));
  } catch (error) {
    console.error('Failed to apply Yjs update:', error);
  }
};

// Cleanup function
export const destroyYjs = () => {
  if (webrtcProviderInstance) {
    webrtcProviderInstance.disconnect();
    webrtcProviderInstance.destroy();
    webrtcProviderInstance = null;
  }
  yDoc.destroy();
};