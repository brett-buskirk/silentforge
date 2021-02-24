import DND from './D&D'

export default {

  async updateCharacter(character) {
    /* ============================================================================================
      FETCH CLASS DETAILS FROM DATABASE
    ============================================================================================ */

    const classDetails = (character.class)
      ? await fetch(`/api/class/${character.class}`).then(res => res.json())
      : null
    

    /* ============================================================================================
      FETCH RACE DETAILS FROM DATABASE
    ============================================================================================ */

    const raceDetails = (character.race)
      ? await fetch(`/api/race/${character.race}`).then(res => res.json())
      : null
    

    /* ============================================================================================
      ADJUST ABILITY SCORES
    ============================================================================================ */

    // Set character's racial ability adjustments
    character.abilities.str.race = (raceDetails) ? raceDetails.abilAdj.str : 0
    character.abilities.dex.race = (raceDetails) ? raceDetails.abilAdj.dex : 0
    character.abilities.con.race = (raceDetails) ? raceDetails.abilAdj.con : 0
    character.abilities.int.race = (raceDetails) ? raceDetails.abilAdj.int : 0
    character.abilities.wis.race = (raceDetails) ? raceDetails.abilAdj.wis : 0
    character.abilities.cha.race = (raceDetails) ? raceDetails.abilAdj.cha : 0
    
    // Tally up the total ability scores
    const dex = DND.getTotalAbilityScore(character.abilities.dex)
    const con = DND.getTotalAbilityScore(character.abilities.con)
    const int = DND.getTotalAbilityScore(character.abilities.int)
    const wis = DND.getTotalAbilityScore(character.abilities.wis)
    
    // Get ability modifiers
    const dexMod = DND.calculateAbilityModifier(dex)
    const conMod = DND.calculateAbilityModifier(con)
    const intMod = DND.calculateAbilityModifier(int)
    const wisMod = DND.calculateAbilityModifier(wis)
    
    
    /* ============================================================================================
      ADJUST SKILLS
    ============================================================================================ */

    // Multiply inital skill points by 4 if a class is selected
    let skillPoints = (classDetails) ? (classDetails.skillPoints + intMod) * 4 : 0

    // Add 4 skill points if the character is a human
    if (character.race === 'human') skillPoints += 4

    // Set the character's skill points
    character.skillPoints = skillPoints

    // Adjust racial skill bonuses
    for (let i = 0; i < character.skills.length; i++) {
      let { name } = character.skills[i]
      if (raceDetails) {
        let bs = raceDetails.bonusSkills.includes(name)
        character.skills[i].race = bs ? 2 : 0
      } else {
        character.skills[i].race = 0
      }
    }

    // Remove any skills that have no ranks
    character.skills = character.skills.filter(skill => skill.ranks)

    // Add any racial skills
    if (raceDetails) {
      raceDetails.skills.forEach(skill => character.skills.push(skill))
    }
  

    /* ============================================================================================
      CALCULATE SAVING THROWS
    ============================================================================================ */

    // Determine "good" or "poor" save types
    const calcSave = (type) => (type === 'poor') ? 0 : 2

    // Assign basic saves
    character.saves.fort.basic = (classDetails) ? calcSave(classDetails.saves.fort) : 0
    character.saves.ref.basic = (classDetails) ? calcSave(classDetails.saves.ref) : 0
    character.saves.will.basic = (classDetails) ? calcSave(classDetails.saves.will) : 0

    // Assign ability modifiers
    character.saves.fort.abil = conMod
    character.saves.ref.abil = dexMod
    character.saves.will.abil = wisMod
  
  
    /* ============================================================================================
      CALCULATE HIT POINTS
    ============================================================================================ */

    character.hp = (classDetails) ? classDetails.hitDie + conMod : 0
  
  
    /* ============================================================================================
      CALCULATE MONEY
    ============================================================================================ */

    // Determine base gold piece allotment
    let money = (classDetails) ? classDetails.gold : 0

    // Set remaining money
    let remainingMoney = money

    // Subtract existing equipment costs from money
    if (character.equipment.length) {
      character.equipment.forEach(equip => remainingMoney -= (equip.cost * equip.qty))
    }

    // Subtract existing weapon costs from money
    if (character.weapons.length) {
      character.weapons.forEach(weap => remainingMoney -= (weap.cost * weap.qty))
    }

    // Subtract existing armor costs from money
    if (character.armor.length) {
      character.armor.forEach(armor => remainingMoney -= (armor.cost * armor.qty))
    }

    // Assign calculated money to character
    character.remainingMoney = remainingMoney.toFixed(2)
    character.money = money
  

    /* ============================================================================================
      ASSIGN SPEED
    ============================================================================================ */

    character.speed = (raceDetails) ? raceDetails.speed : 30


    /* ============================================================================================
      ASSIGN SIZE
    ============================================================================================ */

    character.size = (raceDetails) ? raceDetails.size : 'Medium'


    /* ============================================================================================
      ASSIGN BASE ATTACK BONUS
    ============================================================================================ */

    character.bab = (classDetails)
      ? classDetails.bab === 'good' ? 1 : 0
      : 0

  
    /* ============================================================================================
      ASSIGN CLASS FEATURES
    ============================================================================================ */

    character.classFeatures = (classDetails) ? classDetails.special[1] : []
    if (character.favoredEnemy) {
      character.classFeatures[0] = character.favoredEnemy
    }

    character.weaponProf = (classDetails) ? classDetails.weaponProf : []
    character.armorProf = (classDetails) ? classDetails.armorProf : []
    character.allowedAlignments = (classDetails) 
      ? classDetails.alignments 
      : [
          'Chaotic Good',
          'Chaotic Neutral',
          'Chaotic Evil',
          'Neutral Good',
          'Neutral',
          'Neutral Evil',
          'Lawful Good',
          'Lawful Neutral',
          'Lawful Evil'
        ]


    /* ============================================================================================
      ASSIGN RACIAL FEATURES
    ============================================================================================ */

    character.raceFeatures = (raceDetails) ? raceDetails.features : []

    if (!character.details.age) {
      character.details.age = (raceDetails && classDetails) 
        ? DND.startingAge(character.race, character.class) 
        : 0
  
      character.details.height = (raceDetails) 
        ? DND.startingHeightWeight(character.race, character.details.gender).height 
        : `0' 0"`
  
      character.details.weight = (raceDetails) 
        ? DND.startingHeightWeight(character.race, character.details.gender).weight 
        : `0 lb.`
    }


    /* ============================================================================================
      ASSIGN LANGUAGES
    ============================================================================================ */

    character.languages = (raceDetails) ? raceDetails.autoLang : ['Common']

  
    /* ============================================================================================
      ASSIGN CLASS AND RACIAL FEATS
    ============================================================================================ */

    // Remove any class or race feats
    character.feats = character.feats.filter(feat => !feat.race && !feat.class)

    // Add class feats
    if (classDetails) {
      // Grab the first level special features
      let features = classDetails.special[1]
      // Set regex looking for "bf_" prefix
      let regex = /^bf_/
      for (let i = 0; i < features.length; i++) {
        // If bonus feats are found, push them into the character's feats array
        if (regex.test(features[i])) {
          character.feats.push({ 
            name: features[i].replace('bf_', ''), 
            focus: null, 
            class: true, 
            race: false 
          })
        }
      }
    }
    
    // Add any racial feats
    if (raceDetails) {
      raceDetails.feats.forEach(feat => character.feats.push({ name: feat, race: true, class: false }))
    }
  
  
    /* ============================================================================================
      ASSIGN SPELL-RELATED FEATURES
    ============================================================================================ */
    character.cl = classDetails ? classDetails.cl : 0
    character.domains = []
    character.spellsKnown = (classDetails) ? classDetails.spellsKnown[1] : []
    character.spellsPerDay = (classDetails) ? classDetails.spellsPerDay[1] : []
    character.spellList = character.spellList || []
  

    /* ============================================================================================
      RETURN THE UPDATED CHARACTER
    ============================================================================================ */

    return character

  }
}