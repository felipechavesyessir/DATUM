# Agent Instructions - DATA Animacao da Logotipo

Este arquivo define as instrucoes obrigatorias para qualquer agente que altere, revise ou recrie a animacao da logotipo DATA no inicio do site.

## Regra Principal Obrigatoria

A animacao deve sempre seguir este comportamento:

1. O `D` da logotipo DATA deve sair visualmente la de cima, vindo da area do header/topo.
2. A animacao nao deve comecar ja aberta no centro: ela deve nascer a partir da logotipo no canto superior esquerdo.
3. Durante o scroll, esse `D` deve tomar o centro da tela.
4. No centro da tela, deve aparecer o restante da palavra, apenas `ata`, formando visualmente `Data`.
5. Logo no segundo movimento de scroll, a palavra completa deve desaparecer com animacao suave.
6. A animacao deve ser curta, objetiva e premium no inicio do site, sem demorar ou virar uma intro longa.
7. O ponto de leitura principal da animacao deve ser sempre o centro da tela.

## Fonte Oficial da Logotipo

A animacao deve ser baseada obrigatoriamente no arquivo:

`assets/brand/data-logo-official-vector.svg`

O `D` da animacao deve ser o monograma oficial desse SVG. Nao usar desenho alternativo, nao redesenhar por memoria e nao trocar por outra versao.

## Composicao Obrigatoria

A marca animada deve ser composta assim:

```text
[D oficial da logotipo] + [ata]
```

Regras:

- O `D` vem da logotipo oficial vetorizada.
- O texto adicional deve ser somente `ata`.
- Nao escrever `Data` inteiro como texto, porque o `D` ja e a logotipo.
- Nao substituir o `D` por uma letra comum.
- O conjunto deve ficar centralizado horizontalmente na tela.
- Nao usar frase abaixo da marca no inicio da animacao.

## Movimento Obrigatorio

O movimento deve ser controlado pelo scroll.

### Estado inicial

- A animacao central nao deve aparecer aberta automaticamente.
- A logotipo oficial deve estar visivel no canto superior esquerdo do header.
- O inicio do site deve ter poucos elementos competindo visualmente: usar apenas curvas de nivel/terrain lines suaves preenchendo a tela inteira no fundo ate a animacao sair, sem textos ou cards do hero visiveis.
- Antes de comecar a animacao da DATA e durante a animacao, as curvas de nivel devem se movimentar de forma suave, como terrain lines.
- O `D` deve parecer sair da propria logotipo do header.

### Durante o scroll

- O `D` deve completar a composicao com `ata`.
- A marca deve tomar o centro da tela.
- Enquanto a marca estiver no centro, o hero deve ficar suavizado ao fundo.
- As curvas de nivel do fundo devem continuar em movimento sutil durante a composicao da marca.
- Usar movimento suave, com `transform` e `opacity`.
- Nao animar propriedades de layout como `width`, `height`, `top` ou `left` quando `transform` resolver.

### Saida

- Logo no segundo movimento de scroll, a palavra `Data` deve desaparecer com animacao.
- A saida deve ser curta e sutil: reduzir opacidade, deslocar levemente e liberar o conteudo da pagina.
- O hero deve voltar a ficar legivel depois que a marca sair.

## Estilo Visual Obrigatorio

A animacao deve parecer:

- premium;
- tecnica;
- sutil;
- limpa;
- geoespacial;
- institucional;
- precisa.

A animacao nao deve parecer:

- chamativa demais;
- infantil;
- futurista exagerada;
- com brilho artificial;
- com efeito 3D;
- com distorcao da marca;
- como intro de video pesada.

## Cores Obrigatorias

Preservar as cores da logotipo oficial:

- Azul escuro tecnico: `#071426`
- Azul do acento oficial: `#0068D9`

Para o texto `ata`:

- Usar `#071426` ou `var(--deep)`.

Nao usar frase de impacto na animacao inicial.

Nao aplicar recoloracao arbitraria, gradiente, glow, blur ou sombra pesada na logotipo.

## Tipografia Obrigatoria

Texto `ata`:

```css
font-family: "Space Grotesk", "IBM Plex Sans", sans-serif;
font-weight: 600;
letter-spacing: 0.02em;
```

O texto deve permanecer em caixa baixa:

```text
ata
```

## Estrutura Recomendada

Usar uma camada fixa para a assinatura animada:

```html
<div class="scroll-brand-lockup" id="scroll-brand-lockup" aria-hidden="true">
  <div class="scroll-brand-wordmark">
    <svg class="data-vector-logo scroll-brand-monogram">...</svg>
    <span class="scroll-brand-rest">ata</span>
  </div>
</div>
```

Regras:

- `aria-hidden="true"` porque a animacao e decorativa.
- A logo acessivel principal continua no header.
- A camada deve usar `pointer-events: none`.
- A camada deve ficar acima do hero, mas nao bloquear interacoes depois da saida.

## CSS Obrigatorio

Usar variaveis para controlar a animacao:

```css
--lockup-opacity
--lockup-scale
--lockup-x
--lockup-y
--word-opacity
--word-shift
--lockup-draw
```

As curvas de nivel do fundo devem ser baseadas em `assets/brand/data-topographic-background-vector.svg`, ocupar a tela inteira no estado inicial e ser SVG real ou outro recurso animavel equivalente, nao apenas uma imagem estatica, para permitir movimento sutil dos tracos.

Usar `transform` para movimento e escala:

```css
transform:
  translate(-50%, -50%)
  translate(calc(var(--lockup-x) * 1px), calc(var(--lockup-y) * 1px))
  scale(var(--lockup-scale));
```

## JavaScript Obrigatorio

A animacao deve ser atualizada por uma funcao de scroll, preferencialmente:

```js
updateLogoMarker()
```

Regras:

- Calcular o progresso com base na secao `#inicio`.
- Usar `requestAnimationFrame` no listener de scroll.
- Usar easing suave com potencia, como `1 - Math.pow(1 - value, 4)`.
- Alternar estados no `body`, como `logo-prelude`, `logo-in-motion` e `logo-centered`.
- Respeitar resize chamando novamente a funcao de atualizacao.

## Acessibilidade

Obrigatorio respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Nesse caso, a animacao central pode ser ocultada ou reduzida drasticamente.

## Proibido

- Trocar o SVG oficial por outro desenho.
- Usar a palavra `Data` inteira como texto comum.
- Animar um `D` tipografico em vez do monograma oficial.
- Esticar, comprimir ou distorcer a logotipo.
- Aplicar filtros, glow, blur, bevel ou 3D.
- Fazer a marca sair do centro de leitura durante a composicao principal.
- Transformar a animacao em uma intro longa ou lenta.
- Deixar a animacao travada depois que o usuario continua descendo.

## Validacao Obrigatoria

Depois de alterar a animacao, rodar:

```bash
npm run browser:screenshot
npx impeccable detect --fast --json index.html styles.css script.js
```

Tambem verificar visualmente estes estados:

1. Inicio do site: a animacao central ainda nao esta aberta, e a logo oficial esta no canto superior esquerdo.
2. Scroll inicial: o `D` sai da logo superior esquerda e se conecta ao restante `ata` no centro.
3. Momento emblematico: a marca fica no centro e o hero permanece suavizado ao fundo.
4. Segundo movimento de scroll: a palavra completa desaparece com animacao curta e suave.
5. Depois da saida: hero volta legivel e usavel, com informacoes relevantes.

## Referencia Complementar

Consultar tambem:

`DATA ANIMACAO.md`

Observacao: se o arquivo com acento existir como `DATA ANIMAÇÃO.md`, ele e a referencia detalhada da especificacao atual.
