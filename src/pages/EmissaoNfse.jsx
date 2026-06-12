import React, { useState } from "react";
import NfseService from "../services/NfseService";
import "./EmissaoNfse.css";

const EmissaoNfse = () => {
  const [formData, setFormData] = useState({
    cnpjTomador: "",
    razaoSocialTomador: "",
    cepTomador: "",
    logradouroTomador: "",
    numeroTomador: "",
    bairroTomador: "",
    telefoneTomador: "",
    emailTomador: "",
    descricaoServico: "",
    valorServico: "",
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [consulta, setConsulta] = useState(null);
  const [referenciaConsulta, setReferenciaConsulta] = useState("");

  const montarUrlDownload = (url) => {
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `https://homologacao.focusnfe.com.br${url}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setConsulta(null);

    try {
      const data = {
        ...formData,
        valorServico: parseFloat(formData.valorServico),
      };
      const response = await NfseService.emitirNota(1, data);
      setResultado(response);

      if (response.referencia) {
        setTimeout(async () => {
          try {
            const consultaResponse = await NfseService.consultarNota(
              response.referencia
            );
            setConsulta(consultaResponse);
          } catch (err) {
            console.error("Erro na consulta automática:", err);
          }
        }, 5000);
      }
    } catch (error) {
      alert("Erro ao emitir nota. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultar = async () => {
    if (!referenciaConsulta) {
      alert("Digite uma referência");
      return;
    }
    setLoading(true);
    try {
      const response = await NfseService.consultarNota(referenciaConsulta);
      setConsulta(response);
    } catch (error) {
      alert("Nota não encontrada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emissao-container">
      <h1>📄 Emissão de NFSe</h1>

      <div className="form-section">
        <h2>Dados do Tomador</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>CNPJ/CPF do Tomador *</label>
              <input
                type="text"
                name="cnpjTomador"
                value={formData.cnpjTomador}
                onChange={handleChange}
                placeholder="00.000.000/0001-91"
                required
              />
            </div>
            <div className="form-group">
              <label>Razão Social / Nome *</label>
              <input
                type="text"
                name="razaoSocialTomador"
                value={formData.razaoSocialTomador}
                onChange={handleChange}
                placeholder="CLIENTE TESTE"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CEP *</label>
              <input
                type="text"
                name="cepTomador"
                value={formData.cepTomador}
                onChange={handleChange}
                placeholder="59010030"
                required
              />
            </div>
            <div className="form-group">
              <label>Logradouro *</label>
              <input
                type="text"
                name="logradouroTomador"
                value={formData.logradouroTomador}
                onChange={handleChange}
                placeholder="Rua Teste"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Número *</label>
              <input
                type="text"
                name="numeroTomador"
                value={formData.numeroTomador}
                onChange={handleChange}
                placeholder="100"
                required
              />
            </div>
            <div className="form-group">
              <label>Bairro *</label>
              <input
                type="text"
                name="bairroTomador"
                value={formData.bairroTomador}
                onChange={handleChange}
                placeholder="Praia do Meio"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="telefoneTomador"
                value={formData.telefoneTomador}
                onChange={handleChange}
                placeholder="84987446061"
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="emailTomador"
                value={formData.emailTomador}
                onChange={handleChange}
                placeholder="cliente@teste.com"
              />
            </div>
          </div>

          <h2>Dados do Serviço</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Descrição do Serviço *</label>
              <input
                type="text"
                name="descricaoServico"
                value={formData.descricaoServico}
                onChange={handleChange}
                placeholder="DESENVOLVIMENTO DE SOFTWARE - TESTE"
                required
              />
            </div>
            <div className="form-group">
              <label>Valor do Serviço (R$) *</label>
              <input
                type="number"
                step="0.01"
                name="valorServico"
                value={formData.valorServico}
                onChange={handleChange}
                placeholder="100,00"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Emitindo..." : "💰 Emitir Nota Fiscal"}
          </button>
        </form>
      </div>

      {resultado && (
        <div className="result-section">
          <h3>✅ Nota Emitida!</h3>
          <p>
            <strong>Status:</strong> {resultado.status}
          </p>
          <p>
            <strong>Número RPS:</strong> {resultado.numeroRps}
          </p>
          {resultado.referencia && (
            <p>
              <strong>Referência:</strong> {resultado.referencia}
            </p>
          )}
        </div>
      )}

      <div className="consulta-section">
        <h2>🔍 Consultar Nota por Referência</h2>
        <div className="consulta-form">
          <input
            type="text"
            placeholder="Digite a referência da nota"
            value={referenciaConsulta}
            onChange={(e) => setReferenciaConsulta(e.target.value)}
          />
          <button onClick={handleConsultar} disabled={loading}>
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>

        {consulta && (
          <div className="consulta-result">
            <h3>Resultado da Consulta</h3>
            <p>
              <strong>Status:</strong> {consulta.status}
            </p>
            {consulta.numeroRps && (
              <p>
                <strong>Número RPS:</strong> {consulta.numeroRps}
              </p>
            )}
            {consulta.numero && (
              <p>
                <strong>Número NFSe:</strong> {consulta.numero}
              </p>
            )}
            {consulta.urlPdf && (
              <p>
                <strong>DANFSe:</strong>{" "}
                <a
                  href={montarUrlDownload(consulta.urlPdf)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Baixar PDF
                </a>
              </p>
            )}
            {consulta.urlXml && (
              <p>
                <strong>XML da Nota:</strong>{" "}
                <a
                  href={montarUrlDownload(consulta.urlXml)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Baixar XML
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmissaoNfse;