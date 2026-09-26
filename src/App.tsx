// App is the front door. It sets up the player state and the screen routes.
// A "route" is a web address inside the app, like /path or /shop.

import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PlayerProvider, usePlayer } from './game/PlayerContext'
import { setSoundEnabled, setSpeakEnabled, unlockAudio } from './audio/sound'
import { setPreferredVoices } from './audio/voice'
import { startMusic, stopMusic } from './audio/music'
import HomeScreen from './screens/HomeScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import PathScreen from './screens/PathScreen'
import LessonScreen from './screens/LessonScreen'
import CharactersScreen from './screens/CharactersScreen'
import ShopScreen from './screens/ShopScreen'
import ArcadeScreen from './screens/ArcadeScreen'
import GameScreen from './screens/GameScreen'
import WordsScreen from './screens/WordsScreen'
import SettingsScreen from './screens/SettingsScreen'
import PracticeScreen from './screens/PracticeScreen'
import ProfilesScreen from './screens/ProfilesScreen'
import RaceScreen from './screens/RaceScreen'

/** Keeps the sound settings in sync with the audio engine. */
function AudioSync() {
  const { player } = usePlayer()
  const location = useLocation()

  useEffect(() => {
    setSoundEnabled(player.settings.sound)
    setSpeakEnabled(player.settings.speak)
    setPreferredVoices(player.settings.voiceEs, player.settings.voiceEn)
  }, [player.settings.sound, player.settings.speak, player.settings.voiceEs, player.settings.voiceEn])

  // Music plays in lessons and games, not on menus. Music must be on in settings.
  useEffect(() => {
    const musicScreens = ['/lesson', '/game', '/practice']
    const wants = player.settings.music && musicScreens.some((p) => location.pathname.startsWith(p))
    if (wants) startMusic()
    else stopMusic()
    return () => stopMusic()
  }, [location.pathname, player.settings.music])

  // Browsers block sound until the first tap. This unlocks it.
  useEffect(() => {
    const handler = () => unlockAudio()
    window.addEventListener('pointerdown', handler, { once: true })
    return () => window.removeEventListener('pointerdown', handler)
  }, [])

  return null
}

/** Every new screen starts at the top, so tabs never open half-scrolled. */
function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
}

/** Nobody signed in? Show "who is playing?". New kid? Show onboarding first. */
function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const { player, activeProfileId } = usePlayer()
  if (!activeProfileId) return <Navigate to="/who" replace />
  if (!player.onboarded) return <Navigate to="/welcome" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <PlayerProvider>
      <HashRouter>
        <AudioSync />
        <ScrollToTop />
        <Routes>
          <Route path="/who" element={<ProfilesScreen />} />
          <Route path="/welcome" element={<OnboardingScreen />} />
          <Route
            path="/race"
            element={
              <RequireOnboarding>
                <RaceScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/"
            element={
              <RequireOnboarding>
                <HomeScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/path"
            element={
              <RequireOnboarding>
                <PathScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/lesson/:lessonId"
            element={
              <RequireOnboarding>
                <LessonScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/practice"
            element={
              <RequireOnboarding>
                <PracticeScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/characters"
            element={
              <RequireOnboarding>
                <CharactersScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/shop"
            element={
              <RequireOnboarding>
                <ShopScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/arcade"
            element={
              <RequireOnboarding>
                <ArcadeScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <RequireOnboarding>
                <GameScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/words"
            element={
              <RequireOnboarding>
                <WordsScreen />
              </RequireOnboarding>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireOnboarding>
                <SettingsScreen />
              </RequireOnboarding>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </PlayerProvider>
  )
}
