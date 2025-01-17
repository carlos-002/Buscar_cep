import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import './Styles.css';
import api from './Services/api';

function App() {
  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 

  const validCep = (cep) => /^[0-9]{5}-?[0-9]{3}$/.test(cep); // Validação do CEP

  async function handleSearch() {
    if (input === '') {
      setError("Introduza algum CEP");
      return;
    }

    if (!validCep(input)) { // Verifica se o CEP tem 8 dígitos
      setError("Formato de CEP inválido. Use o formato 12345-678.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.get(`${input.replace('-', '')}/json`);
      setCep(response.data); 
      setInput('');
    } catch (error) {
      setError('Erro ao buscar o endereço.');
    } finally {
      setLoading(false);
    }
  }

  // Função para permitir a busca com a tecla Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Buscador de CEP</h1>

      <div className="container-input">
        <input
          type="text"
          placeholder="Digite o seu CEP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="buttonsearch" onClick={handleSearch} disabled={loading} aria-label="Buscar CEP">
          {loading ? 'Carregando...' : <FiSearch size={25} color="#fff" />}
        </button>
      </div>

      {/* Exibição da mensagem de erro, caso exista */}
      {error && <p className="error-message">{error}</p>}

      {/* Exibição dos dados do CEP, se disponíveis */}
      {Object.keys(cep).length > 0 && (
        <main className="main">
          <h2>CEP: {cep.cep}</h2>
          <span>Rua: {cep.logradouro || 'Não disponível'}</span>
          <span>Bairro: {cep.bairro || 'Não disponível'}</span>
          <span>Cidade: {cep.localidade || 'Não disponível'}</span>
          <span>Estado: {cep.estado || 'Não disponível'}</span>
          <span>DDD: {cep.ddd || 'Não disponível'}</span>
        </main>
      )}
    </div>
  );
}

export default App;
