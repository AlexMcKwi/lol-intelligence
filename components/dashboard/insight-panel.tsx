const insights = [
  {
    title: "Poor lead conversion",
    description: "You frequently lose games despite building an early advantage.",
    severity: "High",
    joke: "You treat a gold lead like a limited-time offer."
  },
  {
    title: "Overaggression detected",
    description: "Your death count is consistently reducing your mid-game impact.",
    severity: "Medium",
    joke: "The enemy team appreciates your donations."
  },
  {
    title: "Low map control",
    description: "Your vision contribution is below average for your role.",
    severity: "High",
    joke: "Your minimap is apparently decorative."
  },
  {
    title: "Weak laning phase",
    description: "You regularly fall behind in gold and experience before 15 minutes.",
    severity: "High",
    joke: "At this point your lane opponent should send you a thank-you note."
  },
  {
    title: "Inefficient farming",
    description: "Your CS per minute is significantly below players at your rank.",
    severity: "Medium",
    joke: "Even cannon minions are escaping you."
  },
  {
  title: "Objective neglect",
  description: "Your participation around dragons and heralds is too low.",
  severity: "High",
  joke: "You treat objectives like optional side quests."
},
{
  title: "Late rotation timing",
  description: "You often arrive late to critical fights and objectives.",
  severity: "Medium",
  joke: "You rotate like you're still buffering."
},
{
  title: "Excessive solo deaths",
  description: "You are frequently caught alone before major objectives spawn.",
  severity: "High",
  joke: "Your team sees 'An ally has been slain' more than the scoreboard."
},
{
  title: "Low damage efficiency",
  description: "Your gold income is not translating into meaningful teamfight impact.",
  severity: "Medium",
  joke: "All that farm just to tickle the frontline."
},
{
  title: "Weak teamfight positioning",
  description: "You are frequently eliminated early in coordinated fights.",
  severity: "High",
  joke: "Your positioning says 'highlight reel', but for the enemy team."
},
{
  title: "Passive early game",
  description: "You generate very little pressure during the first 10 minutes.",
  severity: "Low",
  joke: "The enemy laner forgot you existed."
},
{
  title: "Roaming inefficiency",
  description: "Your roams rarely convert into kills, assists, or objectives.",
  severity: "Medium",
  joke: "You roam like a tourist with no destination."
},
{
  title: "Vision denial missing",
  description: "You destroy fewer enemy wards than expected for your role.",
  severity: "Low",
  joke: "Enemy wards have longer lifespans than some ADCs."
},
{
  title: "Inconsistent carry impact",
  description: "Your performance drops sharply in games where your team falls behind.",
  severity: "Medium",
  joke: "You only carry under laboratory conditions."
},
{
  title: "Objective overforcing",
  description: "You frequently contest objectives in low-probability situations.",
  severity: "High",
  joke: "Every dragon fight becomes a true crime documentary."
},
{
  title: "Limited champion consistency",
  description: "Your win rate varies heavily between champions in your pool.",
  severity: "Medium",
  joke: "Your champion pool is more like a randomizer."
},
{
  title: "Underutilized vision windows",
  description: "You place too few wards before neutral objectives spawn.",
  severity: "Medium",
  joke: "Your support item is basically cosmetic."
},
{
  title: "Poor sidelane management",
  description: "Your wave control in side lanes often creates pressure against your team.",
  severity: "High",
  joke: "You splitpush like a paid actor for the enemy macro."
},
{
  title: "Low kill participation",
  description: "You are absent from too many successful team plays.",
  severity: "Medium",
  joke: "Your teammates see you mostly in post-game lobby."
},
{
  title: "Weak scaling execution",
  description: "Your impact does not improve enough in late-game situations.",
  severity: "Medium",
  joke: "Late game arrives and somehow you still haven't."
},
{
  title: "High unforced errors",
  description: "Mechanical mistakes are creating avoidable disadvantages.",
  severity: "High",
  joke: "Your keyboard is filing for workplace abuse."
},
{
  title: "Poor recall timing",
  description: "Your reset timings frequently cost lane pressure and resources.",
  severity: "Low",
  joke: "You recall like you're late for dinner."
},
{
  title: "Limited objective setup",
  description: "Your team rarely controls vision before major neutral fights.",
  severity: "High",
  joke: "Your Baron setups are basically surprise parties for the enemy."
},
{
  title: "Resource allocation issues",
  description: "You spend too much time sharing farm instead of maximizing income.",
  severity: "Medium",
  joke: "Your CS income is a charity program."
},
{
  title: "Weak early trading",
  description: "You lose a high percentage of lane trades in the first levels.",
  severity: "Medium",
  joke: "You trade HP like it's on clearance."
},
{
  title: "Tower pressure lacking",
  description: "You rarely convert kills into turret damage.",
  severity: "Medium",
  joke: "Turrets are safer around you than in fountain."
},
{
  title: "Predictable pathing",
  description: "Your movements are frequently anticipated by opponents.",
  severity: "Low",
  joke: "Even the enemy support knows your next move."
},
{
  title: "Risky ward placement",
  description: "You often die while attempting to establish vision.",
  severity: "Medium",
  joke: "You ward like a horror movie side character."
},
{
  title: "Low jungle proximity awareness",
  description: "You are frequently punished by enemy jungle pressure.",
  severity: "High",
  joke: "Enemy junglers see your lane as free real estate."
},
{
  title: "Unstable laning consistency",
  description: "Your early-game performance fluctuates heavily between matches.",
  severity: "Medium",
  joke: "Your lane phase is decided by coinflip physics."
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
