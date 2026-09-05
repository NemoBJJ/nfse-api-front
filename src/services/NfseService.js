import api from "../api";

const NfseService = {
  emitirNota: async (empresaId, dadosNota) => {
    try {
      const response = await api.post(`/nfse/emitir/${empresaId}`, dadosNota);
      return response.data;
    } catch (error) {
      console.error("Erro ao emitir nota:", error);
      throw error;
    }
  },

  consultarNota: async (referencia) => {
    try {
      const response = await api.get(`/nfse/consultar/${referencia}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao consultar nota:", error);
      throw error;
    }
  },
};

export default NfseService;
