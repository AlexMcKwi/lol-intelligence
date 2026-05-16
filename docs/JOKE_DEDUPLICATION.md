# Système de Déduplication et Adaptation des Jokes

## Vue d'ensemble

Ce système évite la répétition de jokes dans l'historique des matches. Lorsqu'une même joke se répète sur plusieurs matches, elle est automatiquement adaptée via OpenAI pour chaque occurence supplémentaire.

## Fonctionnement

### 1. **Détection des doublons**
- Pour chaque ensemble de matches d'un joueur, le système collecte toutes les jokes générées
- Il identifie les jokes identiques qui apparaissent 2 fois ou plus
- La première occurrence est gardée telle quelle
- Les occurrences suivantes sont marquées pour adaptation

### 2. **Adaptation via OpenAI**
- Pour chaque duplicate détecté, une requête OpenAI est envoyée
- La prompt inclut:
  - La joke originale
  - Les stats spécifiques du match (championName, KDA, CS/min, gold, dégâts, etc.)
  - Le type d'insight (pour le contexte)
  - Le résultat du match (victoire/défaite)

### 3. **Résultats**
- La joke adaptée remplace la joke dupliquée dans l'insight
- L'insight est marqué avec `isAdapted: true` pour suivi
- En cas d'erreur, la joke originale est conservée

## API

### Route: `/api/insights?userId={userId}`

**Réponse:**
```json
{
  "matchInsights": [
    {
      "title": "Suragressivité détectée",
      "description": "...",
      "severity": "Medium",
      "joke": "L'équipe ennemie apprécie vos donations.",
      "type": "warning",
      "body": "...",
      "isAdapted": false
    },
    {
      "title": "Faible contrôle de carte",
      "description": "...",
      "severity": "High",
      "joke": "Votre minimap avait besoin d'une pause.",
      "type": "warning",
      "body": "...",
      "isAdapted": true
    }
  ],
  "aggregatedInsights": [
    {
      "type": "macro",
      "severity": "high",
      "title": "Poor lead conversion",
      "description": "..."
    }
  ]
}
```

## Fonctions Principales

### `analyzeMatchPerformance(match, puuid)`
Analyse un match unique et retourne un array d'insights avec jokes statiques.

### `adaptJokeWithContext(originalJoke, match, puuid, insightType)`
Génère une variante d'une joke adaptée au contexte spécifique du match via OpenAI.
- **Paramètres:**
  - `originalJoke`: La joke à adapter
  - `match`: Les données complètes du match
  - `puuid`: Le PUUID du joueur
  - `insightType`: Le type d'insight (pour le contexte)

### `deduplicateAndAdaptJokes(matchesWithInsights)`
Traite un ensemble de matches avec leurs insights:
1. Détecte les jokes dupliquées
2. Pour chaque duplicate (à partir de la 2e occurence), appelle `adaptJokeWithContext`
3. Retourne les insights adaptés

**Paramètres:**
```typescript
Array<{
  match: any
  insights: any[]
  puuid: string
}>
```

## Exemple d'utilisation

```typescript
import {
  analyzeMatchPerformance,
  deduplicateAndAdaptJokes
} from '@/lib/riot/insights'

// Récupérer les matches
const matches = await getMatches(userId)

// Analyser chaque match
const matchesWithInsights = matches.map(match => ({
  match,
  insights: analyzeMatchPerformance(match, puuid),
  puuid
}))

// Adapter les jokes dupliquées
const adaptedMatches = await deduplicateAndAdaptJokes(matchesWithInsights)

// Utiliser les insights adaptés
adaptedMatches.forEach(item => {
  item.insights.forEach(insight => {
    console.log(`${insight.title}: ${insight.joke}`)
    if (insight.isAdapted) {
      console.log('(Cette joke a été adaptée pour ce match)')
    }
  })
})
```

## Considérations de Performance

- Les appels OpenAI sont asynchrones et peuvent prendre quelques secondes
- Seules les jokes dupliquées (2+ occurrences) génèrent des requêtes OpenAI
- Les erreurs d'adaptation ne bloquent pas le flux - la joke originale est utilisée en fallback
- La fonction est conçue pour être appelée une fois par requête d'insights du joueur

## Configuration

Assurez-vous que la clé API OpenAI est configurée:
```bash
OPENAI_API_KEY=sk-...
```

## Testing

Des tests complets sont disponibles dans `lib/riot/insights.test.ts`:
- Détection des doublons
- Adaptation des jokes
- Gestion des erreurs
- Cas limites (aucun duplicate, aucun insight, etc.)
