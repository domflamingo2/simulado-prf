import {
  ErrorCode,
  handleError,
  safeAsync,
  SimuladoError,
} from "@/lib/error-handling";
import { describe, expect, it } from "vitest";

describe("Error Handling", () => {
  describe("SimuladoError", () => {
    it("deve criar um erro customizado com código", () => {
      const error = new SimuladoError(
        "Teste de erro",
        ErrorCode.VALIDATION_ERROR,
        400,
      );

      expect(error.message).toBe("Teste de erro");
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("SimuladoError");
    });
  });

  describe("handleError", () => {
    it("deve retornar SimuladoError se já for instância", () => {
      const originalError = new SimuladoError(
        "Erro original",
        ErrorCode.NOT_FOUND,
      );
      const handled = handleError(originalError);

      expect(handled).toBe(originalError);
    });

    it("deve envolver Error padrão em SimuladoError", () => {
      const error = new Error("Erro padrão");
      const handled = handleError(error, "TestContext");

      expect(handled).toBeInstanceOf(SimuladoError);
      expect(handled.code).toBe(ErrorCode.SERVER_ERROR);
      expect(handled.statusCode).toBe(500);
    });

    it("deve tratar erro desconhecido", () => {
      const handled = handleError("string de erro", "TestContext");

      expect(handled).toBeInstanceOf(SimuladoError);
      expect(handled.message).toBe("Erro desconhecido");
    });
  });

  describe("safeAsync", () => {
    it("deve retornar resultado para operação bem-sucedida", async () => {
      const asyncFn = async () => "sucesso";
      const [result, error] = await safeAsync(asyncFn);

      expect(result).toBe("sucesso");
      expect(error).toBeNull();
    });

    it("deve retornar erro para operação que falha", async () => {
      const asyncFn = async () => {
        throw new Error("Falha");
      };
      const [result, error] = await safeAsync(asyncFn, "TestAsync");

      expect(result).toBeNull();
      expect(error).toBeInstanceOf(SimuladoError);
      expect(error?.code).toBe(ErrorCode.SERVER_ERROR);
    });
  });
});
