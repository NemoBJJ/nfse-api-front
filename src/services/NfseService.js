import axios from "axios";

const API_BASE_URL = "http://localhost:8085/api/nfse";

const NfseService = {
  emitirNota: async (empresaId, dadosNota) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/emitir/${empresaId}`, dadosNota);
      return response.data;
    } catch (error) {
      console.error("Erro ao emitir nota:", error);
      throw error;
    }
  },

  consultarNota: async (referencia) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/consultar/${referencia}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao consultar nota:", error);
      throw error;
    }
  },
};

export default NfseService;
