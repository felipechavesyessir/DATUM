# DATA ANIMAÇÃO

Especificação da animação da logotipo DATA no scroll da página inicial.

## Objetivo

Ao abrir a página, a animação central ainda não aparece aberta. A logotipo oficial fica no canto superior esquerdo do header. No primeiro scroll, o monograma oficial da DATA sai visualmente dessa posição, toma o centro da tela e revela o restante do nome da empresa. Como o monograma já representa o `D`, somente o texto `ata` aparece ao lado dele.

A intenção visual é premium, sutil e técnica: a marca funciona como momento emblemático curto da experiência. O início deve ter poucos elementos competindo visualmente; não deve haver frase junto da marca nem textos/cards do hero visíveis, apenas terrain lines suaves preenchendo toda a tela no fundo. Antes e durante a animação da DATA, essas curvas de nível devem se movimentar de forma ondulante e muito sutil. Logo no segundo movimento de scroll, a palavra completa desaparece com movimento suave, liberando o hero e suas informações relevantes.

## Arquivos Principais

- Logo vetorizada oficial: `assets/brand/data-logo-official-vector.svg`
- Estrutura HTML: `index.html`
- Estilos e motion: `styles.css`
- Controle por scroll: `script.js`
- Curvas de nível animadas no hero: `.hero-topography`, baseadas em `assets/brand/data-topographic-background-vector.svg`

## Regra da Logotipo

A animação deve sempre ser baseada na versão vetorial oficial:

`assets/brand/data-logo-official-vector.svg`

Não alterar:

- desenho do monograma;
- proporções do SVG;
- posição relativa dos traços;
- espessura dos traços oficiais;
- cores oficiais do SVG;
- composição visual do `D`.

Não aplicar:

- blur;
- glow;
- distorção;
- rotação decorativa;
- filtros visuais;
- recoloração arbitrária;
- sombra pesada;
- efeito 3D.

## SVG Oficial

Configuração base:

```html
<svg viewBox="0 0 1254 1254" fill="none">
```

Traços principais:

- Azul escuro técnico: `#071426`
- Azul do acento oficial: `#0068D9`
- `stroke-linecap="round"`
- `stroke-linejoin="round"`

Quantidade de traços animados no site:

- `7` elementos com a classe `.logo-trace`

Para permitir desenho progressivo no scroll, cada `path` ou `circle` animável deve manter:

```html
class="logo-trace"
pathLength="1"
```

## Tipografia

### Texto `ata`

Classe: `.scroll-brand-rest`

- Conteúdo: `ata`
- Fonte: `"Space Grotesk", "IBM Plex Sans", sans-serif`
- Peso: `600`
- Cor: `var(--deep)` ou `#071426`
- Tamanho desktop: `clamp(76px, 12.4vw, 158px)`
- Tamanho mobile: `clamp(54px, 18vw, 88px)`
- Altura de linha: `0.82`
- Letter spacing: `0.02em`
- Caixa: manter minúsculo, exatamente `ata`

### Frase de Impacto

Não usar frase de impacto na animação inicial. A marca deve aparecer sozinha, com o fundo de terrain lines suave.

## Cores

### Cores da Animação

- Monograma principal: `#071426`
- Acento azul do monograma: `#0068D9`
- Texto `ata`: `#071426`
- Fundo técnico da página: `#F7FAFC`
- Respiro atrás da marca: `rgba(247, 250, 252, 0.86)`

### Tokens Existentes no Site

```css
--deep: #071426;
--deep-2: #0b1c31;
--geo: #007ea7;
--ice: #f7fafc;
--paper: #ffffff;
--mist: #e9f0f5;
--gray: #5e6b76;
--graphite: #1d252c;
--green: #2fbf71;
```

Observação: o azul `#0068D9` pertence ao SVG oficial vetorizado. O token `--geo: #007ea7` continua sendo usado pelo restante da interface.

## Estrutura HTML

A animação central usa a camada fixa:

```html
<div class="scroll-brand-lockup" id="scroll-brand-lockup" aria-hidden="true">
  <div class="scroll-brand-wordmark">
    <svg class="data-vector-logo scroll-brand-monogram">...</svg>
    <span class="scroll-brand-rest">ata</span>
  </div>
</div>
```

Regras:

- `aria-hidden="true"` porque a marca animada é decorativa e duplicada visualmente.
- O link acessível principal continua sendo a `.brand` no header.
- O monograma central deve usar o mesmo SVG oficial do header.

## Layout da Assinatura Central

Classe: `.scroll-brand-lockup`

```css
position: fixed;
left: 50%;
top: 50%;
z-index: 62;
width: min(76vw, 620px);
pointer-events: none;
```

Transformação controlada por variáveis:

```css
translate(-50%, -50%)
translate(calc(var(--lockup-x) * 1px), calc(var(--lockup-y) * 1px))
scale(var(--lockup-scale))
```

Valores iniciais:

- `--lockup-opacity: 0`
- `--lockup-scale: 0.34` no CSS, atualizado pelo JavaScript
- `--lockup-x: 320`
- `--lockup-y: -240`

O JavaScript atualiza esses valores conforme o scroll.

## Tamanho do Monograma Central

Classe: `.scroll-brand-monogram`

Desktop:

```css
flex: 0 0 clamp(112px, 17vw, 184px);
width: clamp(112px, 17vw, 184px);
height: clamp(112px, 17vw, 184px);
```

Mobile:

```css
flex-basis: clamp(82px, 24vw, 118px);
width: clamp(82px, 24vw, 118px);
height: clamp(82px, 24vw, 118px);
```

## Tamanho do Header

Classe: `.brand`

Desktop:

```css
width: 62px;
height: 62px;
```

Mobile:

```css
width: 54px;
height: 54px;
```

Durante a animação, a logo do header reduz presença:

```css
body.logo-in-motion .brand {
  opacity: 0.16;
}

body.logo-in-motion .brand .data-vector-logo {
  transform: translateY(4px) scale(0.94);
}
```

## Desenho dos Traços

Classe: `.data-vector-logo .logo-trace`

```css
stroke-dasharray: 1;
stroke-dashoffset: calc(1 - var(--logo-draw, 1));
transition:
  stroke-dashoffset 220ms linear,
  stroke-width var(--medium) var(--ease-out);
```

Variável principal:

```css
--logo-draw
```

No scroll, ela vai de `0.18` até `1`.

## Lógica de Scroll

Função principal:

```js
updateLogoMarker()
```

Elementos controlados:

- `#logo-map-marker`
- `.brand`
- `#scroll-brand-lockup`
- `#inicio`

Progresso base:

```js
const rect = heroSection.getBoundingClientRect();
const travel = Math.max(rect.height - window.innerHeight * 0.45, 1);
const progress = clamp(-rect.top / travel, 0, 1);
```

Easing:

```js
const eased = 1 - Math.pow(1 - progress, 3);
const introExit = clamp(progress / 0.64, 0, 1);
const introEase = 1 - Math.pow(1 - introExit, 4);
const fade = clamp((introExit - 0.28) / 0.6, 0, 1);
const fadeEase = 1 - Math.pow(1 - fade, 3);
```

Escala da assinatura:

```js
const lockupScale = 0.98 - 0.16 * introEase;
```

Saída do texto `ata`:

```js
const wordOpacity = 1 - fadeEase;
const wordShift = -28 * fadeEase;
```

Estados de classe:

```js
document.body.classList.toggle("logo-in-motion", introExit < 0.78);
document.body.classList.toggle("logo-centered", introExit < 0.82);
```

## Comportamento Visual por Etapa

1. Inicio da página:
   - header mostra o monograma oficial em `62px`;
   - logo oficial fica no canto superior esquerdo;
   - assinatura central ainda não aparece aberta;
   - `--lockup-opacity: 0`;
   - o início mostra apenas terrain lines suaves, em movimento e preenchendo a tela, sem frase junto da marca e sem textos/cards do hero.

2. Primeiro scroll:
   - o `D` sai visualmente da logo do canto superior esquerdo;
   - o monograma toma o centro da tela;
   - `ata` aparece para formar `Data`;
   - as curvas de nível continuam se movimentando suavemente ao fundo.

3. Segundo movimento de scroll:
   - `ata` reduz opacidade com leve deslocamento;
   - a palavra completa desaparece de forma curta e animada;
   - monograma mantém o desenho oficial completo;
   - hero e console voltam a aparecer por trás.

4. Saída:
   - marca sai animada por `transform` e `opacity`;
   - conteúdo principal assume a leitura;
   - marcador do mapa continua respondendo ao scroll.

## Responsividade

Em telas abaixo de `720px`:

- header usa logo com `54px`;
- assinatura central usa largura `min(92vw, 420px)`;
- monograma central reduz para `82px` a `118px`;
- texto `ata` reduz para `54px` a `88px`;
- margem entre monograma e texto fica em `-18px`.

## Acessibilidade e Movimento Reduzido

Para usuários com `prefers-reduced-motion: reduce`:

```css
.scroll-brand-lockup {
  display: none;
}
```

Também são reduzidas transições e animações globais.

## Checklist Antes de Alterar

- A logo continua baseada em `data-logo-official-vector.svg`?
- O `viewBox` continua `0 0 1254 1254`?
- O texto revelado continua sendo apenas `ata`?
- A animação continua sem frase abaixo da marca?
- O SVG preserva `#071426` e `#0068D9`?
- A animação usa `transform` e `opacity`, não propriedades de layout?
- `prefers-reduced-motion` continua respeitado?
- A marca não recebeu filtros, brilho, blur ou distorção?
- A validação do Impeccable retorna sem problemas?
- O screenshot com Playwright confirma a marca legível no centro?

## Comandos de Validação

```bash
npm run browser:screenshot
npx impeccable detect --fast --json index.html styles.css script.js
```

Screenshot atual de referência:

```text
reports/screenshots/data-official-vector-wordmark-polished.png
```
