const insights = [
  {
    title: "Mauvaise conversion d’avantage",
    description: "Vous perdez fréquemment des parties malgré un avantage obtenu en début de jeu.",
    severity: "High",
    joke: "Vous traitez votre avance en gold comme une offre à durée limitée."
  },
  {
    title: "Suragressivité détectée",
    description: "Votre nombre de morts réduit régulièrement votre impact en milieu de partie.",
    severity: "Medium",
    joke: "L’équipe ennemie apprécie vos donations."
  },
  {
    title: "Faible contrôle de carte",
    description: "Votre contribution à la vision est inférieure à la moyenne pour votre rôle.",
    severity: "High",
    joke: "Votre minimap semble purement décorative."
  },
  {
    title: "Phase de lane faible",
    description: "Vous êtes régulièrement en retard en gold et en expérience avant 15 minutes.",
    severity: "High",
    joke: "À ce stade, votre adversaire de lane devrait vous envoyer une lettre de remerciement."
  },
  {
    title: "Farm inefficace",
    description: "Votre CS par minute est nettement inférieur à celui des joueurs de votre rang.",
    severity: "Medium",
    joke: "Même les sbires canon réussissent à vous échapper."
  },
  {
    title: "Négligence des objectifs",
    description: "Votre participation autour des dragons et des hérauts est trop faible.",
    severity: "High",
    joke: "Vous traitez les objectifs comme des quêtes secondaires optionnelles."
  },
  {
    title: "Rotations trop lentes",
    description: "Vous arrivez souvent en retard aux combats et objectifs importants.",
    severity: "Medium",
    joke: "Vous effectuez vos rotations comme si vous étiez encore en chargement."
  },
  {
    title: "Trop de morts en solo",
    description: "Vous vous faites fréquemment attraper seul avant l’apparition des objectifs majeurs.",
    severity: "High",
    joke: "Votre équipe entend 'Un allié a été tué' plus souvent qu’elle ne regarde le scoreboard."
  },
  {
    title: "Faible efficacité des dégâts",
    description: "Vos revenus en gold ne se traduisent pas par un impact significatif en teamfight.",
    severity: "Medium",
    joke: "Tout ce farm juste pour chatouiller la frontline."
  },
  {
    title: "Mauvais positionnement en teamfight",
    description: "Vous êtes fréquemment éliminé tôt dans les combats coordonnés.",
    severity: "High",
    joke: "Votre positionnement ressemble à un highlight… mais pour l’équipe ennemie."
  },
  {
    title: "Début de partie passif",
    description: "Vous générez très peu de pression durant les 10 premières minutes.",
    severity: "Low",
    joke: "Votre adversaire de lane avait oublié votre existence."
  },
  {
    title: "Roaming inefficace",
    description: "Vos roams se convertissent rarement en kills, assists ou objectifs.",
    severity: "Medium",
    joke: "Vous roam comme un touriste sans destination."
  },
  {
    title: "Manque de denial de vision",
    description: "Vous détruisez moins de wards ennemies que prévu pour votre rôle.",
    severity: "Low",
    joke: "Les wards ennemies vivent plus longtemps que certains ADC."
  },
  {
    title: "Impact carry irrégulier",
    description: "Vos performances chutent fortement lorsque votre équipe est en retard.",
    severity: "Medium",
    joke: "Vous ne carry que dans des conditions de laboratoire."
  },
  {
    title: "Forçage excessif des objectifs",
    description: "Vous contestez fréquemment des objectifs dans des situations à faible probabilité de réussite.",
    severity: "High",
    joke: "Chaque fight de dragon devient un documentaire criminel."
  },
  {
    title: "Pool de champions peu stable",
    description: "Votre taux de victoire varie fortement selon les champions joués.",
    severity: "Medium",
    joke: "Votre champion pool ressemble davantage à un randomizer."
  },
  {
    title: "Fenêtres de vision sous-exploitées",
    description: "Vous placez trop peu de wards avant l’apparition des objectifs neutres.",
    severity: "Medium",
    joke: "Votre item support est essentiellement cosmétique."
  },
  {
    title: "Mauvaise gestion des sidelanes",
    description: "Votre contrôle des vagues en sidelane crée souvent de la pression contre votre équipe.",
    severity: "High",
    joke: "Vous splitpush comme un acteur payé par le macro adverse."
  },
  {
    title: "Faible participation aux kills",
    description: "Vous êtes absent de trop nombreuses actions d’équipe réussies.",
    severity: "Medium",
    joke: "Vos coéquipiers vous voient surtout dans le lobby post-game."
  },
  {
    title: "Scaling mal exploité",
    description: "Votre impact n’augmente pas suffisamment en late game.",
    severity: "Medium",
    joke: "Le late game arrive… et vous toujours pas."
  },
  {
    title: "Trop d’erreurs non forcées",
    description: "Des erreurs mécaniques créent des désavantages évitables.",
    severity: "High",
    joke: "Votre clavier envisage de porter plainte pour maltraitance."
  },
  {
    title: "Mauvais timing de recall",
    description: "Vos resets coûtent fréquemment de la pression de lane et des ressources.",
    severity: "Low",
    joke: "Vous recall comme si vous étiez en retard pour dîner."
  },
  {
    title: "Préparation d’objectifs insuffisante",
    description: "Votre équipe contrôle rarement la vision avant les combats neutres importants.",
    severity: "High",
    joke: "Vos setups Baron ressemblent à des fêtes surprises pour l’équipe ennemie."
  },
  {
    title: "Problèmes d’allocation des ressources",
    description: "Vous passez trop de temps à partager le farm au lieu de maximiser vos revenus.",
    severity: "Medium",
    joke: "Votre revenu en CS ressemble à un programme caritatif."
  },
  {
    title: "Trades précoces faibles",
    description: "Vous perdez un pourcentage élevé d’échanges durant les premiers niveaux.",
    severity: "Medium",
    joke: "Vous échangez vos PV comme s’ils étaient en promotion."
  },
  {
    title: "Manque de pression sur les tours",
    description: "Vous convertissez rarement vos kills en dégâts sur les tourelles.",
    severity: "Medium",
    joke: "Les tourelles sont plus en sécurité avec vous qu’à la fontaine."
  },
  {
    title: "Pathing prévisible",
    description: "Vos déplacements sont fréquemment anticipés par les adversaires.",
    severity: "Low",
    joke: "Même le support ennemi connaît votre prochain mouvement."
  },
  {
    title: "Placement de wards risqué",
    description: "Vous mourez souvent en essayant d’établir de la vision.",
    severity: "Medium",
    joke: "Vous wardez comme un personnage secondaire dans un film d’horreur."
  },
  {
    title: "Faible awareness de la jungle",
    description: "Vous êtes fréquemment puni par la pression du jungler adverse.",
    severity: "High",
    joke: "Les junglers ennemis considèrent votre lane comme un bien immobilier gratuit."
  },
  {
    title: "Inconstance en phase de lane",
    description: "Vos performances en début de partie varient fortement d’un match à l’autre.",
    severity: "Medium",
    joke: "Votre phase de lane est décidée par les lois de la pièce lancée."
  }
]


export function InsightPanel() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Insights</h2>
        <p className="text-sm text-muted-foreground">
          Actionable recommendations based on recent match performance.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-3xl border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">{insight.title}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {insight.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
