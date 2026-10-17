// Flat config ESLint 9+ (unica forma supportata; .eslintrc e --ext non esistono piu').
// Qui il passo "Syntax check" della CI fa solo controllo di sintassi: nessuna
// regola di stile e nessun ambiente browser/Node, quindi i glob non sono
// dichiarati e le regole predefinite sono spente.
export default [];
