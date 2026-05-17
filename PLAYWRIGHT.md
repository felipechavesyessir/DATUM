# Playwright Browser Automation

Playwright está configurado neste projeto para automatizar navegação, busca e screenshots.

Referência oficial usada:

https://github.com/microsoft/playwright

## Comandos

Pesquisar no navegador:

```bash
npm run browser:search -- "termo de busca"
```

Exemplo:

```bash
npm run browser:search -- "DATA geodésia cartografia"
```

O resultado gera:

- JSON com links encontrados em `reports/browser-search/`
- Screenshot da página de busca em `reports/browser-search/`

Tirar screenshot do site DATA:

```bash
npm run browser:screenshot
```

O resultado gera:

- Screenshot em `reports/screenshots/data-home.png`
- Resumo no terminal com título, H1 e dimensões da logo renderizada

## Arquivos

- `scripts/playwright-search.mjs`: pesquisa automatizada no navegador.
- `scripts/playwright-screenshot.mjs`: screenshot e inspeção básica do site.
- `package.json`: scripts npm para executar as automações.

## Nota

A logo oficial da DATA continua sendo usada como PNG intacto:

`assets/brand/data-logo-official.png`
