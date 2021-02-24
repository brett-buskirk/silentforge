# SilentForge Character Creation Engine #
This app is designed to build characters for v3.5 Dungeons & Dragons games.  
To get started, go to the project's root directory and run the following:

```bash
  npm install
  npm run seed
  npm start
```

## _`How Do I Use This Thing?`_ ##

Follow the steps below to use this website

### _`For Starters...`_ ###

* The first thing you should do is go to the `First Steps` page.
* Either select an existing character `or` Create a new character by supplying a name and/or brief description.
* You will need to confirm or cancel your selection.
* Once this process is done, you should now be on the `Class` page.

### _`Select A Class`_ ###

* If you picked an existing character, it should already have a class (go to the `Preview` page to see what it is).
* You can change the existing class of a character, or select one for a new character, by clicking one of the class buttons on this page.
* You will need to confirm or cancel your selection.
* Once you do this, you should now be on the `Race` page.

### _`Select A Race`_ ###

* If you picked an existing character, it should already have a race (go to the `Preview` page to see what it is).
* You can change the existing race of a character, or select one for a new character, by clicking one of the race buttons on this page.
* You will need to confirm or cancel your selection.
* Once you do this, you should now be on the `Abilities` page.

### _`Assign Ability Scores`_ ###

* If you picked an existing character, it may already have ability scores assigned (feel free to change them).
* The `Campaign Points` are determined by the type of campaign selected. The tougher the campaign, the more points you get to spend on ability scores.
* Ability scores all start at 8 for 0 points. They do not scale linearly. Instead, they use this format:
          <table>
            <thead>
              <tr>
                <td>`Score`</td>
                <td>`Points`</td>
                <td>`Score`</td>
                <td>`Points`</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>9</td>
                <td>1</td>
                <td>14</td>
                <td>6</td>
              <tr>
              <tr>
                <td>10</td>
                <td>2</td>
                <td>15</td>
                <td>8</td>
              <tr>
              <tr>
                <td>11</td>
                <td>3</td>
                <td>16</td>
                <td>10</td>
              <tr>
              <tr>
                <td>12</td>
                <td>4</td>
                <td>17</td>
                <td>13</td>
              <tr>
              <tr>
                <td>13</td>
                <td>5</td>
                <td>18</td>
                <td>16</td>
              <tr>
            </tbody>
          </table>
* You can adjust the scores by using the number spinners, and your total remaining points will be displayed below the scores (it will turn red if you spend too many points).
* You can save your score selections by clicking the `Save Scores` button.
* You will need to confirm your selections.
* Once you do this, you should now be on the `Features` page.

### _`Assign Features`_ ###

* You can assign basic features to your character like: age, height, weight, and so on.
* Some classes have additional features that must be determined by the player. Those are set here, as well.

### _`Assign Skills`_ ###

* You can assign skills by spending skill points.
* Your character's remaining skill points is at the top of the skill table.
* `cs` = class skills. class skills can be purchased at a rate of 1 rank per skill point. Cross class skills cost twice as much.
* You can only have a max of 4 ranks in any skill starting out.
* Once you have made your skill selections, you can save them by clicking the `Save Skills` button.
* Once you do this, you should now be on the `Feats` page.

### _`Pick Feats`_ ### 

* You can assign feats as permitted by your character.
* You can click `View Feat Details` to see a list of all feats and their prerequisites.
* You must meet all the feat prerequisites to select it.
* Once you have made all your choices, click the `Save Feats` button.
* Once you do this, you should now be on the `Equipment` page.

### _`Equipment`_ ###

* You can pick your character's equipment here.
* There are three categories to choose from: Weapons, Armor, and Gear.
* A running total of your remaining gold will be kept as you shop.
* Once you have added all of your equipment, click the `BUY` button.
* Once you do this, you should now be on the `Preview` page.

### _`Preview`_ ###

* This page shows the character as it currently exists. You can print the character by clicking the `Print` button.

## _`Notes and Other Information`_ ##
 * You can change any of the character's details (race, class, abilities, skills, etc.) at any point by going to the appropriate page and making the change. You can go to the `Preview` page at any point to see the changes.
 * This project has a built-in delay to simulate server lag from bewteen 500 and 1500ms per request. To disable this feature, go to `server/app.js` and comment out the following lines:

  ```js
    17  // Time delay to simulate lagging
    18  app.use((req, res, next) => {
    19    let lag = Math.floor(Math.random() * 1000) + 500
    20    console.log(req.method, req.url, 'lag:', lag)
    21    setTimeout(() => next(), lag)
    22  })
  ```
  * I've tried to make the app responsive as possible, so feel free to check it at various sizes. You can hide or show the navbar by clicking on the `SF` navbrand at the top left.