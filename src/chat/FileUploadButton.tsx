import { useRef, useState } from "react";
import { Paperclip, Loader2 } from "lucide-react";

export function FileUploadButton({
  onUploaded,
}: {
  onUploaded: (file: { url: string; name: string; type: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="hover:text-foreground disabled:opacity-50"
        title="Anexar arquivo"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setUploading(true);
          try {
            const mod = await import("./api");
            const result = await mod.chatApi.upload(file);
            onUploaded({ url: result.url, name: result.name, type: result.type });
          } catch {
            alert(
              "Não foi possível enviar o arquivo. Verifique se o servidor de chat está rodando.",
            );
          } finally {
            setUploading(false);
          }
        }}
      />
    </>
  );
}
