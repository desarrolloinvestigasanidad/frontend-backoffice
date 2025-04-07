"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";

interface EditorCertContentProps {
  onChange: (contentHtml: string) => void;
}

export function EditorCertContent({ onChange }: EditorCertContentProps) {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    // Solo en el cliente
    if (typeof window !== "undefined") {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        placeholder: "Escribe el texto del certificado...",
        onChange: async () => {
          const outputData = await editorRef.current?.save();
          // AQUI tendrías que convertir outputData a HTML
          // Para simplicidad, haremos algo básico
          const plainText = convertBlocksToPlainText(outputData?.blocks || []);
          onChange(plainText);
        },
      });
    }
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
      }
    };
  }, [onChange]);

  return (
    <div className='border p-2 rounded bg-white' style={{ minHeight: 200 }}>
      <div id='editorjs' />
    </div>
  );
}

// Mini-función para convertir los blocks a texto
function convertBlocksToPlainText(blocks: any[]): string {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        return block.data.text; // ojo, contiene HTML
      }
      // Maneja encabezados, etc.
      return block.data?.text || "";
    })
    .join("\n\n");
}
