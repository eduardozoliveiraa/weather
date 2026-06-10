# Clima

Aplicação web responsiva para consultar condições meteorológicas atuais, previsão para as próximas horas e dias e qualidade do ar. Os dados são obtidos pela [OpenWeather](https://openweathermap.org/) e a aplicação também pode funcionar localmente com dados simulados.

## Funcionalidades

- Detecção automática da localização pelo navegador
- Busca de cidades com sugestões por geocodificação
- Temperatura atual, sensação térmica, mínimas e máximas
- Umidade, pressão, visibilidade, vento, nascer e pôr do sol
- Previsão das próximas 24 horas em intervalos de 3 horas
- Previsão detalhada para 5 dias
- Índice de qualidade do ar e concentração de poluentes
- Tema claro e escuro com preferência salva no navegador
- Fundo e ícones adaptados às condições climáticas
- Estados de carregamento e layout responsivo
- Modo mock para desenvolvimento sem chave de API

## Tecnologias

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Axios](https://axios-http.com/)
- [date-fns](https://date-fns.org/)
- [Lucide React](https://lucide.dev/)
- [OpenWeather API](https://openweathermap.org/api)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm
- Uma chave da OpenWeather, caso queira utilizar dados reais

## Instalação

Clone o repositório, acesse a pasta e instale as dependências:

```bash
git clone <url-do-repositorio>
cd clima
npm install
```

Crie o arquivo de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha a chave no arquivo `.env`:

```env
VITE_OPENWEATHER_API_KEY=sua_chave_aqui
VITE_USE_MOCKS=false
```

Para obter uma chave, crie uma conta na [OpenWeather](https://home.openweathermap.org/users/sign_up). Uma chave nova pode levar algum tempo para ser ativada.

## Execução

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

O navegador solicitará permissão de localização na primeira visita. Se ela for negada, ainda será possível consultar uma cidade pela busca.

## Modo mock

Para executar a interface sem consumir a API, configure:

```env
VITE_USE_MOCKS=true
```

O modo mock também é ativado automaticamente quando `VITE_OPENWEATHER_API_KEY` não está definida. Nesse modo, são exibidos dados simulados e as sugestões de cidades ficam desabilitadas.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica o TypeScript e gera a versão de produção em `dist/` |
| `npm run lint` | Executa o ESLint no projeto |
| `npm run preview` | Serve localmente a versão gerada em `dist/` |

## Estrutura

```text
clima/
├── public/                 # Arquivos públicos
├── src/
│   ├── components/         # Componentes visuais e seus estilos
│   ├── contexts/           # Estado global do tema
│   ├── hooks/              # Hook de geolocalização
│   ├── services/           # Integração com a API e dados mock
│   ├── types/              # Tipos dos dados meteorológicos
│   ├── App.tsx             # Composição e fluxo principal
│   └── main.tsx            # Entrada da aplicação
├── .env.example            # Exemplo de configuração
├── package.json            # Dependências e scripts
└── vite.config.ts          # Configuração do Vite
```

## APIs utilizadas

A aplicação consome os seguintes serviços da OpenWeather:

- Current Weather Data
- 5 Day / 3 Hour Forecast
- Air Pollution API
- Geocoding API

As requisições usam unidades métricas e respostas em português do Brasil.

## Build de produção

Gere os arquivos otimizados:

```bash
npm run build
```

Para validar o resultado localmente:

```bash
npm run preview
```

O conteúdo de `dist/` pode ser publicado em serviços de hospedagem estática. Configure `VITE_OPENWEATHER_API_KEY` no ambiente de build da plataforma.

