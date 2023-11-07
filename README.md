# Poker AI Assistant Project (Poker Bot)

## Introduction
This is a project I started in order to further familiarize myself with Python and web development. Since this is a smaller project, I've decided to use Flask as my framework and make use of an AI API. I thought that this project could be very interesting and useful to someone who enjoys poker, but wants to improve their statistical and strategical moves in the game. I also intend to use this program in order to improve my own playing, so I would like to make this application as practical as I can.

## Scope
Features that will be implemented into this program will be as follows:
* Move Breakdown
  - The choices of poker are limited to: Check, Call, Fold, Raise, and All-in, there will be a breakdown on each of these moves along with statistical chances associated with them
  - There will also be an in-depth description for each move in order to teach the player why the statistics are the way that they are
* Risk management
  - The user will be prompted on what kind of playstyle is desired (Risky, Safe, Moderate).
  - The user will be able to change their playstyle any time of the game
* Move Recommendation
  - There will be a specialized recommendation that takes into account statistics, play style, and the amount of money
* Summary
  - There will be a end-of-game summary giving an explanation of how the game went, how much you've deviated away from your playstyle, and how you could improve in the future.

## Endpoint Documentation
### Game Information
* Endpoint name: Game Information
* Description: Initial Game Information (Number of Players, Budget, Ante, Playstyle)
* Endpoint Type: GET
* Endpoint: \initial_info\
* Parameters: Strings
* Return Type: JSON

