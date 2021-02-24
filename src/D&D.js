export default {

  /* =============================================================================================
      RETURN CALCULATED ABILITY MODIFIER
  ============================================================================================= */

  calculateAbilityModifier(score) {
    return Math.floor((score - 10)/2)
  },


  /* =============================================================================================
      CALCULATE SPENT POINTS FOR ABILITY SCORES
  ============================================================================================= */  

  calcPoints(score) {
    score = Number(score)
    if (score < 9) return 0
    else if (score > 8 && 15 > score) return score - 8
    else {
      switch(score) {
        case 15: return 8
        case 16: return 10
        case 17: return 13
        case 18: return 16
        default: return 0
      }
    }
  },


  /* =============================================================================================
      RETURN TOTAL CALCULATED ABILITY SCORE
  ============================================================================================= */

  getTotalAbilityScore(abil) {
    return abil.basic + abil.race + abil.level + abil.inherent + abil.enhancement
  },


  /* =============================================================================================
      RETURN TOTAL CALCULATED SAVING THROWS
  ============================================================================================= */
  
  getTotalSaves(save) {
    return save.basic + save.feat + save.enhancement + save.abil
  },


  /* =============================================================================================
      RETURN AN ARRAY OF ABILITY SCORE BASIC VALUES
  ============================================================================================= */
  
  getAbilityArray(abil) {
    return [
      abil.str.basic,
      abil.dex.basic,
      abil.con.basic,
      abil.int.basic,
      abil.wis.basic,
      abil.cha.basic
    ]
  },


  /* =============================================================================================
      RETURN AN ARRAY OF POINTS SPENT ON ABILITY SCORES
  ============================================================================================= */
  
  getAbilityPoints(abil) {
    return [
      this.calcPoints(abil.str.basic),
      this.calcPoints(abil.dex.basic),
      this.calcPoints(abil.con.basic),
      this.calcPoints(abil.int.basic),
      this.calcPoints(abil.wis.basic),
      this.calcPoints(abil.cha.basic)
    ]
  },


  /* =============================================================================================
      RETURN BOOLEAN WHETHER TOTAL ABILITY POINTS EXCEEDS CAMPAIGN POINTS
  ============================================================================================= */
  
  checkOverspend(campaign, points, campaigns) {
    const campaignPoints = campaigns[campaign].points
    const spentPoints = points.reduce((r, pts) => r = r + pts)
    return (spentPoints > campaignPoints)
  },


  /* =============================================================================================
      RETURN SELECTED EQUIPMENT
  ============================================================================================= */

  setSelectedEquipment(wc) {
    const selectedEquipment = {
      armor: Array.from(wc.armor),
      weapons: Array.from(wc.weapons),
      gear: Array.from(wc.equipment)
    }
    return selectedEquipment
  },


  /* =============================================================================================
      RETURN SELECTED FEATS
  ============================================================================================= */

  setSelectedFeats(wc) {
    const selected = []
    wc.feats = wc.feats.filter(feat => !feat.race && !feat.class)
    if (wc.feats.length) {
      selected[0] = wc.feats[0].name
      if (wc.race === 'human') {
        selected[1] = wc.feats[1].name
      }
      if (wc.class === 'fighter') {
        selected[2] = wc.feats[2] ? wc.feats[2].name : null
      }
    }
    return selected
  },


  /* =============================================================================================
      CHECK TO SEE IF FEAT REQUIREMENTS ARE MET
  ============================================================================================= */

  meetRequirement(requirement, wc, selectedFeats) {
    switch (requirement) {
      case 'Base attack bonus +1':
        return (wc.bab > 0)
      case 'Caster level 1st':
        return (wc.cl >= 1)
      case 'Str 13':
        return (this.getTotalAbilityScore(wc.abilities.str) >= 13)
      case 'Dex 13':
        return (this.getTotalAbilityScore(wc.abilities.dex) >= 13)
      case 'Dex 15':
        return (this.getTotalAbilityScore(wc.abilities.dex) >= 15)
      case 'Int 13':
        return (this.getTotalAbilityScore(wc.abilities.int) >= 13)
      case 'Shield Proficiency':
        return (
          wc.armorProf.includes("shields (including tower shields)")
          || wc.armorProf.includes("shields (but not tower shields)")
        )
      case 'Ride 1 rank':
        for (let i = 0, len = wc.skills; i < len; i++) {
          let sk = wc.skills[i]
          if (sk.name === 'Ride' && sk.ranks >= 1) return true
        }
        return false
      default:
        return selectedFeats.includes(requirement)
    }
  },


  /* =============================================================================================
      DICE ROLLS
  ============================================================================================= */

  dice(die, num = 1) {
    let total = 0
    for (let i = 1; i <= num; i++) {
      total += Math.floor(Math.random() * die) + 1
    }
    return total
  },


  /* =============================================================================================
      RANDOM STARTING AGE
  ============================================================================================= */

  startingAge(race, role) {
    const early = ['barbarian', 'rogue', 'sorcerer']
    let base = 0
    switch (race) {
      case 'dwarf':
        base = 40
        base += early.includes(role) ? this.dice(6, 3) : this.dice(6, 5)
        break
      case 'elf':
        base = 110
        base += early.includes(role) ? this.dice(6, 4) : this.dice(6, 6)
        break
      case 'gnome':
        base = 110
        base += early.includes(role) ? this.dice(6, 4) : this.dice(6, 6)
        break
      case 'half-orc':
        base = 14
        base += early.includes(role) ? this.dice(4) : this.dice(6)
        break
      case 'halfling':
        base = 20
        base += early.includes(role) ? this.dice(4, 2) : this.dice(6, 3)
        break
      default: // human
        base = 15
        base += early.includes(role) ? this.dice(4) : this.dice(6)
    }

    return base
  },


  /* =============================================================================================
      RANDOM STARTING HEIGHT AND WEIGHT
  ============================================================================================= */

  startingHeightWeight(race, gender) {
    let height = 0
    let weight = 0
    let roll = 0
    switch (race) {
      case 'dwarf':
        roll = this.dice(4, 2)
        height = (gender === 'male' ? 45 : 43) + roll
        weight = (gender === 'male' ? 130 : 100) + (roll * this.dice(6, 2))
        break 
      case 'elf':
        roll = this.dice(6, 2)
        height = (gender === 'male' ? 53 : 53) + roll
        weight = (gender === 'male' ? 85 : 80) + (roll * this.dice(6, 1))
        break 
      case 'gnome':
        roll = this.dice(4, 2)
        height = (gender === 'male' ? 36 : 34) + roll
        weight = (gender === 'male' ? 40 : 35) + roll
        break 
      case 'half-orc':
        roll = this.dice(12, 2)
        height = (gender === 'male' ? 58 : 53) + roll
        weight = (gender === 'male' ? 150 : 110) + (roll * this.dice(6, 2))
        break 
      case 'halfling':
        roll = this.dice(4, 2)
        height = (gender === 'male' ? 32 : 30) + roll
        weight = (gender === 'male' ? 30 : 25) + roll
        break;
      default: // human
        roll = this.dice(10, 2)
        height = (gender === 'male' ? 58 : 53) + roll
        weight = (gender === 'male' ? 120 : 85) + (roll * this.dice(4, 2))
    }
    
    let feet = Math.floor(height/12)
    let inches = height%12
    height = `${feet} ft. ${inches} in.`
    weight = `${weight} lb.`
    return { height, weight }
  }
  
}