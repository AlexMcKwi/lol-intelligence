// Simple test to check deduplication logic
const ALTERNATIVE_JOKES = {
  "Duplicate joke": [
    "Variante 1",
    "Variante 2"
  ]
}

function getAlternativeJoke(originalJoke, usedAlternatives) {
  const alternatives = ALTERNATIVE_JOKES[originalJoke]
  if (!alternatives) {
    return `${originalJoke} (Ce pattern se répète...)`
  }
  for (const alt of alternatives) {
    if (!usedAlternatives.has(alt)) {
      usedAlternatives.add(alt)
      return alt
    }
  }
  const randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)]
  return randomAlt
}

const used = new Set()
const original = "Duplicate joke"
const alternative = getAlternativeJoke(original, used)

console.log(`Original: "${original}"`)
console.log(`Alternative: "${alternative}"`)
console.log(`Are they different? ${alternative !== original}`)
console.log(`isAdapted should be: ${alternative !== original}`)
