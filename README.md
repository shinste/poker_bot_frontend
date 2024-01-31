# Poker AI Assistant Project (Poker Bot)

## Introduction
This is a project I started in order to further familiarize myself with Python and web development. Since this is a smaller project, I've decided to use Flask as my framework and make use of an AI API. I thought that this project could be very interesting and useful to someone who enjoys poker, but wants to improve their statistical and strategical moves in the game. I also intend to use this program in order to improve my own playing, so I would like to make this application as practical as I can.

## Scope
Features that will be implemented into this program will be as follows:
* Game Play
  - Being able to play the game while acquiring useful advice can help you get experience that will improve your real-time strategies and decisions
  - There will be variability with pots, players and antes that the user can edit in order to fit their desired game settings
* Move Recommendation
  - There will be a specialized recommendation that takes into account statistics, play style, and the amount of money
* Summary
  - There will be a end-of-game summary giving an explanation of how the game went, how much you've deviated away from your playstyle, and how you could improve in the future.

## Endpoint Documentation
### Game Information
* Endpoint name: Game Information
* Description: Initial Game Information (Number of Players, Budget,  Ante, Playstyle)
* Endpoint Type: POST
* Endpoint: \initial_info\
* Parameters: Strings
* Return Type: JSON

### Turn
* Endpoint name: Game Information
* Description: Input the user's game settings information and give it to API
* Endpoint Type: POST
* Endpoint: \turn_info\
* Parameters: Strings
* Return Type: JSON

### Recommendation
* Endpoint name: Recommendation
* Description: Provide a couple recommendations based on statistics, play style, and budget
* Endpoint Type: GET
* Endpoint: \recommend\
* Parameters: Strings
* Return Type: JSON 


