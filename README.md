# DATUM

Site institucional da DATUM Projetos e Geointeligencia.

## Desenvolvimento

Abra `index.html` diretamente no navegador ou execute um servidor estatico local.

```powershell
npx serve .
```

## Verificacao

```powershell
npm install
npx playwright install chromium
npm test
```

O teste gera uma auditoria visual e funcional em desktop e mobile dentro de
`reports/audit/`. Esses arquivos sao locais e nao devem ser versionados.
