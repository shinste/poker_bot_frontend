# Poker AI Assistant Project (Poker Bot Main Documentation)

## Introduction
Hello, welcome to my poker AI assistant platform, where players can elevate their poker skills with real-time AI analysis and recommendations. Whether you're a seasoned pro or a newcomer to the poker scene, this project provides personalized assistance, strategic insights, and smooth gameplay that will sharpen your skills.

I chose to develop this project with the goal of deepning my understanding of web development and enhancing user experience. Choosing React as my frontend framework, and implementing OpenAI into a Django backend, I saw an opportunity to create a practical and entertaining way to utilize AI for learning. 

I was driven to develope a single-page application in order to focus directly on functionality and usability for the user. I've also decided to minimize the use of API calls and abstaining from using a database. This approach not only refined my TypeScript proficiency but also improve my problem-solving and debugging skills in ReactJS. By centralizing the application's logic in the frontend, I aim to craft a simple yet effective learning tool for people to enhance their poker strategy through experience.

## Hosted Project
* [PokerBot](https://main--pokerbot.netlify.app/)
  - Hosted Through Netlify
### 
* [Backend Documentation](https://github.com/shinste/poker_bot_backend)
  - Hosted Through AWS

## Scope
Poker Bot allows you to play unlimited games of poker with computer AI opponents. It provides adjustable settings for different levels of play and specific betting amounts. Instead of dollars, the currency used to gamble in this program are simply "Chips". Before you play, you will first be prompted to adjust the number of opponents to play, buy in ammount, big bet amount, and difficulty.
* Gameplay
  - Gameplay-wise, the program will operate under the rules of Texas Hold 'Em. It will implement small blinds, big blinds, minimum reraises, and many more. There will be a couple of caveats to the rules that will be mentioned below
  - There will be variability with pots, players and antes that the user can edit in order to fit their desired game settings
  - Opponent cards will be shown at the end of the game, or if you have folded. 
* Move Recommendation
  - Not sure what to do? Opt for the "Give me a suggestion" button that will prompt an AI to generate advice based on your hand, community cards, and opponent moves. AI isn't perfect, so it isn't impossible for the advice or given information is exactly correct!
* Feed Back
  - There will be a end-of-game summary button that prompts AI to give an explanation of how the current game went, what you've played well, and how you could improve in the future.
* Exceptions to the rules
  - All In Winnings: Under normal rules, what happens when you win a round after going all in, but other players had bet more money than the amount that you pushed? That winner gains ONLY that amount from each player, but the rest of the money is then seen as a sidepot, and it will go to the player with the second best hand. In this program, only the former part of this rule applies. The winner receives their rightful share of money, but the rest of the money is sent back to their rightful owners.




