# Agent Instructions - DATUM Website

## Instrucao Obrigatoria de Animacao da Logotipo

Quando a tarefa envolver a animacao da logotipo DATUM, seguir obrigatoriamente o arquivo:

`agent-animacao.md`

Regra resumida: a animacao central nao deve comecar aberta. A logo oficial deve ficar no canto superior esquerdo; no primeiro scroll, o `D` oficial deve sair visualmente dessa logo, tomar o centro da tela, revelar apenas o restante da palavra (`atum`) para formar `Datum`; logo no segundo movimento de scroll, a palavra completa deve desaparecer com uma animacao curta, suave e premium. No inicio, nao usar frase junto da marca: apenas terrain lines/curvas de nivel suaves no fundo, movimentando-se antes e durante a animacao da DATUM. Depois da saida, aparecem as informacoes relevantes.

Para animacoes, esta regra substitui qualquer instrucao antiga que proiba o uso da versao vetorial. A animacao deve usar o arquivo oficial:

`assets/brand/datum-logo-official-vector.svg`

Nao alterar desenho, cores, proporcoes, espessuras ou composicao do monograma.

## Regras Obrigatorias Para Mobile

Ao adaptar o site para mobile, nao mudar o conteudo nem as animacoes existentes.

Isso significa:

- Nao reescrever, remover, resumir ou trocar textos.
- Nao alterar a ordem conceitual das secoes.
- Nao remover elementos importantes para "simplificar" a versao mobile.
- Nao mudar o comportamento, ritmo, gatilhos, sequencia ou intencao das animacoes.
- Nao substituir animacoes por versoes diferentes no mobile.
- Nao desligar animacoes, exceto quando houver preferencia explicita do usuario por reducao de movimento.
- Ajustar apenas o que for necessario para responsividade: tamanhos, espacamentos, quebras, alinhamentos, largura, altura, leitura e toque.
- Preservar a experiencia visual e narrativa da versao desktop, apenas reorganizada para caber bem em telas pequenas.

## Objetivo

Criar um site institucional para uma empresa chamada **DATUM**, seguindo integralmente as diretrizes do brandbook:

`C:\Users\felip\Documents\Felipe\2. Pessoal\Fotos e Vídeos\Brandbook Datum Identidade Geoespacial.pdf`

O site deve transmitir uma marca de inteligência geoespacial aplicada, com aparência técnica, premium, confiável, contemporânea e adequada para engenharia, cartografia, geodésia, GIS e análise territorial.

## Logo Oficial

A logotipo oficial da DATUM é a imagem PNG:

`C:\Users\felip\Documents\Felipe\2. Pessoal\Fotos e Vídeos\ChatGPT Image 8 de mai. de 2026, 17_57_31.png`

### Regra obrigatória

**Não alterar de forma nenhuma a logotipo da empresa quando ela estiver no site.**

Isso significa:

- Não redesenhar a logo.
- Não vetorizar a logo.
- Não recriar a logo em SVG, CSS, canvas ou texto.
- Não mudar cores, proporções, espessuras, curvas, recortes ou composição.
- Não aplicar filtros, sombras, gradientes, glow, blur, bevel, distorções ou efeitos.
- Não cortar partes da imagem.
- Não comprimir visualmente ou esticar a imagem.
- Não substituir a imagem PNG por outra versão.
- Não alterar o fundo da imagem, a menos que o próprio arquivo PNG já venha com transparência.
- Usar sempre a imagem PNG oficial como asset visual da marca.

No HTML/CSS, a logo deve ser renderizada como imagem, preservando proporção:

```html
<img src="CAMINHO_DA_LOGO.png" alt="DATUM" />
```

Use CSS seguro:

```css
img.logo {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  object-fit: contain;
}
```

## Essência da Marca

DATUM vem do conceito de datum geográfico: modelo matemático usado para representar a Terra e definir coordenadas espaciais com precisão.

A marca deve comunicar:

- Precisão técnica.
- Engenharia.
- Confiabilidade.
- Rastreabilidade.
- Leitura espacial.
- Cartografia moderna.
- Tecnologia aplicada.
- Análise territorial.
- Geodésia e dados.

A marca deve parecer:

- Empresa de engenharia moderna.
- Consultoria geoespacial premium.
- Plataforma técnica confiável.
- Inteligência territorial aplicada.
- Empresa de dados espaciais.

A marca não deve parecer:

- Startup genérica.
- Agência criativa.
- Marca futurista exagerada.
- Software infantil.
- Empresa tech abstrata.

## Conceito Visual

A identidade visual deve ser baseada em:

- Curvas de nível.
- Relevo topográfico.
- Dois picos conectados.
- Continuidade espacial.
- Fluxo de dados.
- Leitura territorial.
- Precisão geométrica.

O símbolo e os elementos visuais devem remeter a:

- Topografia.
- Elevação gradual.
- Modelagem espacial.
- Superfície geográfica.
- Interpretação técnica do terreno.

## Sistema Geométrico

Use uma linguagem visual limpa, modular e precisa:

- Grid modular.
- Alinhamento horizontal.
- Proporções consistentes.
- Curvas com espessura uniforme.
- Poucas linhas, sempre legíveis.
- Sensação de elevação gradual.
- Assimetria controlada.
- Fluxo horizontal elegante.

Evitar:

- Sombras decorativas.
- Texturas.
- Efeitos 3D.
- Excesso de curvas.
- Aparência orgânica exagerada.
- Formas aleatórias.
- Gradientes chamativos.
- Glow.
- Bevel.

## Paleta Oficial

### Primária

**Azul Técnico Profundo**

- HEX: `#071426`
- RGB: `7 / 20 / 38`
- Uso: fundo principal, elementos premium, títulos, áreas de maior autoridade visual.

**Azul Geoespacial**

- HEX: `#007EA7`
- RGB: `0 / 126 / 167`
- Uso: destaques, linhas técnicas, elementos tecnológicos, links, interações e detalhes cartográficos.

**Branco Gelo**

- HEX: `#F7FAFC`
- RGB: `247 / 250 / 252`
- Uso: fundos claros, contraste, dashboards, documentos e áreas limpas.

### Secundária

**Cinza Técnico**

- HEX: `#5E6B76`

**Grafite**

- HEX: `#1D252C`

**Verde Coordenada**

- HEX: `#2FBF71`
- Uso extremamente moderado: status, confirmação, dados ativos, sensores e elementos GIS.

## Tipografia

### Marca

Preferir **Space Grotesk SemiBold** para títulos grandes, chamadas e elementos de marca.

Características desejadas:

- Tecnológica.
- Geométrica.
- Sofisticada.
- Moderna.
- Corporativa.

### Institucional e Interface

Usar **Inter** como fonte principal para:

- Conteúdo do site.
- Dashboards.
- Relatórios.
- Interfaces.
- Componentes de navegação.

### Alternativa Técnica

Usar **IBM Plex Sans** quando o conteúdo tiver caráter mais técnico, documental ou de engenharia.

## Linguagem de Interface

O site deve funcionar naturalmente para:

- GIS.
- Geotecnologia.
- Topografia.
- Geotecnia.
- Engenharia.
- LiDAR.
- Drones.
- Cartografia.
- Inteligência territorial.
- Mineração.
- Meio ambiente.
- Logística.
- Infraestrutura.

Elementos de interface:

- Botões com cantos suaves.
- Contraste limpo.
- Aparência técnica.
- Cards minimalistas.
- Poucas bordas.
- Alta legibilidade.
- Mapas ou fundos cartográficos neutros quando fizer sentido.
- Azul geoespacial como cor de destaque.

## Tom de Voz

A comunicação deve ser:

- Clara.
- Direta.
- Objetiva.
- Técnica.
- Confiável.
- Autoritária sem exagero.

Evitar:

- Buzzwords.
- Promessas vagas.
- Marketing vazio.
- Exagero futurista.
- Jargão excessivo.

Exemplos de linguagem adequada:

- "Transformamos dados geoespaciais em informação técnica pronta para decisão."
- "Precisão territorial aplicada à engenharia."
- "Modelagem espacial com rastreabilidade técnica."
- "Cartografia inteligente para operações de campo."

Evitar frases como:

- "Tecnologia disruptiva para revolucionar o mercado."
- "Soluções inovadoras de última geração."
- "Ecossistema inteligente e futurista."

## Conteúdo Sugerido Para o Site

O site pode apresentar:

- Hero institucional com DATUM como marca principal.
- Proposta de valor: inteligência espacial aplicada.
- Serviços ou frentes de atuação.
- Aplicações por setor.
- Seção sobre precisão, rastreabilidade e engenharia.
- Elementos visuais inspirados em curvas de nível, grids, coordenadas, mapas, triangulação, satélite, LiDAR e georreferenciamento.
- Chamada para contato técnico ou diagnóstico geoespacial.

Assinatura conceitual:

**DATUM**

Inteligência espacial aplicada.

Precisão geográfica para engenharia, análise territorial e tomada de decisão.

## Direção Final

O resultado deve ser:

- Memorável.
- Limpo.
- Escalável.
- Técnico.
- Premium.
- Contemporâneo.
- Confiável.
- Com autoridade técnica real.

O site deve parecer adequado tanto para uma interface GIS quanto para um relatório técnico ou apresentação corporativa de engenharia.
