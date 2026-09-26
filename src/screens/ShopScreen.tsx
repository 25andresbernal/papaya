// The Shop screen. Spend papayas on hats, glasses, capes, pets, and
// backgrounds for your hero. Nothing here makes you stronger. It is all
// just for looking cool. Real money is never used, only papayas you earn.

import { useState } from 'react'
import type { Rarity, ShopItem, ShopSlot } from '../types'
import { SHOP_ITEMS, HERO_COLORS } from '../data/shop'
import { usePlayer } from '../game/PlayerContext'
import { sfx } from '../audio/sound'
import Screen from '../components/Screen'
import Hero from '../components/Hero'
import Button from '../components/Button'
import Confetti from '../components/Confetti'
import Pic from '../components/Pic'

const RARITY_STYLES: Record<Rarity, string> = {
  common: 'bg-gray-300 text-ink',
  rare: 'bg-sky text-white',
  epic: 'bg-[#B388FF] text-white',
  legendary: 'bg-sun text-seed',
}

// A pretty gradient behind the hero for each background item.
const BG_GRADIENTS: Record<string, string> = {
  'bg-beach': 'from-sky to-sun',
  'bg-jungle': 'from-leaf to-leaf-dark',
  'bg-mountain': 'from-sky-dark to-cream',
  'bg-space': 'from-seed to-sky-dark',
}

const SLOTS: { slot: ShopSlot; label: string }[] = [
  { slot: 'hat', label: 'Hats' },
  { slot: 'glasses', label: 'Glasses' },
  { slot: 'cape', label: 'Capes' },
  { slot: 'pet', label: 'Pets' },
  { slot: 'background', label: 'Backgrounds' },
]

export default function ShopScreen() {
  const { player, buyItem, equipItem, setHeroColor } = usePlayer()
  const [activeSlot, setActiveSlot] = useState<ShopSlot>('hat')
  // A little burst of confetti when something new is bought.
  const [celebrate, setCelebrate] = useState(false)

  const equippedBg = player.hero.equipped.background
  const gradient = equippedBg ? (BG_GRADIENTS[equippedBg] ?? 'from-cream-dark to-cream') : 'from-cream-dark to-cream'

  function handleWear(id: string, slot: ShopSlot) {
    sfx.pop()
    equipItem(slot, id)
  }

  function handleTakeOff(slot: ShopSlot) {
    equipItem(slot, null)
  }

  function handleBuy(item: ShopItem) {
    const ok = buyItem(item.id, item.cost)
    if (!ok) return
    equipItem(item.slot, item.id)
    sfx.unlock()
    setCelebrate(true)
    setTimeout(() => setCelebrate(false), 1500)
  }

  function handleTooPoor() {
    sfx.wrong()
  }

  const itemsForSlot = SHOP_ITEMS.filter((i) => i.slot === activeSlot)

  return (
    <Screen>
      <h1 className="text-2xl font-display font-bold text-ink mt-3 mb-3">Shop</h1>

      {/* Live preview of the hero with everything equipped. */}
      <div className={`w-full rounded-3xl bg-gradient-to-b ${gradient} flex items-center justify-center py-6 mb-4 shadow-chunky-sm`}>
        <Hero look={player.hero} size={160} />
      </div>

      {/* Hero color swatches. Free, just for fun. */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {HERO_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Hero color ${color}`}
            className={`w-9 h-9 rounded-full btn-chunky cursor-pointer ${player.hero.color === color ? 'ring-4 ring-ink' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => {
              sfx.pop()
              setHeroColor(color)
            }}
          />
        ))}
      </div>

      {/* Tabs for each kind of item. */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 -mx-1 px-1">
        {SLOTS.map(({ slot, label }) => (
          <button
            key={slot}
            type="button"
            className={`btn-chunky shrink-0 font-display font-bold px-4 py-2 rounded-full cursor-pointer
              ${activeSlot === slot ? 'bg-papaya text-white' : 'bg-white text-ink'}`}
            onClick={() => {
              sfx.tap()
              setActiveSlot(slot)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        {itemsForSlot.map((item) => {
          const owned = player.ownedItemIds.includes(item.id)
          const equipped = player.hero.equipped[item.slot] === item.id
          const affordable = player.coins >= item.cost

          return (
            <div key={item.id} className="rounded-3xl p-3 bg-white border-2 border-black/10 shadow-chunky-sm flex flex-col items-center text-center gap-1">
              <span className="leading-none mt-1">
                <Pic emoji={item.emoji} size={52} label={item.name} />
              </span>
              <p className="font-display font-bold text-ink leading-tight">{item.name}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RARITY_STYLES[item.rarity]}`}>{item.rarity}</span>

              <div className="mt-1 w-full">
                {owned && equipped && (
                  <>
                    <p className="text-xs font-display font-bold text-leaf mb-1">Wearing</p>
                    <Button color="white" size="sm" full onClick={() => handleTakeOff(item.slot)}>
                      Take off
                    </Button>
                  </>
                )}
                {owned && !equipped && (
                  <Button color="sky" size="sm" full onClick={() => handleWear(item.id, item.slot)}>
                    Wear
                  </Button>
                )}
                {!owned && affordable && (
                  <Button color="papaya" size="sm" full onClick={() => handleBuy(item)}>
                    🥭 {item.cost}
                  </Button>
                )}
                {!owned && !affordable && (
                  <button
                    type="button"
                    className="w-full text-center opacity-60 grayscale cursor-pointer font-display font-bold text-ink-soft py-2"
                    onClick={handleTooPoor}
                  >
                    🥭 {item.cost}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {celebrate && <Confetti count={40} duration={1.5} />}
    </Screen>
  )
}
