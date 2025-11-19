import React, { useState, useEffect } from "react";
import './ChatModal.css';
import ChatList from "./ChatList";
import Chat from "./Chat";

export default function ChatModal({ open, onClose, id_destinatario, destinatarioInfo, mensajeInicial }) {
  const [showChatList, setShowChatList] = useState(false);
  
  // Hacer disponible la función de cerrar globalmente para los links
  useEffect(() => {
    window.cerrarChatModal = onClose;
    return () => {
      delete window.cerrarChatModal;
    };
  }, [onClose]);
  
  if (!open) return null;
  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>
        {/* Equís eliminada, solo contenido del chat/modal */}
        {showChatList ? (
          <ChatList onClose={onClose} />
        ) : (
          id_destinatario ? (
            <Chat 
              id_destinatario={id_destinatario} 
              destinatarioInfo={destinatarioInfo} 
              onBack={() => setShowChatList(true)}
              mensajeInicial={mensajeInicial}
            />
          ) : (
            <ChatList onClose={onClose} />
          )
        )}
      </div>
    </div>
  );
}