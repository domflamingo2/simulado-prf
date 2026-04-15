import html2canvas from "html2canvas";
import { useCallback, useRef, useState } from "react";

export function useCompartilharResultado() {
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [gerandoImagem, setGerandoImagem] = useState(false);

  const compartilharResultado = useCallback(async () => {
    if (!resultadoRef.current) {
      alert("Erro: Não foi possível gerar a imagem.");
      return;
    }

    setGerandoImagem(true);

    try {
      resultadoRef.current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(resultadoRef.current, {
        backgroundColor: "#0f172a",
        scale: 2.5,
        useCORS: true,
        logging: false,
        allowTaint: false,
        windowWidth: resultadoRef.current.scrollWidth,
        windowHeight: resultadoRef.current.scrollHeight,
        onclone: (clonedDoc, element) => {
          const clonedElement = element as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = "none";
          }
        },
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0);
      });

      if (!blob) {
        throw new Error("Falha ao gerar blob da imagem");
      }

      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          alert("✅ Imagem copiada! Cole onde quiser compartilhar (Ctrl+V).");
        } catch (clipboardError) {
          console.warn(
            "Clipboard API falhou, fazendo download:",
            clipboardError,
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `prf-resultado-${new Date().toISOString().split("T")[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          alert("📸 Imagem salva! Verifique sua pasta de downloads.");
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prf-resultado-${new Date().toISOString().split("T")[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("📸 Imagem salva! Verifique sua pasta de downloads.");
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert(
        "❌ Erro ao gerar imagem. Tente novamente ou faça um print screen.",
      );
    } finally {
      setGerandoImagem(false);
    }
  }, []);

  const salvarImagem = useCallback(async () => {
    if (!resultadoRef.current) {
      alert("Erro: Não foi possível gerar a imagem.");
      return;
    }

    setGerandoImagem(true);

    try {
      const canvas = await html2canvas(resultadoRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `prf-resultado-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();

      alert("✅ Imagem salva! Verifique sua pasta de downloads.");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      alert("❌ Erro ao salvar imagem. Tente novamente.");
    } finally {
      setGerandoImagem(false);
    }
  }, []);

  return {
    resultadoRef,
    gerandoImagem,
    compartilharResultado,
    salvarImagem,
  };
}
