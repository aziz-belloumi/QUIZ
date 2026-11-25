# CS Interview Quiz 🌊

A bilingual (EN / FR) multiple-choice quiz covering common computer-science interview topics for internships and junior roles.

**Live demo → [your-username.github.io/entretien](https://your-username.github.io/entretien)**

## Topics covered

| ID | Category |
|----|----------|
| `general` | Soft skills & mindset |
| `dsa` | Algorithms & data structures |
| `logic` | Logic & puzzles |
| `js` | JavaScript |
| `web` | Web & HTTP |
| `python` | Python |
| `db` | Databases |
| `cs` | OS & networking |
| `eng` | Git & engineering |
| `sys` | System design |
| `ai` | AI & ML |
| `llm` | LLMs |
| `rag` | RAG |
| `agents` | AI Agents |

## Project structure

```
entretien/
├── index.html   # Markup only — no inline CSS or JS
├── style.css    # All styles
├── data.js      # Question bank (RAW) and UI translations (T)
└── app.js       # Quiz logic and event handlers
```

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under *Source*, select **Deploy from a branch** → `main` → `/ (root)`.
4. Save — your quiz is live in ~60 seconds.

## Adding questions

Open [`data.js`](data.js) and append a line inside any category's template literal:

```
EN question|FR question|Correct answer//Réponse correcte|Wrong 1|Wrong 2|Wrong 3
```

- The **correct answer is always listed first**; the page shuffles order at runtime.
- Use `English//Français` for bilingual answer text, or plain text if both languages are identical.

## License

MIT
