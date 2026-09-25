# Dupla Do Açaí — Site

Site institucional e de pedidos em React + Vite + Tailwind CSS, com painel
administrativo (Firebase) e localização gratuita para entregas.

## Como rodar o projeto

```bash
npm install
npm run dev
```

Acesse o endereço mostrado no terminal (geralmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

O site funciona **sem nenhuma configuração extra**: sem o Firebase
configurado, ele roda em modo estático (cardápio fixo, sem horário
dinâmico, sem admin) — exatamente como antes dessas funcionalidades
existirem. As seções abaixo explicam como ativar tudo.

---

## 1. Configurar o Firebase

1. Crie um projeto em https://console.firebase.google.com.
2. Ative **Authentication** → método "E-mail/senha".
3. Ative **Firestore Database** (modo produção).
4. Em Firestore → Regras, cole o conteúdo de `firestore.rules` (na raiz
   do projeto) e publique.
5. Em Configurações do projeto → Geral → "Seus apps" → crie um app Web e
   copie os valores do `firebaseConfig`.
6. Copie `.env.example` para `.env` e preencha:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

7. Rode `npm run dev` novamente. O aviso de "Firebase não configurado" no
   console deve sumir.

## 2. Criar o primeiro administrador

O cadastro de admin não é público (por segurança). Para criar o primeiro:

1. No Console do Firebase → Authentication → Users → "Add user".
2. Informe e-mail e senha.
3. Acesse `/admin` no site e entre com esse e-mail/senha.

Qualquer usuário cadastrado no Authentication consegue acessar `/admin`
— cadastre só quem for de confiança.

## 3. Configurar o horário de funcionamento

1. Entre em `/admin` → **Horários**.
2. Marque os dias abertos e defina abertura/fechamento de cada um.
3. Clique em "Salvar horário".

Enquanto isso não for configurado, o indicador de "pedidos abertos"
mostra tudo fechado por padrão (nenhum horário é inventado). O site
público reflete a mudança automaticamente, em tempo real.

## 4. Cadastrar produtos pelo painel (opcional)

Em `/admin` → **Produtos**, você pode criar/editar/desativar sabores.
Assim que o primeiro produto for cadastrado no Firestore, o cardápio
público passa a usar essa fonte automaticamente em vez do arquivo
estático `src/data/products.js`. Sem nenhum produto cadastrado, o
cardápio fixo continua aparecendo normalmente.

## 5. Localização para entrega (gratuita)

No checkout, o botão **"📍 Usar minha localização"** usa a API nativa do
navegador (`navigator.geolocation`) + Nominatim/OpenStreetMap para
sugerir o endereço automaticamente — sem Google Maps API e sem custo.
Isso é só um atalho: o cliente sempre pode preencher o endereço
manualmente, e a localização nunca é solicitada automaticamente (só
depois do clique no botão).

No painel, dentro dos detalhes de um pedido, aparecem os botões **"Ver
localização"** e **"Abrir rota"** quando o pedido tiver coordenadas.

## 6. Variáveis de ambiente no Netlify

Site settings → Environment variables → adicione as mesmas 6 variáveis
`VITE_FIREBASE_*` do seu `.env`. Depois, redeploy o site (Deploys →
Trigger deploy) para que o build pegue os novos valores.

## 7. Deploy

O build continua sendo só `npm run build` (gera a pasta `dist/`), sem
servidor Node contínuo — o Firebase cuida de dados e autenticação. O
arquivo `public/_redirects` já está configurado para que rotas como
`/admin/pedidos` funcionem corretamente no Netlify (SPA redirect).

## 8. Testar o fluxo completo

1. Configure um horário de funcionamento que inclua o horário atual e
   confirme que o indicador fica verde ("Pedidos abertos") e o checkout
   libera os botões do WhatsApp.
2. Marque todos os dias como fechados e confirme que o checkout bloqueia
   com a mensagem de loja fechada.
3. No checkout, teste "Usar minha localização" permitindo e negando a
   permissão do navegador — em ambos os casos o pedido deve continuar
   sendo possível de finalizar.
4. Finalize um pedido de teste e confira: (a) ele aparece em `/admin` →
   Pedidos; (b) a mensagem do WhatsApp inclui data/hora, itens e
   endereço corretos; (c) o Dashboard e o Relatório mensal refletem esse
   pedido.

---

## 9. PWA (instalar na tela inicial)

O site agora é um PWA (Progressive Web App) via `vite-plugin-pwa`:

- **Manifest** (`vite.config.js` → bloco `manifest`): nome, cores,
  ícones (192/512, incluindo versões "maskable" para Android) e modo
  `standalone`.
- **Ícones**: gerados a partir da identidade visual atual em
  `public/icons/`, `public/apple-touch-icon.png` e `public/favicon.ico`.
  Se o logo oficial (arquivo de imagem) chegar depois, gere novos PNGs
  nesses mesmos tamanhos e substitua os arquivos.
- **Botão de instalar**: `src/pwa/InstallPWA.jsx` mostra "Instalar
  aplicativo" quando o navegador suporta (Android/desktop) e uma
  instrução de "Adicionar à Tela de Início" no Safari/iOS (que não tem
  esse botão nativo). Nunca aparece se o app já estiver instalado.
- **Atualização controlada**: `src/pwa/PwaUpdateToast.jsx` avisa
  quando há uma versão nova e só atualiza quando o cliente confirma —
  ninguém fica preso numa versão antiga nem é recarregado no meio de um
  pedido sem avisar.
- **Offline**: `src/pwa/OfflineBanner.jsx` mostra um aviso simples
  quando a conexão cai. O checkout (`OrderSection`) bloqueia o envio do
  pedido enquanto estiver offline, com uma mensagem clara.
- **Cache**: o Service Worker só faz cache do "app shell" estático
  (HTML/JS/CSS/ícones/fontes do Google Fonts). Firestore, Auth,
  WhatsApp (`wa.me`) e Nominatim/OpenStreetMap NUNCA são interceptados
  pelo cache — sempre vão direto para a rede, para nunca mostrar dados
  desatualizados (produtos, pedidos, login).
- Rotas de `/admin` não usam o fallback de navegação offline (só
  funcionam offline depois de já terem sido abertas pelo menos uma vez).

Para testar a instalação: abra o site publicado (PWA exige HTTPS, então
não funciona instalando via `localhost` em todos os navegadores — use
`npm run preview` ou o próprio Netlify) e confira se o botão de instalar
aparece no Chrome/Android, e a instrução aparece no Safari/iOS.

---

## O que editar primeiro (conteúdo estático)

1. **Logo**: coloque o arquivo em `public/images/logo/logo.png` e siga o
   comentário em `src/components/Header.jsx` para trocar o logo em SVG
   pela imagem real.
2. **Fotos dos produtos**: coloque os arquivos em `public/images/produtos/`
   com os nomes já usados em `src/data/products.js` (ou cadastre via
   painel, usando uma URL de imagem).
3. **Cardápio fixo (fallback)**: `src/data/products.js`.
4. **Contatos, cidades e taxa de entrega**: `src/data/business.js`.
5. **Texto "Sobre"**: `src/components/About.jsx` (comentário `EDITE AQUI`).
6. **Depoimentos**: `src/components/Testimonials.jsx` — são exemplos
   demonstrativos.
7. **Instagram**: já configurado em `src/data/business.js`.

## Estrutura

```
src/
  components/    UI e seções da página pública
  data/          cardápio fixo, contatos e horário padrão (fallback)
  hooks/         useCart, useBusinessHours, useProducts
  services/      escrita no Firestore (pedidos, produtos, horários)
  utils/         WhatsApp, fuso de Brasília, geolocalização/Nominatim
  admin/         painel administrativo (login, dashboard, produtos,
                 pedidos, relatórios, horários)
  firebase.js    inicialização do Firebase (com fallback se não configurado)
  Site.jsx       página pública (era o antigo App.jsx)
  App.jsx        roteador: "/" -> Site, "/admin/*" -> painel
```

## Observações importantes

- Sem Firebase configurado, o site funciona exatamente como antes:
  carrinho em memória, cardápio fixo, sem bloqueio por horário.
- A mensagem do WhatsApp inclui data/hora geradas pelo sistema no fuso
  de Brasília (`America/Sao_Paulo`) — nunca editáveis pelo cliente.
- O botão de finalizar pedido reverifica o horário de funcionamento no
  momento do envio (não só quando a página carregou) e é desabilitado
  durante o envio para evitar pedidos duplicados por clique repetido.
- A localização do cliente só é pedida mediante clique explícito no
  botão, nunca automaticamente, e não é armazenada fora do contexto de
  um pedido.
- Nenhuma taxa de entrega, endereço específico, horário real, custo de
  produto ou depoimento foi inventado — os campos ficaram preparados
  para vocês completarem pelo painel ou pelo código.
