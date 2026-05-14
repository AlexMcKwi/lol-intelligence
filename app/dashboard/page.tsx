'use client'

import React, { useState } from 'react'

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [error, setError] = useState('')

  const pageTitles = {
    dashboard: 'Tableau de <span>Bord</span>',
    insights: 'Insights <span>IA</span>',
    postgame: 'Résumé <span>Post-Game</span>',
    progression: 'Suivi de <span>Progression</span>',
  }

  const showView = (view: string) => {
    setCurrentView(view)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la connexion')
        setIsLoading(false)
        return
      }

      // Connexion réussie - garder le loading visible
      setTimeout(() => {
        setIsLoading(false)
        setIsAuthenticated(true)
      }, 1800)
    } catch (err) {
      setError('Erreur de connexion au serveur')
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, password: registerPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'inscription')
        setIsLoading(false)
        return
      }

      // Inscription réussie - garder le loading visible
      setTimeout(() => {
        setIsLoading(false)
        setIsAuthenticated(true)
      }, 1800)
    } catch (err) {
      setError('Erreur de connexion au serveur')
      setIsLoading(false)
    }
  }

  const syncMatches = () => {
    // Simulate sync
    setTimeout(() => {
      showToast('Synchronisation', '5 nouvelles parties importées depuis Riot API')
    }, 2200)
  }

  const showToast = (title: string, body: string) => {
    // Simple toast implementation
    console.log(`${title}: ${body}`)
  }

  if (!isAuthenticated) {
    return (
      <>
        {/* LOADING */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="sidebar-logo" style={{fontSize: '2rem'}}>LOL<span>·IA</span></div>
            <div className="loading-bar"></div>
            <div className="loading-text">Chargement du profil...</div>
          </div>
        )}

        {/* AUTH */}
        <div id="auth-screen">
          <div className="auth-logo">LOL<span>·IA</span></div>
          <div className="auth-tagline">Plateforme de Progression Compétitive</div>
          <div className="auth-card">
            <div className="auth-tabs">
              <div 
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login')
                  setError('')
                }}
              >
                Connexion
              </div>
              <div 
                className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register')
                  setError('')
                }}
              >
                Inscription
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {error}
              </div>
            )}

            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="auth-field">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Mot de passe</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="auth-field">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Mot de passe</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="auth-riot-link">
                  🎮 &nbsp; Connecter mon compte Riot Games (optionnel)
                </div>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                </button>
              </form>
            )}
          </div>
          <div className="text-muted">Données sécurisées avec bcrypt</div>
        </div>
      </>
    )
  }

  return (
    <div id="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">LOL<span>·IA</span></div>

        <div className="sidebar-section">
          <div className="sidebar-label">Navigation</div>
          <div className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => showView('dashboard')}>
            <span className="nav-icon">⬡</span> Dashboard
          </div>
          <div className={`nav-item ${currentView === 'insights' ? 'active' : ''}`} onClick={() => showView('insights')}>
            <span className="nav-icon">◈</span> Insights IA
            <span className="badge badge-blue" style={{marginLeft: 'auto', fontSize: '0.6rem'}}>3</span>
          </div>
          <div className={`nav-item ${currentView === 'postgame' ? 'active' : ''}`} onClick={() => showView('postgame')}>
            <span className="nav-icon">⬙</span> Post-Game
          </div>
          <div className={`nav-item ${currentView === 'progression' ? 'active' : ''}`} onClick={() => showView('progression')}>
            <span className="nav-icon">△</span> Progression
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Champions</div>
          <div className="nav-item">
            <span className="nav-icon">⬛</span> Jinx &nbsp;<span style={{fontSize: '0.68rem', color: 'var(--green)'}}>62%</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⬛</span> Caitlyn &nbsp;<span style={{fontSize: '0.68rem', color: 'var(--gold)'}}>52%</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⬛</span> Ezreal &nbsp;<span style={{fontSize: '0.68rem', color: 'var(--red)'}}>41%</span>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">KR</div>
          <div className="profile-info">
            <div className="profile-name">KryptoRift</div>
            <div className="profile-rank">Gold II · 47 LP</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="page-title" dangerouslySetInnerHTML={{ __html: pageTitles[currentView as keyof typeof pageTitles] || currentView }}></div>
            <div style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem'}}>Saison S2025 · 147 parties jouées</div>
          </div>
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <span className="ai-badge">IA Active</span>
            <button className="sync-btn" onClick={syncMatches}>⟳ &nbsp;Synchroniser</button>
          </div>
        </div>

        {/* DASHBOARD VIEW */}
        <div className={`view ${currentView === 'dashboard' ? 'active' : ''}`}>
          {/* STAT CARDS */}
          <div className="stats-grid">
            <div className="stat-card" style={{'--accent-color': 'var(--gold)'} as React.CSSProperties}>
              <div className="stat-label">Winrate Global</div>
              <div className="stat-value">53<span style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>%</span></div>
              <div className="stat-trend trend-up">▲ +4.2% ce mois</div>
            </div>
            <div className="stat-card" style={{'--accent-color': 'var(--blue)'} as React.CSSProperties}>
              <div className="stat-label">KDA Moyen</div>
              <div className="stat-value">3.8</div>
              <div className="stat-trend trend-up">▲ +0.3 sur 20 parties</div>
            </div>
            <div className="stat-card" style={{'--accent-color': 'var(--green)'} as React.CSSProperties}>
              <div className="stat-label">CS / Minute</div>
              <div className="stat-value">7.2</div>
              <div className="stat-trend trend-neutral">→ Stable</div>
            </div>
            <div className="stat-card" style={{'--accent-color': 'var(--red)'} as React.CSSProperties}>
              <div className="stat-label">Vision Score Moy.</div>
              <div className="stat-value">24</div>
              <div className="stat-trend trend-down">▼ -3.1 ce mois</div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="dashboard-grid">
            {/* LEFT: Performances + Historique */}
            <div>
              {/* Winrate par champion */}
              <div className="panel" style={{marginBottom: '1rem'}}>
                <div className="panel-header">
                  <div className="panel-title">Winrate par Champion</div>
                  <span className="badge badge-gold">20 dernières parties</span>
                </div>
                <div className="panel-body" style={{paddingBottom: '1rem'}}>
                  <div className="winrate-bar-container">
                    <div className="winrate-bar-label"><span>⚡ Jinx</span><span style={{color: 'var(--green)'}}>62%</span></div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill" style={{width: '62%'}}></div></div>
                  </div>
                  <div className="winrate-bar-container">
                    <div className="winrate-bar-label"><span>🎯 Caitlyn</span><span style={{color: 'var(--gold)'}}>52%</span></div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill gold" style={{width: '52%'}}></div></div>
                  </div>
                  <div className="winrate-bar-container">
                    <div className="winrate-bar-label"><span>✨ Ezreal</span><span style={{color: 'var(--red)'}}>41%</span></div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill red" style={{width: '41%'}}></div></div>
                  </div>
                  <div className="winrate-bar-container">
                    <div className="winrate-bar-label"><span>💀 Draven</span><span style={{color: 'var(--gold)'}}>55%</span></div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill gold" style={{width: '55%'}}></div></div>
                  </div>
                </div>
              </div>

              {/* Historique des parties */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Historique des Parties</div>
                  <span className="text-muted">10 dernières</span>
                </div>
                <div id="match-list">
                  {/* Match items will be rendered here */}
                  <div className="match-item win">
                    <div className="match-champ">⚡</div>
                    <div className="match-info">
                      <div className="match-champ-name">Jinx</div>
                      <div className="match-meta">ADC · 28m · Il y a 1h</div>
                    </div>
                    <div className="match-kda">
                      <div className="match-kda-val">12/3/8</div>
                      <div className="match-kda-label">KDA</div>
                    </div>
                    <div className="match-kda" style={{minWidth: '60px'}}>
                      <div className="match-kda-val">8.4</div>
                      <div className="match-kda-label">CS/min</div>
                    </div>
                    <div className="match-result win">Victoire</div>
                  </div>
                  <div className="match-item win">
                    <div className="match-champ">🎯</div>
                    <div className="match-info">
                      <div className="match-champ-name">Caitlyn</div>
                      <div className="match-meta">ADC · 32m · Il y a 3h</div>
                    </div>
                    <div className="match-kda">
                      <div className="match-kda-val">8/2/11</div>
                      <div className="match-kda-label">KDA</div>
                    </div>
                    <div className="match-kda" style={{minWidth: '60px'}}>
                      <div className="match-kda-val">7.9</div>
                      <div className="match-kda-label">CS/min</div>
                    </div>
                    <div className="match-result win">Victoire</div>
                  </div>
                  <div className="match-item loss">
                    <div className="match-champ">✨</div>
                    <div className="match-info">
                      <div className="match-champ-name">Ezreal</div>
                      <div className="match-meta">ADC · 38m · Il y a 5h</div>
                    </div>
                    <div className="match-kda">
                      <div className="match-kda-val">4/7/3</div>
                      <div className="match-kda-label">KDA</div>
                    </div>
                    <div className="match-kda" style={{minWidth: '60px'}}>
                      <div className="match-kda-val">6.1</div>
                      <div className="match-kda-label">CS/min</div>
                    </div>
                    <div className="match-result loss">Défaite</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Rang + Insights résumés */}
            <div>
              {/* Rang actuel */}
              <div className="panel" style={{marginBottom: '1rem'}}>
                <div className="panel-header">
                  <div className="panel-title">Classement SoloQ</div>
                </div>
                <div className="panel-body">
                  <div className="rank-badge" style={{marginBottom: '1rem'}}>
                    <div className="rank-icon">🥇</div>
                    <div>
                      <div className="rank-tier">Gold II</div>
                      <div className="rank-lp">47 LP · W64 L57</div>
                    </div>
                  </div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>Séries récentes</div>
                  <div style={{display: 'flex', gap: '0.35rem', marginBottom: '1rem'}}>
                    <div style={{width: '24px', height: '24px', background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: 'var(--bg-deep)'}}>V</div>
                    <div style={{width: '24px', height: '24px', background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: 'var(--bg-deep)'}}>V</div>
                    <div style={{width: '24px', height: '24px', background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: 'white'}}>D</div>
                    <div style={{width: '24px', height: '24px', background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: 'var(--bg-deep)'}}>V</div>
                    <div style={{width: '24px', height: '24px', background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: 'white'}}>D</div>
                  </div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Progression LP</div>
                  <svg viewBox="0 0 200 50" style={{width: '100%', height: '50px', marginTop: '0.5rem'}}>
                    <polyline points="0,40 30,35 60,30 90,25 120,28 150,18 200,15"
                      fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.8"/>
                    <polyline points="0,40 30,35 60,30 90,25 120,28 150,18 200,15 200,50 0,50"
                      fill="rgba(200,155,60,0.08)" stroke="none"/>
                  </svg>
                </div>
              </div>

              {/* Top insight du jour */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Priorité du Jour</div>
                  <span className="ai-badge">IA</span>
                </div>
                <div className="panel-body">
                  <div className="insight-card" style={{'--insight-color': 'var(--red)', '--insight-bg': 'rgba(232,64,87,0.08)'} as React.CSSProperties} onClick={() => showView('insights')}>
                    <div className="insight-header">
                      <div className="insight-icon">⚠</div>
                      <div>
                        <div className="insight-title">Faible impact vision avant les objectifs</div>
                        <div className="insight-subtitle">Correction critique</div>
                      </div>
                    </div>
                    <div className="insight-body">Tu plaçes rarement des wards avant Baron/Dragon. Cela cause des défaites évitables dans 68% de tes pertes.</div>
                    <div className="insight-action">→ Voir les recommandations</div>
                  </div>

                  <div className="insight-card" style={{'--insight-color': 'var(--gold)', '--insight-bg': 'rgba(200,155,60,0.08)'} as React.CSSProperties} onClick={() => showView('insights')}>
                    <div className="insight-header">
                      <div className="insight-icon">📉</div>
                      <div>
                        <div className="insight-title">Performances dégradées après 22h</div>
                        <div className="insight-subtitle">Pattern comportemental</div>
                      </div>
                    </div>
                    <div className="insight-body">Ton winrate passe de 58% à 38% sur les parties jouées après 22h. Joues-tu fatigué ?</div>
                    <div className="insight-action">→ Analyser le pattern</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INSIGHTS VIEW */}
        <div className={`view ${currentView === 'insights' ? 'active' : ''}`}>
          <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem'}}>
            <div>
              <div className="panel" style={{marginBottom: '1rem'}}>
                <div className="panel-header">
                  <div className="panel-title">Analyse Comportementale</div>
                  <span className="ai-badge">Générés par IA</span>
                </div>
                <div className="panel-body">
                  <div className="insight-card" style={{'--insight-color': 'var(--red)', '--insight-bg': 'rgba(232,64,87,0.08)'} as React.CSSProperties}>
                    <div className="insight-header">
                      <div className="insight-icon">⚠</div>
                      <div>
                        <div className="insight-title">Faible impact vision avant objectifs majeurs</div>
                        <div className="insight-subtitle" style={{color: 'var(--red)'}}>Critique · Récurrent</div>
                      </div>
                    </div>
                    <div className="insight-body">Dans 68% de tes défaites, aucune ward n'était placée dans les 30 secondes précédant une tentative d'objectif. La moyenne des joueurs Gold pose en moyenne 2,3 wards avant Baron. Toi : 0,4.</div>
                    <div className="insight-action" style={{color: 'var(--red)'}}>🎯 Recommandation : Développer un réflexe de ward avant chaque objectif majeur. Commence par placer une ward river dès 19 min.</div>
                  </div>

                  <div className="insight-card" style={{'--insight-color': 'var(--gold)', '--insight-bg': 'rgba(200,155,60,0.08)'} as React.CSSProperties}>
                    <div className="insight-header">
                      <div className="insight-icon">🌙</div>
                      <div>
                        <div className="insight-title">Fatigue détectée : dégradation nocturne</div>
                        <div className="insight-subtitle" style={{color: 'var(--gold)'}}>Comportemental · Actif</div>
                      </div>
                    </div>
                    <div className="insight-body">Winrate de 58% avant 22h vs 38% après. Durée de partie +18% la nuit. Erreurs de positionnement x2.4 en fin de soirée.</div>
                    <div className="insight-action">🎯 Recommandation : Limiter les sessions après 22h ou accepter de jouer pour la détente, pas pour progresser.</div>
                  </div>

                  <div className="insight-card" style={{'--insight-color': 'var(--blue)', '--insight-bg': 'rgba(11,196,227,0.08)'} as React.CSSProperties}>
                    <div className="insight-header">
                      <div className="insight-icon">⚔</div>
                      <div>
                        <div className="insight-title">Suragressivité mid-game sur Ezreal</div>
                        <div className="insight-subtitle" style={{color: 'var(--blue)'}}>Gameplay · Spécifique</div>
                      </div>
                    </div>
                    <div className="insight-body">En phases 15-25 min avec Ezreal, tu engages le combat 47% plus souvent que la moyenne de ton elo. Résultat : taux de mort x1.8 sur cette plage.</div>
                    <div className="insight-action">🎯 Recommandation : Sur Ezreal, adopte un rôle de kiter-poke. Engage seulement quand tu as l'avantage numérique clair.</div>
                  </div>

                  <div className="insight-card" style={{'--insight-color': 'var(--green)', '--insight-bg': 'rgba(62,232,160,0.08)'} as React.CSSProperties}>
                    <div className="insight-header">
                      <div className="insight-icon">✓</div>
                      <div>
                        <div className="insight-title">Excellente conversion des leads de lane</div>
                        <div className="insight-subtitle" style={{color: 'var(--green)'}}>Point fort · Stable</div>
                      </div>
                    </div>
                    <div className="insight-body">Quand tu es en avance à 10 min, tu convertis en victoire dans 72% des cas (vs 61% en moyenne Gold). Ta gestion du lead early est un atout majeur.</div>
                    <div className="insight-action" style={{color: 'var(--green)'}}>✓ Continue sur cette lancée. Exploite davantage les matchups favorables.</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="panel" style={{marginBottom: '1rem'}}>
                <div className="panel-header">
                  <div className="panel-title">Score de Progression</div>
                </div>
                <div className="panel-body" style={{textAlign: 'center'}}>
                  <div style={{position: 'relative', display: 'inline-block', marginBottom: '1rem'}}>
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-card)" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gold)" strokeWidth="8"
                        strokeDasharray="220 314" strokeLinecap="round"
                        transform="rotate(-90 60 60)" opacity="0.9"/>
                    </svg>
                    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <div style={{fontFamily: "'Rajdhani', sans-serif", fontSize: '2rem', fontWeight: '700', color: 'var(--gold)'}}>70</div>
                      <div style={{fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>/ 100</div>
                    </div>
                  </div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Score global de progression ce mois</div>

                  <div style={{textAlign: 'left'}}>
                    <div style={{fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>Axes d'amélioration</div>
                    <div className="winrate-bar-container">
                      <div className="winrate-bar-label"><span>Vision</span><span>38/100</span></div>
                      <div className="winrate-bar-track"><div className="winrate-bar-fill red" style={{width: '38%'}}></div></div>
                    </div>
                    <div className="winrate-bar-container">
                      <div className="winrate-bar-label"><span>Farm</span><span>72/100</span></div>
                      <div className="winrate-bar-track"><div className="winrate-bar-fill" style={{width: '72%'}}></div></div>
                    </div>
                    <div className="winrate-bar-container">
                      <div className="winrate-bar-label"><span>Objectifs</span><span>55/100</span></div>
                      <div className="winrate-bar-track"><div className="winrate-bar-fill gold" style={{width: '55%'}}></div></div>
                    </div>
                    <div className="winrate-bar-container">
                      <div className="winrate-bar-label"><span>Positionnement</span><span>64/100</span></div>
                      <div className="winrate-bar-track"><div className="winrate-bar-fill gold" style={{width: '64%'}}></div></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Patterns Détectés</div>
                  <span className="ai-badge">IA</span>
                </div>
                <div className="panel-body" style={{padding: '1rem'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '2px'}}>
                      <span style={{color: 'var(--red)'}}>↓</span>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>Défaites sur parties &gt; 35 min : <strong style={{color: 'var(--text-primary)'}}>71%</strong></span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '2px'}}>
                      <span style={{color: 'var(--green)'}}>↑</span>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>Victoires sur early close : <strong style={{color: 'var(--text-primary)'}}>78%</strong></span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '2px'}}>
                      <span style={{color: 'var(--gold)'}}>→</span>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>3 défaites consécutives = tilt détecté</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '2px'}}>
                      <span style={{color: 'var(--blue)'}}>◆</span>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>Meilleure perf weekend après-midi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POST-GAME VIEW */}
        <div className={`view ${currentView === 'postgame' ? 'active' : ''}`}>
          <div className="postgame-hero">
            <div className="postgame-score">
              <div>
                <div className="postgame-result">VICTOIRE</div>
                <div style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>Jinx · ADC · 28 min · Ranked SoloQ</div>
              </div>
              <div className="postgame-stats-row">
                <div className="pgstat">
                  <div className="pgstat-val">12/3/8</div>
                  <div className="pgstat-label">KDA</div>
                </div>
                <div className="pgstat">
                  <div className="pgstat-val">8.4</div>
                  <div className="pgstat-label">CS/min</div>
                </div>
                <div className="pgstat">
                  <div className="pgstat-val">38</div>
                  <div className="pgstat-label">Vision</div>
                </div>
                <div className="pgstat">
                  <div className="pgstat-val">32k</div>
                  <div className="pgstat-label">Dégâts</div>
                </div>
              </div>
            </div>
            <div className="postgame-summary">
              "Excellente phase de lane avec un avantage gold établi dès 8 min. Bonne gestion du teamfight à 22 min sur Dragon. Cependant, faible présence map après 20 min — la victoire a failli basculer grâce à des picks évitables en river."
            </div>
          </div>

          <div className="postgame-grid">
            <div className="feedback-card">
              <div className="feedback-type" style={{color: 'var(--green)'}}>
                <div className="feedback-dot" style={{'--dot-color': 'var(--green)'} as React.CSSProperties}></div>
                Points Forts
              </div>
              <div className="feedback-text">
                <div style={{marginBottom: '0.5rem'}}>✓ Phase de lane dominante (CS+42 à 10 min)</div>
                <div style={{marginBottom: '0.5rem'}}>✓ Positionnement exemplaire en teamfight</div>
                <div>✓ Bonne utilisation de Zap! pour sécuriser les kills</div>
              </div>
            </div>

            <div className="feedback-card" style={{borderColor: 'rgba(232,64,87,0.2)'}}>
              <div className="feedback-type" style={{color: 'var(--red)'}}>
                <div className="feedback-dot" style={{'--dot-color': 'var(--red)'} as React.CSSProperties}></div>
                Erreur Principale
              </div>
              <div className="feedback-text">
                Aucune ward placée avant les tentatives de Dragon (22 min, 26 min). Tu as failli perdre sur un pick évitable en river bush à 24 min.
              </div>
            </div>

            <div className="feedback-card" style={{borderColor: 'rgba(11,196,227,0.2)'}}>
              <div className="feedback-type" style={{color: 'var(--blue)'}}>
                <div className="feedback-dot" style={{'--dot-color': 'var(--blue)'} as React.CSSProperties}></div>
                Recommandation IA
              </div>
              <div className="feedback-text">
                <strong style={{color: 'var(--blue)'}}>Priorité #1 :</strong> Intègre l'automatisme "ward river à 19 min". Ça t'a coûté une victoire facile. C'est le seul axe de travail cette semaine.
              </div>
            </div>
          </div>

          {/* Historique post-games */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Parties Récentes Analysées</div>
              <span className="ai-badge">IA</span>
            </div>
            <div id="postgame-list">
              <div className="match-item win" style={{cursor: 'default'}}>
                <div className="match-champ">⚡</div>
                <div className="match-info">
                  <div className="match-champ-name">Jinx</div>
                  <div className="match-meta" style={{color: 'var(--text-secondary)', fontSize: '0.78rem'}}>Bonne lane, faible vision obj.</div>
                </div>
                <div className="match-kda" style={{textAlign: 'right', minWidth: '70px'}}>
                  <div style={{fontFamily: "'Rajdhani', sans-serif", fontSize: '1.2rem', fontWeight: '700', color: 'var(--green)'}}>82</div>
                  <div className="match-kda-label">Score IA</div>
                </div>
                <div className="match-result win">Victoire</div>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESSION VIEW */}
        <div className={`view ${currentView === 'progression' ? 'active' : ''}`}>
          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem'}}>
            <div>
              {/* Évolution hebdo */}
              <div className="panel" style={{marginBottom: '1rem'}}>
                <div className="panel-header">
                  <div className="panel-title">Évolution Hebdomadaire</div>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <span className="badge badge-green">+4 LP net</span>
                    <span className="badge badge-gold">Cette semaine</span>
                  </div>
                </div>
                <div className="panel-body">
                  <svg viewBox="0 0 600 100" style={{width: '100%', height: '100px'}}>
                    <polyline points="0,60 85,55 170,48 255,52 340,42 425,38 510,30 600,26"
                      fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.9"/>
                    <polyline points="0,60 85,55 170,48 255,52 340,42 425,38 510,30 600,26 600,100 0,100"
                      fill="rgba(200,155,60,0.06)" stroke="none"/>
                    <circle cx="85" cy="55" r="3" fill="var(--gold)"/>
                    <circle cx="170" cy="48" r="3" fill="var(--gold)"/>
                    <circle cx="255" cy="52" r="3" fill="var(--gold)"/>
                    <circle cx="340" cy="42" r="3" fill="var(--gold)"/>
                    <circle cx="425" cy="38" r="3" fill="var(--gold)"/>
                    <circle cx="510" cy="30" r="3" fill="var(--gold)"/>
                    <circle cx="600" cy="26" r="4" fill="var(--gold-light)"/>
                    <polyline points="0,70 85,65 170,62 255,68 340,58 425,55 510,48 600,44"
                      fill="none" stroke="var(--blue)" strokeWidth="1.5" opacity="0.6" strokeDasharray="4,2"/>
                  </svg>
                  <div style={{display: 'flex', gap: '1.5rem', marginTop: '0.75rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                      <div style={{width: '16px', height: '2px', background: 'var(--gold)'}}></div> Winrate
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                      <div style={{width: '16px', height: '1px', background: 'var(--blue)', borderTop: '1px dashed var(--blue)'}}></div> KDA
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparaison périodes */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Comparaison Périodes</div>
                </div>
                <div className="panel-body">
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <div style={{fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1rem'}}>Mois Dernier</div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>Winrate</span><span style={{color: 'var(--text-muted)'}}>49%</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>KDA</span><span style={{color: 'var(--text-muted)'}}>3.2</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>CS/min</span><span style={{color: 'var(--text-muted)'}}>6.8</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>Vision</span><span style={{color: 'var(--text-muted)'}}>27</span></div>
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '1rem'}}>Ce Mois</div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>Winrate</span><span style={{color: 'var(--green)'}}>53% ▲</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>KDA</span><span style={{color: 'var(--green)'}}>3.8 ▲</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>CS/min</span><span style={{color: 'var(--green)'}}>7.2 ▲</span></div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}><span style={{color: 'var(--text-secondary)'}}>Vision</span><span style={{color: 'var(--red)'}}>24 ▼</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Champion Pool */}
              <div className="panel" style={{marginBottom: '1rem'}}>
                <div className="panel-header">
                  <div className="panel-title">Champion Pool</div>
                </div>
                <div className="panel-body">
                  <div className="prog-champion-grid">
                    <div className="prog-champ-card">
                      <div className="prog-champ-icon">⚡</div>
                      <div className="prog-champ-name">Jinx</div>
                      <div className="prog-champ-games">42 parties</div>
                      <div className="prog-champ-wr" style={{color: 'var(--green)'}}>62%</div>
                    </div>
                    <div className="prog-champ-card">
                      <div className="prog-champ-icon">🎯</div>
                      <div className="prog-champ-name">Caitlyn</div>
                      <div className="prog-champ-games">31 parties</div>
                      <div className="prog-champ-wr" style={{color: 'var(--gold)'}}>52%</div>
                    </div>
                    <div className="prog-champ-card">
                      <div className="prog-champ-icon">✨</div>
                      <div className="prog-champ-name">Ezreal</div>
                      <div className="prog-champ-games">28 parties</div>
                      <div className="prog-champ-wr" style={{color: 'var(--red)'}}>41%</div>
                    </div>
                  </div>
                  <div style={{marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '2px', border: '1px solid rgba(232,64,87,0.2)'}}>
                    <div style={{fontSize: '0.7rem', color: 'var(--red)', marginBottom: '0.3rem'}}>⚠ Conseil IA</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Ezreal nuit à ton LP. Réduis à 1-2 parties test par semaine.</div>
                  </div>
                </div>
              </div>

              {/* Objectifs */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Objectifs</div>
                  <span className="ai-badge">IA</span>
                </div>
                <div className="panel-body">
                  <div style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem'}}>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>Vision Score &gt; 30</span>
                      <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>24/30</span>
                    </div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill gold" style={{width: '80%'}}></div></div>
                  </div>
                  <div style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem'}}>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>Atteindre Platinum IV</span>
                      <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>47/100 LP</span>
                    </div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill" style={{width: '47%'}}></div></div>
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem'}}>
                      <span style={{fontSize: '0.78rem', color: 'var(--text-secondary)'}}>CS/min &gt; 8.0</span>
                      <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>7.2/8.0</span>
                    </div>
                    <div className="winrate-bar-track"><div className="winrate-bar-fill gold" style={{width: '90%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}